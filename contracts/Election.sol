// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.8.3 <0.9.0;
/// @title Voting with delegation.
import "./ConvertLib.sol";

contract Election {
        // constructor
    constructor() {
        // candidate = "Candidate 1";
        addCandidate("Candidate 1",0);
        addCandidate("Candidate 2",0);
        addCandidate("Candidate 3",0);
    }

    // Model a Candidate
    struct Candidate{
        uint id;
        string name;
        uint voteCount;
    }

    // Store accounts that voted
    mapping(address => bool) public voters;

    // Store candidate
    // Fetch candidate
    mapping(uint => Candidate) public candidates;

    // Store Candidate count
    uint public candidatesCount;

    function addCandidate (string memory _name, uint initVote) private{
        candidatesCount++;
        candidates[candidatesCount] = Candidate(candidatesCount, _name, initVote);
    }

    function vote (uint _candidateId) public{

        // the require must put in the beginning, since the gas will burn until require block, so it is a must to put at the beginning 

        // check if voted, reject if voted
        require(
            !voters[msg.sender],
            "No double vote."
        );

        //check validate candidateId
        require(
            _candidateId > 0 &&  _candidateId  <= candidatesCount,
            "Invalid candidate id. "
        );

        // record voter has voted 
        // msg.sender is account send this request
        voters[msg.sender] = true;

        // update candidate vote count
        candidates[_candidateId].voteCount++;

    }
}