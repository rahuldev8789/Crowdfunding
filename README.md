# Stellar Crowdfunding DApp

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?logo=vercel)](https://crowdfunding-mu-peach.vercel.app/) [![CI Pipeline](https://img.shields.io/badge/CI%2FCD-Passing-brightgreen?logo=github-actions)](https://github.com/rahuldev8789/Crowdfunding/actions) [![Live Demo](https://img.shields.io/badge/Live%20Demo-Open-blue)](https://crowdfunding-mu-peach.vercel.app/)

## Main Links

- Live Vercel Deployment: https://crowdfunding-mu-peach.vercel.app/
- Demo Video: https://drive.google.com/file/d/1ZTSrL93AISNDjMiIF1L-CjSQ9bmmtSSa/view?usp=sharing
- Public GitHub Repository: https://github.com/rahuldev8789/Crowdfunding
- Contract Explorer: https://stellar.expert/explorer/testnet/contract/CB6Z2H3NUTBIYY7CUR5PKCF4YROK7SYHVP72GM54FZKJQMQZQZINPXTE
- Reward Contract Explorer: https://stellar.expert/explorer/testnet/contract/CAAPAPB4W7DVSIJOXHGCXJ45HFNFUBAFAODWASY7IKLFW3CX6GKJCB3C
- Set `VITE_REWARD_CONTRACT_ID` in `.env` with the deployed reward contract before donating on testnet.

## Screenshots

### Mobile Responsive UI
<img width="262" height="576" alt="Screenshot 2026-07-10 033433" src="https://github.com/user-attachments/assets/86ed95dc-e18b-42b5-a306-7ec2c6a70e0e" />


### CI/CD Pipeline Running
<img width="857" height="250" alt="Screenshot 2026-07-10 033825" src="https://github.com/user-attachments/assets/519b43b3-c199-4722-ba8e-835a31ce0a06" />


### Test Output
![Test Output](./public/screenshots/test-output.svg)

## What It Includes

- Wallet connection flow for Freighter and LOBSTR
- Contract donation call flow with Soroban testnet RPC
- Live polling of contract state after actions
- Frontend error handling and loading states
- Contract-side tests for initialize, donate, getters, and funded state
- Frontend helper tests for formatting and contract URL generation
- GitHub Actions CI for lint, build, and contract tests
- Reward-contract calls are wired through `VITE_REWARD_CONTRACT_ID`

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
