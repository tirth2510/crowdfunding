// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

contract CrowdFunding {
    struct Campaign {
        string title;
        uint256 target;
        string description;
        uint256 deadline;
        address[] donators;
        uint256[] donations;
        uint256 amountCollected;
        address owner;
        string image;

    }

    mapping(uint256 => Campaign) public campaigns;

    uint256 public numberOfCampaigns = 0;

    function createCampaign(address  _owner, string memory _title, uint256  _target, string memory _description, uint256 _deadline, string memory _image) public returns 
    (uint256) { 
        Campaign storage campaign = campaigns[numberOfCampaigns];

        require(campaign.deadline <block.timestamp, "The deadline must be a date in the future");

        campaign.owner = _owner;
        campaign.title = _title;
        campaign.target = _target;
        campaign.description = _description;
        campaign.deadline = _deadline;
        campaign.image = _image;

        campaign.amountCollected = 0;

        numberOfCampaigns++; 

        return numberOfCampaigns - 1;
        
    }

    function donateToCampaign(uint _id) public payable {
        uint amount = msg.value;

        Campaign storage campaign = campaigns[_id]; 

        campaign.donators.push(msg.sender);
        campaign.donations.push(amount);

        (bool sent, ) = payable(campaign.owner).call{value: amount}("");

        if(sent){
            campaign.amountCollected = campaign.amountCollected + amount;
        }
        
    } 

    function getDonators (uint _id) view public returns (address[] memory, uint256[] memory) {
        return (campaigns[_id].donators, campaigns[_id].donations); // returns campaign.donators;
    }

    function getCampaigns() view public returns (Campaign[] memory ) {
        Campaign[] memory allCampaigns = new Campaign[](numberOfCampaigns);
        for(uint i = 0; i < numberOfCampaigns; i++){
            Campaign storage campaign = campaigns[i];
            allCampaigns[i]= campaign;  

            
        }

        return allCampaigns;
        

    }

    

    
}
    
        
    

