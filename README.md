# Stellar Crowdfunding DApp

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?logo=vercel)](https://crowdfunding-mu-peach.vercel.app/) [![CI Pipeline](https://img.shields.io/badge/CI%2FCD-Passing-brightgreen?logo=github-actions)](https://github.com/rahuldev8789/Crowdfunding/actions) [![Live Demo](https://img.shields.io/badge/Live%20Demo-Open-blue)](https://crowdfunding-mu-peach.vercel.app/)

## Overview

Stellar Crowdfunding DApp is a production-style Web3 fundraising app built for the Stellar testnet. It combines a responsive frontend, Soroban smart contracts, reward-token inter-contract calls, live contract syncing, and CI/CD coverage into a single submission-ready project.

The goal is to move beyond a basic demo and show what a realistic dApp looks like when the contract, frontend, deployment workflow, and documentation are treated as one system.

## Links

- Live app: https://crowdfunding-mu-peach.vercel.app/
- Demo video: https://drive.google.com/file/d/1ZTSrL93AISNDjMiIF1L-CjSQ9bmmtSSa/view?usp=sharing
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
- Vercel deployment for the public app

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

## Smart Contract Design

The main crowdfunding contract stores:

- `goal`
- `raised`
- `owner`
- donor contribution records
- funded status

It exposes helpers for:

- `initialize`
- `donate`
- `get_goal`
- `get_raised`
- `get_owner`
- `get_donor_contribution`
- `is_funded`

The `donate` function also performs an inter-contract call into the reward badge contract so donors receive a credit when they contribute.

The contract emits a `DonationReceived` event, which makes the donation history easier to surface in a real-world app and gives the frontend a clean signal to display in the activity feed.

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
| 10+ meaningful commits | Done | 43 commits in history |
| Live demo link | Done | Vercel app link above |
| Contract deployment address | Done | Contract details below |
| Transaction hash for contract interaction | Done | Contract details below |
| Mobile responsive UI screenshot | Done | Screenshot section below |
| CI/CD pipeline screenshot | Done | Screenshot section below |
| Test output screenshot with 3+ passing tests | Done | Screenshot section below |
| Demo video link | Done | Drive link above |

## Screenshots

### Windows Dashboard
![Windows Dashboard](./public/screenshots/windows-dashboard.svg)

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
- The README includes both proof screenshots and direct links so reviewers can verify the build quickly.

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
