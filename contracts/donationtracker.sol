// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;



contract DonationTracker {

    struct Campaign {
        address creator;
        string title;
        string description;
        uint256 goal;         
        uint256 raised;      
        uint256 withdrawn;    
        string coverImage;
        bool active;
        uint256 withdrawalCount;
        address[] admins;
        uint256 creationFee;
        bool lastWithdrawalProofUploaded;
    }

    struct Withdrawal {
        uint256 amount;      
        address admin;
        string reason;
        uint256 timestamp;
        string proofUrl;  
        bool proofUploaded;
    }

    struct Organization {
        string name;
        string taxId;
        string physicalAddress;
        string phoneNumber;
        string email;
        string website;
        string socialMedia;
        string registrationProof;
        bool registered;
        uint256[] campaignIds;
    }

    struct Individual {
        string fullName;
        uint256 age;
        string addressDetail;
        string medicalCondition;
        string requiredTreatment;
        string timeline;
        string email;
        string phoneNumber;
        uint256 campaignId;
    }

    uint256 private constant INDIVIDUAL_FEE = 7300000000000000 wei; // 0.0073 ETH or 20 dollars
    uint256 private constant ORGANIZATION_FEE = 36000000000000000 wei; // 0.036 ETH or 100 dollars
    uint256 public campaignCount;
    uint256 public activeCampaignCount;

    mapping(address => Organization) public organizations;
    mapping(address => Individual) public individuals;
    mapping(uint256 => Campaign) public campaigns;
    mapping(uint256 => mapping(uint256 => Withdrawal)) public withdrawals;
    mapping(uint256 => address[]) public campaignDonors;
    mapping(uint256 => mapping(address => uint256)) public donations;

    mapping(address => bool) public registeredAddresses;

    event CampaignCreated(uint256 campaignId, address indexed creator);
    event DonationReceived(uint256 campaignId, address indexed donor, uint256 amount);
    event WithdrawalMade(uint256 campaignId, address indexed admin, uint256 amount);
    event WithdrawalMade(uint256 campaignId, address indexed admin, uint256 amount, uint256 withdrawalId);
    event ProofUploaded(uint256 campaignId, uint256 withdrawalId, string proofUrl);
    event CampaignEnded(uint256 campaignId, address creator, uint256 refundedFee);


    modifier onlyCreator(uint256 campaignId) {
        require(campaigns[campaignId].creator == msg.sender, "Not the creator");
        _;
    }

    modifier onlyRegisteredOrganization() {
        require(organizations[msg.sender].registered, "Organization not registered");
        _;
    }

    modifier onlyActiveCampaign(uint256 campaignId) {
        require(campaigns[campaignId].active, "Campaign not active");
        _;
    }

    modifier notRegistered() {
        require(!registeredAddresses[msg.sender], "Address already registered");
        _;
    }

    constructor() {
        campaignCount = 0;
        activeCampaignCount = 0;
    }

    function registerOrganization(
        string memory name,
        string memory taxId,
        string memory physicalAddress,
        string memory phoneNumber,
        string memory email,
        string memory website,
        string memory socialMedia,
        string memory registrationProof
    ) public notRegistered {
        organizations[msg.sender] = Organization({
            name: name,
            taxId: taxId,
            physicalAddress: physicalAddress,
            phoneNumber: phoneNumber,
            email: email,
            website: website,
            socialMedia: socialMedia,
            registrationProof: registrationProof,
            registered: true,
            campaignIds: new uint256[](0)
        });
        registeredAddresses[msg.sender] = true;
    }

    function registerIndividual(
        string memory fullName,
        uint256 age,
        string memory addressDetail,
        string memory medicalCondition,
        string memory requiredTreatment,
        string memory timeline,
        string memory email,
        string memory phoneNumber
    ) public notRegistered {
        individuals[msg.sender] = Individual({
            fullName: fullName,
            age: age,
            addressDetail: addressDetail,
            medicalCondition: medicalCondition,
            requiredTreatment: requiredTreatment,
            timeline: timeline,
            email: email,
            phoneNumber: phoneNumber,
            campaignId: 0
        });
        registeredAddresses[msg.sender] = true;
    }

    function isRegisteredAsIndividual(address addr) public view returns (bool) {
        return individuals[addr].age > 0; 
    }

    function isRegisteredAsOrganization(address addr) public view returns (bool) {
        return organizations[addr].registered;
    }

    function createCampaign(
        string memory title,
        string memory description,
        uint256 goal,
        string memory coverImage
    ) public payable {
        require(goal > 0, "Goal must be greater than 0");
        bool isIndividual = isRegisteredAsIndividual(msg.sender);
        bool isOrganization = isRegisteredAsOrganization(msg.sender);
        require(isIndividual || isOrganization, "Must be registered as individual or organization");
        
        uint256 requiredFee = isIndividual ? INDIVIDUAL_FEE : ORGANIZATION_FEE;
        require(msg.value == requiredFee, "Incorrect fee amount");

        if (isIndividual) {
            require(individuals[msg.sender].campaignId == 0, "Individual can only create one campaign");
        }

        campaignCount++;
        activeCampaignCount++;
        campaigns[campaignCount] = Campaign({
            creator: msg.sender,
            title: title,
            description: description,
            goal: goal,
            raised: 0,
            withdrawn: 0,
            coverImage: coverImage,
            active: true,
            withdrawalCount: 0,
            admins: new address[](0),
            creationFee: requiredFee,
            lastWithdrawalProofUploaded: true 
        });

        if (isIndividual) {
            individuals[msg.sender].campaignId = campaignCount;
        } else {
            organizations[msg.sender].campaignIds.push(campaignCount);
        }

        emit CampaignCreated(campaignCount, msg.sender);
    }

    function donate(uint256 campaignId) public payable {
        require(campaigns[campaignId].active, "Campaign not active");
        require(msg.value > 0, "Donation must be greater than 0");
        require(!registeredAddresses[msg.sender], "Registered organizations and individuals cannot donate");

        Campaign storage campaign = campaigns[campaignId];
        campaign.raised += msg.value;
        donations[campaignId][msg.sender] += msg.value;
        campaignDonors[campaignId].push(msg.sender);

        emit DonationReceived(campaignId, msg.sender, msg.value);
    }


    function withdraw(uint256 campaignId, uint256 amount, string memory reason) public onlyCreator(campaignId) {
        Campaign storage campaign = campaigns[campaignId];
        require(campaign.active, "Campaign is not active");
        require(campaign.raised - campaign.withdrawn >= amount, "Not enough funds");
        
        if (campaign.withdrawalCount > 0) {
            require(campaign.lastWithdrawalProofUploaded, "Proof for previous withdrawal not uploaded");
        }

        campaign.withdrawn += amount;
        campaign.withdrawalCount++;
        campaign.lastWithdrawalProofUploaded = false;
        
        uint256 withdrawalId = campaign.withdrawalCount;
        withdrawals[campaignId][withdrawalId] = Withdrawal({
            amount: amount,
            admin: msg.sender,
            reason: reason,
            timestamp: block.timestamp,
            proofUrl: "",
            proofUploaded: false
        });

        payable(msg.sender).transfer(amount);

        emit WithdrawalMade(campaignId, msg.sender, amount, withdrawalId);
    }

    function uploadWithdrawalProof(uint256 campaignId, uint256 withdrawalId, string memory proofUrl) public onlyCreator(campaignId) {
        Campaign storage campaign = campaigns[campaignId];
        Withdrawal storage withdrawal = withdrawals[campaignId][withdrawalId];
        
        require(!withdrawal.proofUploaded, "Proof already uploaded for this withdrawal");
        require(withdrawalId == campaign.withdrawalCount, "Can only upload proof for the latest withdrawal");

        withdrawal.proofUrl = proofUrl;
        withdrawal.proofUploaded = true;
        campaign.lastWithdrawalProofUploaded = true;

        emit ProofUploaded(campaignId, withdrawalId, proofUrl);
    }

    function getWithdrawalDetails(uint256 campaignId, uint256 withdrawalId) public view returns (Withdrawal memory) {
        return withdrawals[campaignId][withdrawalId];
    }

    function getCampaignDetails(uint256 campaignId) public view returns (Campaign memory) {
        return campaigns[campaignId];
    }

    function getWithdrawal(uint256 campaignId, uint256 withdrawalId) public view returns (Withdrawal memory) {
        return withdrawals[campaignId][withdrawalId];
    }

    function getAllWithdrawals(uint256 campaignId) public view returns (Withdrawal[] memory) {
        Campaign storage campaign = campaigns[campaignId];
        Withdrawal[] memory allWithdrawals = new Withdrawal[](campaign.withdrawalCount);
        for (uint256 i = 1; i <= campaign.withdrawalCount; i++) {
            allWithdrawals[i-1] = withdrawals[campaignId][i];
        }
        return allWithdrawals;
    }

    function endCampaign(uint256 campaignId) public onlyCreator(campaignId) {
        Campaign storage campaign = campaigns[campaignId];
        require(campaign.active, "Campaign is already ended");

        campaign.active = false;
        uint256 refundAmount = campaign.creationFee;
        campaign.creationFee = 0; 
        
        if (activeCampaignCount > 0) {
            activeCampaignCount--;
        }

        
        payable(campaign.creator).transfer(refundAmount);

        emit CampaignEnded(campaignId, campaign.creator, refundAmount);
    }

    function getActiveCampaignCount() public view returns (uint256) {
        return activeCampaignCount;
    }

    function getCampaignDonors(uint256 campaignId) public view returns (address[] memory) {
        return campaignDonors[campaignId];
    }

    function getDonationAmount(uint256 campaignId, address donor) public view returns (uint256) {
        return donations[campaignId][donor];
    }

    function getOrganizationCampaigns(address organizationAddress) public view returns (uint256[] memory) {
        return organizations[organizationAddress].campaignIds;
    }

    function getIndividualCampaign(address individualAddress) public view returns (uint256) {
        return individuals[individualAddress].campaignId;
    }
}