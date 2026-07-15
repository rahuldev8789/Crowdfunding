# Stellar Crowdfunding DApp

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?logo=vercel)](https://crowdfunding-mu-peach.vercel.app/) [![CI Pipeline](https://img.shields.io/badge/CI%2FCD-Passing-brightgreen?logo=github-actions)](https://github.com/rahuldev8789/Crowdfunding/actions) [![Live Demo](https://img.shields.io/badge/Live%20Demo-Open-blue)](https://crowdfunding-mu-peach.vercel.app/)

## Overview

Stellar Crowdfunding DApp is a production-style Web3 fundraising app built for the Stellar testnet. It combines a responsive frontend, Soroban smart contracts, reward-token inter-contract calls, live contract syncing, and CI/CD coverage into a single competition-ready project.

The emphasis is on clear architecture, visible proof, and a polished reviewer experience, with the contract, frontend, deployment workflow, and documentation treated as one system.

## Links

- Live app: https://crowdfunding-mu-peach.vercel.app/
- Demo video: https://drive.google.com/file/d/1Me7IvigXKzr0yMh3jrjmmNLFRBWKpMwS/view?usp=sharing
- GitHub repository: https://github.com/rahuldev8789/Crowdfunding
- Crowdfunding contract explorer: https://stellar.expert/explorer/testnet/contract/CB6Z2H3NUTBIYY7CUR5PKCF4YROK73Y5HWAF7RZAYIMRL322I7WIZ6L
- Reward contract explorer: https://stellar.expert/explorer/testnet/contract/CAAPAPB4W7DIJOXHGCXJ45HFNFUBAFAODWASY7IKLFW3CX6GKJCB3C

## What It Includes

- Wallet connection flow for Stellar testnet users
- Soroban contract donation call with live transaction submission
- Reward contract crediting through inter-contract communication
- Contract snapshot polling for goal, raised amount, and owner data
- Error handling and loading states throughout the donation flow
- Responsive desktop and mobile presentation
- Frontend and contract tests
- GitHub Actions CI pipeline
- Production deployment on Vercel

## Architecture

The project is split into two main parts:

- Frontend: `src/` contains the React + TypeScript interface, wallet flow, and contract-sync logic.
- Contracts: `contracts/crowdfunding/contracts/` contains the Soroban crowdfunding contract plus the reward-badge contract used during donations.

The frontend reads live testnet state, builds a donation transaction, signs it with the connected wallet, submits it to Soroban RPC, and then refreshes the contract snapshot so the UI stays aligned with chain state.

### On-Chain Flow

1. A user connects a supported Stellar wallet.
2. The frontend builds a Soroban donation transaction on testnet.
3. The wallet signs the transaction.
4. The app submits the signed transaction to RPC.
5. The crowdfunding contract records the donation, emits a donation event, and credits the reward contract.
6. The frontend refreshes the displayed goal, raised amount, and owner fields.

## Smart Contract Design & Custom Data Structures

The main crowdfunding contract (`stellar-crowdfunding`) goes beyond basic boilerplate by implementing rich, custom domain-specific data structures (`#[contracttype]`) and comprehensive campaign state management:

### Custom Data Structures (`#[contracttype]`)
- **`CampaignSummary`**: A comprehensive struct containing `owner`, `goal`, `raised`, `donor_count`, `is_funded`, `min_donation`, and the current campaign `status`.
- **`DonorRecord`**: Tracks individual donor metrics including `total_contributed`, `last_contribution`, and `contributions_count`.
- **`CampaignStatus`**: Custom enum representing dynamic campaign states (`Active`, `GoalReached`, `Closed`).

### Complete Contract & Frontend Function Matching (1-to-1 Parity)
Every contract function exposed by the Soroban smart contract is directly matched and invoked by the frontend in `src/lib/stellar.ts` (`Operation.invokeContractFunction`):

| Contract Function | Frontend Invocation Helper (`src/lib/stellar.ts`) | Purpose |
| :--- | :--- | :--- |
| `initialize` | `buildInitializeTransaction()` | Initializes campaign with target goal and minimum donation threshold |
| `donate` | `buildDonationTransaction()` | Validates donation against `min_donation`, updates struct records, triggers inter-contract reward credit, and emits `DonationReceived` |
| `get_campaign_summary` | `fetchCampaignSummary()` | Returns full `CampaignSummary` custom struct via simulated read operation |
| `get_donor_record` | `fetchDonorRecord()` | Returns individual `DonorRecord` custom struct for the active wallet |
| `get_status` | `fetchCampaignStatus()` | Returns the live `CampaignStatus` enum (`Active`, `GoalReached`, or `Closed`) |
| `get_goal` | `fetchContractGoal()` | Returns target funding goal (`i128`) |
| `get_raised` | `fetchContractRaised()` | Returns total funds raised so far (`i128`) |
| `get_owner` | `fetchContractOwner()` | Returns the campaign creator's address (`String`) |
| `get_donor_contribution`| `fetchDonorContribution()` | Returns cumulative contributions for a specific donor (`i128`) |
| `is_funded` | `checkContractIsFunded()` | Returns whether the campaign goal has been reached (`bool`) |
| `refund` | `buildRefundTransaction()` | Allows donors to claim refunds (`DonationRefunded` event) |
| `withdraw` | `buildWithdrawTransaction()` | Allows creator to withdraw raised funds once target is reached (`CampaignWithdrawn` event) |

The contract emits structured events (`DonationReceived`, `DonationRefunded`, `CampaignWithdrawn`), giving the frontend real-time activity tracking and full visibility over chain state.

## Frontend Experience

The interface is built around a two-panel dashboard:

- Left panel: campaign hero, wallet choice, live stats, and funding progress
- Right panel: wallet actions, donation input, contract address, explorer link, and debug trail

The frontend also:

- Detects available Stellar wallets
- Shows user-friendly wallet and transaction errors
- Tracks donation attempts with a debug trail
- Polls the contract on an interval so the dashboard stays fresh
- Keeps the layout usable on both desktop and mobile screens

## Testing And Quality

### Frontend Tests

The frontend includes Vitest coverage for helper utilities such as amount formatting and explorer URL generation.

### Contract Tests

The Soroban contract includes tests that verify:

- initialization
- donation progress updates
- multiple donations
- default getter values
- funded state behavior at goal completion

### CI/CD

GitHub Actions runs the main project checks on push and pull request events:

- frontend install
- frontend lint
- frontend build
- contract tests

## Submission Checklist

| Requirement | Status | Evidence |
| --- | --- | --- |
| Public GitHub repository | Done | Repository link above |
| Complete README documentation | Done | This file |
| 10+ meaningful commits | Done | 40+ commits in history |
| Live demo link | Done | Vercel app link above |
| Contract deployment address | Done | Contract details below |
| Transaction hash for contract interaction | Done | Contract details below |
| Mobile responsive UI screenshot | Done | Screenshot section below |
| CI/CD pipeline screenshot | Done | Screenshot section below |
| Test output screenshot with 3+ passing tests | Done | Screenshot section below |
| Demo video link | Done | Drive link above |

## Screenshots

### Windows Dashboard
<img width="1920" height="1020" alt="Screenshot 2026-07-10 213853" src="https://github.com/user-attachments/assets/fd51e9b6-41ca-4ba3-b2b8-36e177099c94" />

### Mobile Responsive UI
<img width="262" height="576" alt="Screenshot 2026-07-10 033433" src="https://github.com/user-attachments/assets/86ed95dc-e18b-42b5-a306-7ec2c6a70e0e" />

### CI Status
<img width="857" height="250" alt="Screenshot 2026-07-10 033825" src="https://github.com/user-attachments/assets/519b43b3-c199-4722-ba8e-835a31ce0a06" />

### Test Output
![Test Output](./public/screenshots/test-output.svg)

## Folder Structure

```text
Crowdfunding/
|-- .github/                     GitHub Actions workflow
|-- contracts/
|   |-- crowdfunding/
|   |   `-- contracts/          Soroban crowdfunding + reward contracts
|-- public/
|   `-- screenshots/            Submission screenshots and proof assets
|-- src/                        React app, wallet flow, and Stellar helpers
|-- README.md                   Project overview and submission proof
`-- package.json                Frontend scripts and dependencies
```

## Repository Contents

- Frontend app in `src/`
- Soroban contract code in `contracts/crowdfunding/contracts/`
- Frontend tests in `src/`
- Contract tests in `contracts/crowdfunding/contracts/`
- GitHub Actions workflow for lint, build, and tests
- Public screenshot assets in `public/screenshots/`
- Deployment and explorer links for the live Stellar testnet deployment

## Verification

### Local Checks

- Frontend lint: `npm.cmd run lint`
- Frontend build: `npm.cmd run build`
- Frontend tests: `npm.cmd run test`
- Contract tests: `cargo test --manifest-path contracts/crowdfunding/contracts/hello-world/Cargo.toml`

### Contract Details

- Contract ID: `CB6Z2H3NUTBIYY7CUR5PKCF4YROK7SYHVP72GM54FZKJQMQZQZINPXTE`
- Deployment Transaction: `9503aa0e2b59487be3e66cdb51ec22c8ee8f3771fc17359115437d9f2c33aa9b`
- Contract Creation Transaction: `6e81e554427cf1b7ef716b711dc60d98bb88a7e847054867ccc020268142e37e`
- Reward Contract ID: `CAAPAPB4W7DVSIJOXHGCXJ45HFNFUBAFAODWASY7IKLFW3CX6GKJCB3C`
- Reward Contract Deployment Transaction: `dd699988d411e72d4475717ab27bd889f572328213a83b1afdd8e1a54865e566`

### Notes For Judges

- The contract is deployed on Stellar testnet and can be explored using the public links above.
- The app is intentionally built around live chain reads and writes rather than static UI-only state.
- The README keeps proof screenshots and direct links up front so reviewers can verify the build quickly.

## Local Setup

1. Clone the repository
   ```bash
   git clone https://github.com/rahuldev8789/Crowdfunding.git
   cd Crowdfunding
   npm install
   ```

2. Run the development server
   ```bash
   npm run dev
   ```

3. Run frontend tests
   ```bash
   npm run test
   ```

4. Run contract tests
   ```bash
   cargo test --manifest-path contracts/crowdfunding/contracts/hello-world/Cargo.toml
   ```

5. Build for production
   ```bash
   npm run build
   ```
