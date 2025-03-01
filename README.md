# Blockchain Voting System

A decentralized voting system built on Ethereum blockchain technology using Solidity, Hardhat, Node.js, and React.

## Overview

This project demonstrates a complete blockchain-based voting application with the following components:

- **Smart Contract**: A Solidity contract for secure, transparent voting
- **Blockchain Node**: Hardhat for local blockchain development and testing
- **Backend API**: Node.js Express server for interacting with the blockchain
- **Frontend**: React application with Tailwind CSS for a modern UI

The system allows for:
- Creating and managing elections
- Adding candidates
- Registering voters
- Secure voting with one-vote-per-voter verification
- Real-time election results

## System Architecture

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│             │     │             │     │             │
│  React UI   │────▶│  Node.js    │────▶│  Ethereum   │
│  (Tailwind) │◀────│  API Server │◀────│  Blockchain │
│             │     │             │     │             │
└─────────────┘     └─────────────┘     └─────────────┘
```

## Prerequisites

- Docker and Docker Compose
- Node.js (for local development)
- MetaMask or another Web3 wallet (for testing)

## Quick Start

1. **Clone the repository**

```bash
git clone https://github.com/yourusername/blockchain-voting-system.git
cd blockchain-voting-system
```

2. **Start the application with Docker**

```bash
docker-compose up
```

This will:
- Start a Hardhat blockchain node
- Deploy the voting smart contract
- Start the Node.js API server
- Launch the React frontend
- Configure an Nginx reverse proxy

3. **Access the application**

Open your browser and navigate to:
```
http://localhost:8000
```

## Manual Setup (Development)

If you prefer to run components individually for development:

### 1. Blockchain Setup

```bash
cd server
npm install
npx hardhat node
npx hardhat run scripts/deploy.js --network localhost
```

### 2. Backend Server

```bash
cd server
npm install
# Update .env with your contract address
npm run dev
```

### 3. Frontend

```bash
cd webapp
npm install
npm run dev
```

## Smart Contract

The Voting contract includes:

- **Admin controls**: Add candidates, register voters, control voting status
- **Voter authentication**: Ensures only registered voters can vote
- **One-vote guarantee**: Prevents double voting
- **Transparent counting**: All votes are publicly verifiable
- **Real-time results**: Current standings are always available

## API Endpoints

- `GET /api/election` - Get election information
- `GET /api/candidates` - Get all candidates
- `POST /api/candidates` - Add a new candidate (admin only)
- `POST /api/voters` - Register a voter (admin only)
- `POST /api/vote` - Cast a vote
- `POST /api/voting-status` - Open/close voting (admin only)
- `GET /api/results` - Get election results

## Testing

Run the automated test suite:

```bash
cd server
npx hardhat test
```

For contract coverage:

```bash
npx hardhat coverage
```

## Deployment to Public Networks

To deploy to a testnet or mainnet:

1. Update the `.env` file with your network URL and private key
2. Deploy using Hardhat:

```bash
npx hardhat run scripts/deploy.js --network sepolia
```

## Project Structure

```
├── server/                  # Backend and blockchain code
│   ├── contracts/           # Solidity smart contracts
│   ├── scripts/             # Deployment scripts
│   ├── test/                # Contract tests
│   ├── hardhat.config.js    # Hardhat configuration
│   └── app.js               # Express API server
│
├── webapp/                  # Frontend React application
│   ├── public/              # Static assets
│   └── src/                 # React components and styles
│
├── docker-compose.yml       # Docker configuration
├── nginx.conf               # Nginx reverse proxy configuration
└── README.md                # Project documentation
```

## Security Considerations

This project demonstrates blockchain voting concepts but has several considerations for production use:

- Private key management should be improved for production
- Additional voter authentication methods should be implemented
- Front-running protection may be needed
- Gas optimization for public networks
- Rate limiting for API endpoints

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
