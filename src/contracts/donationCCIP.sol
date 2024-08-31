// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {IRouterClient} from "@chainlink/contracts-ccip/src/v0.8/ccip/interfaces/IRouterClient.sol";
import {Client} from "@chainlink/contracts-ccip/src/v0.8/ccip/libraries/Client.sol";
import {CCIPReceiver} from "@chainlink/contracts-ccip/src/v0.8/ccip/applications/CCIPReceiver.sol";
import {LinkTokenInterface} from "@chainlink/contracts/src/v0.8/shared/interfaces/LinkTokenInterface.sol";


interface IDonationChainLink {
    function sendCrosschainDonation(uint256 campaignId, address donor, uint64 destinationChainSelector) external payable;
    function whitelistChain(uint64 chainSelector) external;
    function blacklistChain(uint64 chainSelector) external;
}

contract DonationChainLink is CCIPReceiver, IDonationChainLink {
    IRouterClient private immutable i_router;
    LinkTokenInterface private immutable i_linkToken;
    address public owner;
    mapping(uint64 => bool) public whitelistedChains;

    event CrossChainDonationSent(uint256 campaignId, address indexed donor, uint256 amount, uint64 destinationChainSelector);
    event CrossChainDonationReceived(uint256 campaignId, address indexed donor, uint256 amount, uint64 sourceChainSelector);

    modifier onlyOwner() {
        require(msg.sender == owner, "Not the owner");
        _;
    }

    constructor(address _router, address _link) CCIPReceiver(_router) {
        i_router = IRouterClient(_router);
        i_linkToken = LinkTokenInterface(_link);
        owner = msg.sender;
    }

    function sendCrosschainDonation(uint256 campaignId, address donor, uint64 destinationChainSelector) external payable override {
        require(whitelistedChains[destinationChainSelector], "Destination chain not whitelisted");
        
        Client.EVM2AnyMessage memory evm2AnyMessage = Client.EVM2AnyMessage({
            receiver: abi.encode(address(this)),
            data: abi.encode(campaignId, donor, msg.value),
            tokenAmounts: new Client.EVMTokenAmount[](0),
            extraArgs: Client._argsToBytes(
                Client.EVMExtraArgsV1({gasLimit: 200_000})
            ),
            feeToken: address(i_linkToken)
        });

        uint256 fees = i_router.getFee(destinationChainSelector, evm2AnyMessage);
        require(i_linkToken.balanceOf(address(this)) >= fees, "Not enough LINK for fees");

        i_linkToken.approve(address(i_router), fees);
        
        bytes32 messageId = i_router.ccipSend(destinationChainSelector, evm2AnyMessage);
        
        emit CrossChainDonationSent(campaignId, donor, msg.value, destinationChainSelector);
    }

    function _ccipReceive(Client.Any2EVMMessage memory message) internal override {
        (uint256 campaignId, address donor, uint256 amount) = abi.decode(message.data, (uint256, address, uint256));
        emit CrossChainDonationReceived(campaignId, donor, amount, message.sourceChainSelector);
    }

    function whitelistChain(uint64 chainSelector) external override onlyOwner {
        whitelistedChains[chainSelector] = true;
    }

    function blacklistChain(uint64 chainSelector) external override onlyOwner {
        whitelistedChains[chainSelector] = false;
    }

    function withdrawLink() external onlyOwner {
        uint256 balance = i_linkToken.balanceOf(address(this));
        require(i_linkToken.transfer(msg.sender, balance), "Unable to transfer LINK");
    }
}