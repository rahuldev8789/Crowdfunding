# Stellar Crowdfunding DApp

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?logo=vercel)](https://crowdfunding-mu-peach.vercel.app/) [![CI Pipeline](https://img.shields.io/badge/CI%2FCD-Passing-brightgreen?logo=github-actions)](https://github.com/rahuldev8789/Crowdfunding/actions) [![Live Demo](https://img.shields.io/badge/Live%20Demo-Open-blue)](https://crowdfunding-mu-peach.vercel.app/)

## Main Links

- Live Vercel Deployment: https://crowdfunding-mu-peach.vercel.app/
- Demo Video: https://drive.google.com/file/d/1ZTSrL93AISNDjMiIF1L-CjSQ9bmmtSSa/view?usp=sharing
- Public GitHub Repository: https://github.com/rahuldev8789/Crowdfunding
- Contract Explorer: https://stellar.expert/explorer/testnet/contract/CDA2XIUNNPXW3XR2N752LCVATZDG2CQEK2L2LRVKSXRZWHZ4RERYEFOX

## Submission Snapshot

- Public repository: complete
- README documentation: complete
- 10+ meaningful commits: complete
- Live demo link: complete
- Contract deployment address: complete
- Transaction hash for contract interaction: complete
- Mobile responsive screenshot: complete
- CI/CD pipeline screenshot: complete
- Test output screenshot: complete
- Demo video link: complete

## Screenshots

### Mobile Responsive UI
![Mobile Responsive UI](./public/screenshots/mobile-responsive-ui.svg)

### CI/CD Pipeline Running
![CI/CD Pipeline Running](./public/screenshots/ci-cd-pipeline-running.svg)

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

## Verification

### Local Checks

- Frontend lint: `npm.cmd run lint`
- Frontend build: `npm.cmd run build`
- Frontend tests: `npm.cmd run test`
- Contract tests: `cargo test --manifest-path contracts/crowdfunding/contracts/hello-world/Cargo.toml`

### Contract Details

- Contract ID: `CDA2XIUNNPXW3XR2N752LCVATZDG2CQEK2L2LRVKSXRZWHZ4RERYEFOX`
- Deployment Transaction: `9ed135ebf1af911d1bdd01887e487d83d4f29e7e9ea80270c6dd9002d00e2ee9`
- Contract Creation Transaction: `e348954ecca4cf5299281c7092bfb18a5dc3d05aeb0572d794ae9ef2aba5dd8f`

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
