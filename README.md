# Stellar Crowdfunding DApp

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?logo=vercel)](https://crowdfunding-mu-peach.vercel.app/) [![CI Pipeline](https://img.shields.io/badge/CI%2FCD-Passing-brightgreen?logo=github-actions)](https://github.com/rahuldev8789/Crowdfunding/actions) [![Live Demo](https://img.shields.io/badge/Live%20Demo-Open-blue)](https://crowdfunding-mu-peach.vercel.app/)

## Overview

This project is a complete end-to-end Stellar dApp built for Level 3: Advanced Smart Contracts + Production-Ready dApps. It goes beyond beginner demos by combining production-style smart contract logic, frontend UX polish, testing, deployment, and CI/CD automation.

## Advanced Smart Contracts + Production-Ready dApps

### Requirements Covered

- Advanced smart contract development
- Inter-contract communication
- Event streaming and real-time updates
- CI/CD pipeline setup
- Smart contract deployment workflow
- Mobile responsive frontend development
- Error handling and loading states
- Writing tests for contracts and frontend
- Production-ready architecture practices
- Documentation and demo presentation

## Submission Checklist

Ensure the project includes all required deliverables before submission:

- Public GitHub repository
- README with complete documentation
- Minimum 10 meaningful commits
- Live demo link on Vercel, Netlify, or similar
- Contract deployment address
- Transaction hash for contract interaction
- Screenshot showing mobile responsive UI
- Screenshot showing CI/CD pipeline running
- Screenshot showing test output with 3+ passing tests
- Demo video link with 1 to 2 minutes of presentation

## Project Highlights

- Smart contract state tracking for campaign goals, funds raised, owner data, funded state, and donor contributions
- Real-time event emission for donation activity
- Responsive frontend designed for desktop and mobile use
- Clear loading, success, and error handling for user flows
- Automated CI pipeline for build and test validation
- Dual-layer testing across contract and frontend code

## Project Links

- Public GitHub Repository: https://github.com/rahuldev8789/Crowdfunding
- Live Vercel Deployment: https://crowdfunding-mu-peach.vercel.app/
- Contract Explorer: https://stellar.expert/explorer/testnet/contract/CDA2XIUNNPXW3XR2N752LCVATZDG2CQEK2L2LRVKSXRZWHZ4RERYEFOX
- Demo Video: add your 1 to 2 minute demo link here

## Contract Details

- Contract ID: `CDA2XIUNNPXW3XR2N752LCVATZDG2CQEK2L2LRVKSXRZWHZ4RERYEFOX`
- Deployment Transaction: `9ed135ebf1af911d1bdd01887e487d83d4f29e7e9ea80270c6dd9002d00e2ee9`
- Contract Creation Transaction: `e348954ecca4cf5299281c7092bfb18a5dc3d05aeb0572d794ae9ef2aba5dd8f`

## Screenshots

### Mobile Responsive UI
![Mobile Responsive UI](./public/wallet-options.png)

### CI/CD Pipeline Running
![CI/CD Pipeline Running](https://github.com/rahuldev8789/Crowdfunding/actions/workflows/ci.yml/badge.svg)

### Test Output
The project includes contract and frontend test coverage, with 3+ passing tests required for submission.

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
