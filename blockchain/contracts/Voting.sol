// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/**
 * @title Voting
 * @dev A simple decentralized voting system
 */
contract Voting {
    // Structs
    struct Candidate {
        uint id;
        string name;
        string info;
        uint voteCount;
    }

    struct Voter {
        bool isRegistered;
        bool hasVoted;
        uint votedCandidateId;
    }

    // State variables
    address public admin;
    uint public candidatesCount;
    uint public votersCount;
    string public electionName;
    bool public votingOpen;

    // Mappings
    mapping(uint => Candidate) public candidates;
    mapping(address => Voter) public voters;

    // Events
    event CandidateAdded(uint candidateId, string name);
    event VoterRegistered(address voterAddress);
    event VoteCast(address voter, uint candidateId);
    event VotingStatusChange(bool isOpen);

    // Modifiers
    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can perform this action");
        _;
    }

    modifier onlyRegisteredVoter() {
        require(voters[msg.sender].isRegistered, "You are not registered to vote");
        _;
    }

    modifier votingIsOpen() {
        require(votingOpen, "Voting is not open");
        _;
    }

    /**
     * @dev Constructor to create the voting contract
     * @param _electionName Name of the election
     */
    constructor(string memory _electionName) {
        admin = msg.sender;
        electionName = _electionName;
        votingOpen = false;
        candidatesCount = 0;
        votersCount = 0;
    }

    /**
     * @dev Add a candidate to the election
     * @param _name Name of the candidate
     * @param _info Additional information about the candidate
     */
    function addCandidate(string memory _name, string memory _info) public onlyAdmin {
        candidatesCount++;
        candidates[candidatesCount] = Candidate(candidatesCount, _name, _info, 0);
        emit CandidateAdded(candidatesCount, _name);
    }

    /**
     * @dev Register a voter for the election
     * @param _voter Address of the voter to register
     */
    function registerVoter(address _voter) public onlyAdmin {
        require(!voters[_voter].isRegistered, "Voter is already registered");

        voters[_voter] = Voter(true, false, 0);
        votersCount++;

        emit VoterRegistered(_voter);
    }

    /**
     * @dev Allow a registered voter to cast a vote
     * @param _candidateId The id of the candidate to vote for
     */
    function vote(uint _candidateId) public onlyRegisteredVoter votingIsOpen {
        require(!voters[msg.sender].hasVoted, "You have already voted");
        require(_candidateId > 0 && _candidateId <= candidatesCount, "Invalid candidate");

        voters[msg.sender].hasVoted = true;
        voters[msg.sender].votedCandidateId = _candidateId;

        candidates[_candidateId].voteCount++;

        emit VoteCast(msg.sender, _candidateId);
    }

    /**
     * @dev Start or stop the voting process
     * @param _votingOpen New status for voting
     */
    function setVotingStatus(bool _votingOpen) public onlyAdmin {
        votingOpen = _votingOpen;
        emit VotingStatusChange(_votingOpen);
    }

    /**
     * @dev Get detailed information about a candidate
     * @param _candidateId The candidate's id
     * @return id ID of the candidate
     * @return name Name of the candidate
     * @return info Additional information about the candidate
     * @return voteCount Number of votes received
     */
    function getCandidateDetails(uint _candidateId) public view
        returns (uint id, string memory name, string memory info, uint voteCount) {
        require(_candidateId > 0 && _candidateId <= candidatesCount, "Invalid candidate");

        Candidate memory candidate = candidates[_candidateId];
        return (
            candidate.id,
            candidate.name,
            candidate.info,
            candidate.voteCount
        );
    }

    /**
     * @dev Check if a voter has voted
     * @param _voter Address of the voter
     * @return hasVoted True if the voter has voted
     */
    function hasVoted(address _voter) public view returns (bool) {
        return voters[_voter].hasVoted;
    }

    /**
     * @dev Get the winner of the election
     * @return winnerId ID of the candidate with most votes
     * @return winnerName Name of the winner
     * @return winnerVotes Number of votes received by the winner
     */
    function getWinner() public view returns (uint winnerId, string memory winnerName, uint winnerVotes) {
        require(candidatesCount > 0, "No candidates registered");

        uint winningVoteCount = 0;
        uint currentWinnerId = 0;

        for (uint i = 1; i <= candidatesCount; i++) {
            if (candidates[i].voteCount > winningVoteCount) {
                winningVoteCount = candidates[i].voteCount;
                currentWinnerId = i;
            }
        }

        require(currentWinnerId > 0, "No votes cast yet");

        return (
            currentWinnerId,
            candidates[currentWinnerId].name,
            candidates[currentWinnerId].voteCount
        );
    }
}
