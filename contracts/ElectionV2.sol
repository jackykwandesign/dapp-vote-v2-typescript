// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.8.3 <0.9.0;
/// @title Voting with delegation.
import "./ConvertLib.sol";

contract ElectionV2 {
        // constructor
    constructor() {
        // candidate = "Candidate 1";
        // addCandidate("Candidate 1",0);
        // addCandidate("Candidate 2",0);
        // addCandidate("Candidate 3",0);
    }

    struct VoteOption {
        uint id;
        string name;
    }

    struct Vote {
        uint id;
        string name;
        uint totalVotes;
        string organizerName;
        address organizerAddress;
        string publicKey;
        // VoteOptions[] voteOptions;
        uint voteOptionCount;
        mapping(uint => VoteOption) voteOptions;
        // VoteOption[] voteOptions;
    }

    // // Store voteCounts count
    uint public voteCounts;

    mapping(uint => Vote) public votes;

    mapping(address => uint[]) public myVotes;  
    // // Model a Candidate
    // struct Candidate{
    //     uint id;
    //     string name;
    //     uint voteCount;
    // }

    // // Store accounts that voted
    // mapping(address => bool) public voters;

    // // Store candidate
    // // Fetch candidate
    // mapping(uint => Candidate) public candidates;

    // // Store Candidate count
    // uint public candidatesCount;

    function addVote (string memory _name, string memory _organizerName, string memory _publicKey,string[] memory _options) public{

        require(_options.length > 0 && _options.length <= 20,"Vote options must more than 0 and less or equal than 20");
        voteCounts++;
        Vote storage v = votes[voteCounts];
        v.id = voteCounts;
        v.name = _name;
        v.organizerAddress = msg.sender;
        v.organizerName = _organizerName;
        v.publicKey = _publicKey;
        v.totalVotes = 0;
        v.voteOptionCount = 0;
        myVotes[msg.sender].push(v.id);

        v.voteOptionCount = _options.length;
        for(uint i = 1; i <= v.voteOptionCount; i++){
            VoteOption storage vOption = v.voteOptions[i];
            vOption.id = i;
            vOption.name = _options[i-1];
        }
    }

    function getMyVotes() external view returns(uint[] memory) {
        return myVotes[msg.sender];
    }

    function getVoteOptionOfVote(uint voteID, uint optionID) public view returns(string memory name) {
        return votes[voteID].voteOptions[optionID].name;
    }
    // function addVoteOption(uint voteID, string memory _name) public{
    //             // check if voted, reject if voted
    //     require(
    //         votes[voteID].organizerAddress == msg.sender,
    //         "Only Organizer can addVoteOption."
    //     );
    // }
    // function vote (uint _candidateId) public{

    //     // the require must put in the beginning, since the gas will burn until require block, so it is a must to put at the beginning 

    //     // check if voted, reject if voted
    //     require(
    //         !voters[msg.sender],
    //         "No double vote."
    //     );

    //     //check validate candidateId
    //     require(
    //         _candidateId > 0 &&  _candidateId  <= candidatesCount,
    //         "Invalid candidate id. "
    //     );

    //     // record voter has voted 
    //     // msg.sender is account send this request
    //     voters[msg.sender] = true;

    //     // update candidate vote count
    //     candidates[_candidateId].voteCount++;

    // }
}