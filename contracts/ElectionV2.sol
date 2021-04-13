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
            voteOptions[i - 1].id = v.voteOptions[i].id;
            voteOptions[i - 1].name = v.voteOptions[i].name;
        }
        return voteOptions;
        // v.voteOptions
        // return contractVotes[voteID].voteOptions[optionID].name;
    }

    function getVoteTicketsByVoteID(uint voteID) public view returns(VoteTicket[] memory) {
        require(voteID > 0 && voteID <= contractVoteCounts, "voteID must less than contractVoteCounts");
        Vote storage v = contractVotes[voteID];
        VoteTicket [] memory tickets = new VoteTicket[](v.totalVoteCount);
        for(uint i = 1; i <= v.totalVoteCount; i++){
            tickets[i - 1].id = v.voteTickets[i].id;
            tickets[i - 1].encryptedBallot = v.voteTickets[i].encryptedBallot;
            tickets[i - 1].signature = v.voteTickets[i].signature;
        }
        return tickets;
        // v.voteOptions
        // return contractVotes[voteID].voteOptions[optionID].name;
    }

    // function getVoteTicketOfVote(uint voteID, uint ticketID) public view returns(VoteTicket memory ticket) {
    //     require(voteID > 0 && voteID <= contractVoteCounts, "voteID must less than contractVoteCounts");
    //     Vote storage v = contractVotes[voteID];
    //     require(v.totalVoteCount > 0 && ticketID <= v.totalVoteCount, "ticketID must less than totalVoteCount");
    //     VoteTicket memory vt = v.voteTickets[ticketID];
    //     // return (vt.id, vt.encryptedBallot, vt.signature);
    //     return vt;
    // }

    function caseVoteByVoteID(uint voteID, string memory _encryptedBallot, string memory _signature) public{
        require(voteID > 0 && voteID <= contractVoteCounts, "voteID must less than contractVoteCounts");
        contractVotes[voteID].totalVoteCount++;
        VoteTicket storage vt = contractVotes[voteID].voteTickets[contractVotes[voteID].totalVoteCount];
        vt.id = contractVotes[voteID].totalVoteCount;
        vt.encryptedBallot = _encryptedBallot;
        vt.signature = _signature;

        // contractVotes[voteID]
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