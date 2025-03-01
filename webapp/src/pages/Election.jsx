// src/App.js
import React, { useState, useEffect } from 'react';
import Web3 from 'web3';

function Election() {
  // State variables
  const [web3, setWeb3] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState('');
  const [electionInfo, setElectionInfo] = useState(null);
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // For admin actions
  const [newCandidateName, setNewCandidateName] = useState('');
  const [newCandidateInfo, setNewCandidateInfo] = useState('');
  const [voterAddress, setVoterAddress] = useState('');

  // API endpoints
  const API_BASE_URL = '/api';

  // Initialize Web3
  useEffect(() => {
    const initWeb3 = async () => {
      try {
        // If no injected web3 instance is detected, fall back to Ganache
        const provider = new Web3.providers.HttpProvider('http://localhost:8545');
        const web3Instance = new Web3(provider);
        setWeb3(web3Instance);
        const accs = await web3Instance.eth.getAccounts();
        setAccounts(accs);
        if (accs.length > 0) {
          setSelectedAccount(accs[0]);
        }
        // Load election data
        fetchElectionInfo();
        fetchCandidates();
      } catch (error) {
        console.error('Error initializing Web3:', error);
        setError('Failed to connect to blockchain. Make sure your wallet is connected.');
      } finally {
        setLoading(false);
      }
    };

    initWeb3();
  }, []);

  // Fetch election information
  const fetchElectionInfo = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/election`);
      const data = await response.json();
      setElectionInfo(data);
    } catch (error) {
      console.error('Error fetching election info:', error);
      setError('Failed to load election information.');
    }
  };

  // Fetch candidates
  const fetchCandidates = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/candidates`);
      const data = await response.json();
      setCandidates(data);
    } catch (error) {
      console.error('Error fetching candidates:', error);
      setError('Failed to load candidates.');
    }
  };

  // Add a new candidate (admin only)
  const addCandidate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch(`${API_BASE_URL}/candidates`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: newCandidateName,
          info: newCandidateInfo,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setSuccess(`Candidate "${newCandidateName}" added successfully!`);
        setNewCandidateName('');
        setNewCandidateInfo('');
        fetchCandidates(); // Refresh the candidates list
      } else {
        setError(data.error || 'Failed to add candidate.');
      }
    } catch (error) {
      console.error('Error adding candidate:', error);
      setError("Error adding candidate. Make sure you're using the admin account.");
    } finally {
      setLoading(false);
    }
  };

  // Register a voter (admin only)
  const registerVoter = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch(`${API_BASE_URL}/voters`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          voterAddress: voterAddress,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setSuccess(`Voter (${voterAddress}) registered successfully!`);
        setVoterAddress('');
        fetchElectionInfo(); // Refresh the election info
      } else {
        setError(data.error || 'Failed to register voter.');
      }
    } catch (error) {
      console.error('Error registering voter:', error);
      setError("Error registering voter. Make sure you're using the admin account.");
    } finally {
      setLoading(false);
    }
  };

  // Vote for a candidate
  const vote = async (candidateId) => {
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch(`${API_BASE_URL}/vote`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          candidateId: candidateId,
          voterAddress: selectedAccount,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setSuccess(`Vote cast successfully for candidate #${candidateId}!`);
        fetchCandidates(); // Refresh the candidates list
      } else {
        setError(data.error || 'Failed to cast vote.');
      }
    } catch (error) {
      console.error('Error casting vote:', error);
      setError("Error casting vote. Make sure you're registered and haven't already voted.");
    } finally {
      setLoading(false);
    }
  };

  // Toggle voting status (admin only)
  const toggleVoting = async () => {
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const newStatus = !electionInfo.votingOpen;

      const response = await fetch(`${API_BASE_URL}/voting-status`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          votingOpen: newStatus,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setSuccess(`Voting is now ${newStatus ? 'open' : 'closed'}.`);
        fetchElectionInfo(); // Refresh the election info
      } else {
        setError(data.error || 'Failed to update voting status.');
      }
    } catch (error) {
      console.error('Error updating voting status:', error);
      setError("Error updating voting status. Make sure you're using the admin account.");
    } finally {
      setLoading(false);
    }
  };

  if (loading && !electionInfo) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
        Blockchain Voting System
      </h1>

      {electionInfo && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">{electionInfo.electionName}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gray-50 p-4 rounded-md">
              <p className="text-gray-500 text-sm">Status</p>
              <p
                className={`font-medium text-lg ${electionInfo.votingOpen ? 'text-green-600' : 'text-red-600'}`}
              >
                {electionInfo.votingOpen ? 'Voting Open' : 'Voting Closed'}
              </p>
            </div>
            <div className="bg-gray-50 p-4 rounded-md">
              <p className="text-gray-500 text-sm">Candidates</p>
              <p className="font-medium text-lg">{electionInfo.candidatesCount}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-md">
              <p className="text-gray-500 text-sm">Registered Voters</p>
              <p className="font-medium text-lg">{electionInfo.votersCount}</p>
            </div>
          </div>
        </div>
      )}

      <div className="bg-blue-50 rounded-lg p-6 mb-8">
        <h3 className="text-xl font-semibold text-blue-800 mb-3">Your Account</h3>
        <select
          value={selectedAccount}
          onChange={(e) => setSelectedAccount(e.target.value)}
          className="w-full p-2 border border-blue-300 rounded-md bg-white font-mono text-sm"
        >
          {accounts.map((account, index) => (
            <option key={index} value={account}>
              {account}
            </option>
          ))}
        </select>
      </div>

      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded-md">
          <p>{error}</p>
        </div>
      )}

      {success && (
        <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-6 rounded-md">
          <p>{success}</p>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">Admin Controls</h2>

        <button
          onClick={toggleVoting}
          className={`w-full py-2 px-4 rounded-md text-white font-medium mb-6
            ${
              electionInfo?.votingOpen
                ? 'bg-red-500 hover:bg-red-600'
                : 'bg-green-500 hover:bg-green-600'
            }`}
          disabled={loading}
        >
          {electionInfo?.votingOpen ? 'Close Voting' : 'Open Voting'}
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="border border-gray-200 rounded-md p-4">
            <h3 className="text-lg font-medium text-gray-700 mb-3">Add Candidate</h3>
            <form onSubmit={addCandidate}>
              <div className="mb-3">
                <input
                  type="text"
                  placeholder="Candidate Name"
                  value={newCandidateName}
                  onChange={(e) => setNewCandidateName(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
              <div className="mb-3">
                <input
                  type="text"
                  placeholder="Additional Info (optional)"
                  value={newCandidateInfo}
                  onChange={(e) => setNewCandidateInfo(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md font-medium
                  disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Add Candidate
              </button>
            </form>
          </div>

          <div className="border border-gray-200 rounded-md p-4">
            <h3 className="text-lg font-medium text-gray-700 mb-3">Register Voter</h3>
            <form onSubmit={registerVoter}>
              <div className="mb-3">
                <input
                  type="text"
                  placeholder="Voter Address (0x...)"
                  value={voterAddress}
                  onChange={(e) => setVoterAddress(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md font-mono"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md font-medium
                  disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Register Voter
              </button>
            </form>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-2xl font-semibold text-gray-700 mb-6">Candidates</h2>

        {candidates.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>No candidates registered yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {candidates.map((candidate) => (
              <div
                key={candidate.id}
                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200"
              >
                <h3 className="text-xl font-semibold text-gray-700 mb-2">{candidate.name}</h3>
                {candidate.info && <p className="text-gray-600 mb-3">{candidate.info}</p>}
                <div className="flex justify-between items-center">
                  <p className="font-bold text-lg text-blue-600">{candidate.voteCount} votes</p>
                  <button
                    onClick={() => vote(candidate.id)}
                    disabled={!electionInfo?.votingOpen || loading}
                    className="bg-indigo-500 hover:bg-indigo-600 text-white py-2 px-4 rounded-md
                      disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Vote
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Election;
