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

    struct VoteTicket {
        uint id;
        string encryptedBallot;
        string signature;
    }

    struct Vote {
        uint id;
        string name;
        string organizerName;
        address organizerAddress;
        string publicKey;
        string privateKey;

        uint voteOptionCount;
        mapping(uint => VoteOption) voteOptions;
        mapping(uint => uint) voteResults;

        uint totalVoteCount;
        mapping(uint => VoteTicket) voteTickets;

        bool voteEnd;
    }

    // // Store contractVoteCounts count
    uint public contractVoteCounts;

    mapping(uint => Vote) public contractVotes;

    mapping(address => uint[]) public myOrganizedVotes;  

    function addVote (string memory _name, string memory _organizerName, string memory _publicKey,string[] memory _options) public{

        require(_options.length > 0 && _options.length <= 20,"Vote options must more than 0 and less or equal than 20");
        contractVoteCounts++;
        Vote storage v = contractVotes[contractVoteCounts];
        v.id = contractVoteCounts;
        v.name = _name;
        v.organizerAddress = msg.sender;
        v.organizerName = _organizerName;
        v.publicKey = _publicKey;
        v.totalVoteCount = 0;
        v.voteOptionCount = 0;
        v.voteEnd = false;
        myOrganizedVotes[msg.sender].push(v.id);

        v.voteOptionCount = _options.length;
        for(uint i = 1; i <= v.voteOptionCount; i++){
            VoteOption storage vOption = v.voteOptions[i];
            vOption.id = i;
            vOption.name = _options[i-1];
        }
    }

    function getMyOrganizedVotes() external view returns(uint[] memory) {
        return myOrganizedVotes[msg.sender];
    }

    function getVoteOptionsByVoteID(uint voteID) public view returns(VoteOption[] memory) {
        require(voteID > 0 && voteID <= contractVoteCounts, "voteID must less than contractVoteCounts");
        Vote storage v = contractVotes[voteID];
        VoteOption [] memory voteOptions = new VoteOption[](v.voteOptionCount);
        for(uint i = 1; i <= v.voteOptionCount; i++){
            voteOptions[i - 1] = v.voteOptions[i];
        }
        return voteOptions;
    }

    function getVoteTicketsByVoteID(uint voteID) public view returns(VoteTicket[] memory) {
        require(voteID > 0 && voteID <= contractVoteCounts, "voteID must less than contractVoteCounts");
        Vote storage v = contractVotes[voteID];
        VoteTicket [] memory tickets = new VoteTicket[](v.totalVoteCount);
        for(uint i = 1; i <= v.totalVoteCount; i++){
            tickets[i - 1] = v.voteTickets[i];
        }
        return tickets;
    }

    function getVoteResultsByVoteID(uint voteID) public view returns(uint[] memory) {
        require(voteID > 0 && voteID <= contractVoteCounts, "voteID must less than contractVoteCounts");
        Vote storage v = contractVotes[voteID];
        uint [] memory results = new uint[](v.voteOptionCount);
        for(uint i = 1; i <= v.voteOptionCount; i++){
            results[i - 1] = v.voteResults[i];
        }
        return results;
    }

    function caseVoteByVoteID(uint voteID, string memory _encryptedBallot, string memory _signature) public{
        require(voteID > 0 && voteID <= contractVoteCounts, "voteID must less than contractVoteCounts");
        Vote storage v = contractVotes[voteID];
        require(v.voteEnd == false, "Vote is end");
        v.totalVoteCount++;
        VoteTicket storage vt = v.voteTickets[v.totalVoteCount];
        vt.id = v.totalVoteCount;
        vt.encryptedBallot = _encryptedBallot;
        vt.signature = _signature;
    }

    function endVoteByVoteID(uint voteID, string memory _privateKey, uint[] memory voteOptionSuccessTicketCounts) public{
        require(voteID > 0 && voteID <= contractVoteCounts, "voteID must less than contractVoteCounts");
        Vote storage v = contractVotes[voteID];
        require(v.organizerAddress == msg.sender,"Only Organizer can end the vote");
        require(voteOptionSuccessTicketCounts.length == v.voteOptionCount,"You must upload tickets count of all options");
        v.privateKey = _privateKey;
        for(uint i = 0; i < v.voteOptionCount; i++){
            v.voteResults[i + 1] = voteOptionSuccessTicketCounts[i];
        }
        v.voteEnd = true;
    }

}