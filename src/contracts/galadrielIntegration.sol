// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IOracle {
    struct GroqRequest {
        string model;
        int8 frequencyPenalty;
        string logitBias;
        uint32 maxTokens;
        int8 presencePenalty;
        string responseFormat;
        uint seed;
        string stop;
        uint temperature;
        uint topP;
        string user;
    }

    struct GroqResponse {
        string id;
        string content;
        uint64 created;
        string model;
        string systemFingerprint;
        string object;
        uint32 completionTokens;
        uint32 promptTokens;
        uint32 totalTokens;
    }

    struct OpenAiImageResponse {
        string[] url;
    }

    function createGroqLlmCall(uint256 promptId, GroqRequest memory request) external returns (uint256);
    function createFunctionCall(uint256 promptId, string memory functionType, string memory functionInput) external returns (uint256);
}

contract CampaignEnhancer {
    struct Content {
        string contentType;
        string value;
    }

    struct Message {
        string role;
        Content[] content;
    }

    struct EnhancementRequest {
        address owner;
        string originalDescription;
        string enhancedDescription;
        string coverImageUrl;
        bool descriptionEnhanced;
        bool imageGenerated;
    }

    mapping(uint256 => EnhancementRequest) public enhancementRequests;
    uint256 private requestCount;

    address private owner;
    IOracle public oracle;

    event RequestCreated(uint256 indexed requestId, address indexed requester);
    event DescriptionEnhanced(uint256 indexed requestId, string enhancedDescription);
    event CoverImageGenerated(uint256 indexed requestId, string imageUrl);

    constructor(address _oracleAddress) {
        owner = msg.sender;
        oracle = IOracle(_oracleAddress);
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Caller is not owner");
        _;
    }

    modifier onlyOracle() {
        require(msg.sender == address(oracle), "Caller is not oracle");
        _;
    }

    function setOracleAddress(address newOracleAddress) public onlyOwner {
        oracle = IOracle(newOracleAddress);
    }

    function enhanceDescription(string memory description) public returns (uint256) {
        uint256 requestId = requestCount++;
        enhancementRequests[requestId] = EnhancementRequest({
            owner: msg.sender,
            originalDescription: description,
            enhancedDescription: "",
            coverImageUrl: "",
            descriptionEnhanced: false,
            imageGenerated: false
        });

        IOracle.GroqRequest memory request = getGroqLlmConfig();
        try oracle.createGroqLlmCall(requestId, request) returns (uint256) {
            emit RequestCreated(requestId, msg.sender);
        } catch Error(string memory reason) {
            revert(string(abi.encodePacked("Oracle call failed: ", reason)));
        } catch (bytes memory) {
            revert("Oracle call failed");
        }

        return requestId;
    }

    function enhanceCoverImage(uint256 requestId) public {
        require(requestId < requestCount, "Invalid request ID");
        require(enhancementRequests[requestId].owner != address(0), "Request does not exist");
        require(enhancementRequests[requestId].owner == msg.sender, "Only the requester can enhance the cover image");
        require(!enhancementRequests[requestId].imageGenerated, "Cover image already generated");
        require(enhancementRequests[requestId].descriptionEnhanced, "Description must be enhanced first");
        
        string memory imagePrompt = string(abi.encodePacked("Generate a cover image for a campaign with the following description: ", enhancementRequests[requestId].enhancedDescription));
        
        try oracle.createFunctionCall(requestId, "image_generation", imagePrompt) returns (uint256) {
            emit RequestCreated(requestId, msg.sender);
        } catch Error(string memory reason) {
            revert(string(abi.encodePacked("Oracle call failed: ", reason)));
        } catch (bytes memory) {
            revert("Oracle call failed");
        }
    }

    function onOracleGroqLlmResponse(
        uint256 requestId,
        IOracle.GroqResponse memory response,
        string memory errorMessage
    ) public onlyOracle {
        EnhancementRequest storage request = enhancementRequests[requestId];
        
        if (bytes(errorMessage).length == 0) {
            request.enhancedDescription = response.content;
            request.descriptionEnhanced = true;
            emit DescriptionEnhanced(requestId, response.content);
        } else {
            emit DescriptionEnhanced(requestId, errorMessage);
        }
    }

    function onOracleFunctionResponse(
        uint256 requestId,
        string memory response,
        string memory errorMessage
    ) public onlyOracle {
        EnhancementRequest storage request = enhancementRequests[requestId];
        
        if (bytes(errorMessage).length == 0) {
            request.coverImageUrl = response;
            request.imageGenerated = true;
            emit CoverImageGenerated(requestId, response);
        } else {
            emit CoverImageGenerated(requestId, errorMessage);
        }
    }

    function getMessageHistory(uint256 requestId) public view returns (Message[] memory) {
        Message[] memory messages = new Message[](1);
        messages[0] = createTextMessage("user", enhancementRequests[requestId].originalDescription);
        return messages;
    }

    function createTextMessage(string memory role, string memory content) private pure returns (Message memory) {
        Message memory newMessage = Message({
            role: role,
            content: new Content[](1)
        });
        newMessage.content[0].contentType = "text";
        newMessage.content[0].value = content;
        return newMessage;
    }

    function getGroqLlmConfig() private pure returns (IOracle.GroqRequest memory) {
        return IOracle.GroqRequest({
            model: "mixtral-8x7b-32768",
            frequencyPenalty: 0,
            logitBias: "",
            maxTokens: 500,
            presencePenalty: 0,
            responseFormat: "{\"type\":\"text\"}",
            seed: 0,
            stop: "",
            temperature: 7,  
            topP: 100,  
            user: ""
        });
    }

    function getEnhancedDescription(uint256 requestId) public view returns (string memory) {
        EnhancementRequest storage request = enhancementRequests[requestId];
        require(request.owner == msg.sender, "Only the requester can view the enhanced description");
        return request.enhancedDescription;
    }

    function getCoverImageUrl(uint256 requestId) public view returns (string memory) {
        EnhancementRequest storage request = enhancementRequests[requestId];
        require(request.owner == msg.sender, "Only the requester can view the cover image URL");
        return request.coverImageUrl;
    }

    function getOracleAddress() public view returns (address) {
        return address(oracle);
    }

    function testOracleConnection() public returns (bool) {
        try oracle.createGroqLlmCall(0, getGroqLlmConfig()) returns (uint256) {
            return true;
        } catch {
            return false;
        }
    }

    function getRequestStatus(uint256 requestId) public view returns (
        bool exists,
        address owner,
        bool descriptionEnhanced,
        bool imageGenerated,
        string memory originalDescription,
        string memory enhancedDescription,
        string memory coverImageUrl
    ) {
        EnhancementRequest storage request = enhancementRequests[requestId];
        return (
            request.owner != address(0),
            request.owner,
            request.descriptionEnhanced,
            request.imageGenerated,
            request.originalDescription,
            request.enhancedDescription,
            request.coverImageUrl
        );
    }

    function getRequestCount() public view returns (uint256) {
        return requestCount;
    }
}