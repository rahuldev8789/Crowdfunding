# Stellar crowdfunding dapp

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?logo=vercel)](https://crowdfunding-mu-peach.vercel.app/) **[Live Demo URL](https://crowdfunding-mu-peach.vercel.app/)**

A React + TypeScript Stellar crowdfunding app with multi-wallet connection, a deployed Soroban contract, live state polling, and transaction status tracking for Level 2 submission.

## What is included

- Multi-wallet connection flow with wallet selection chips
- Contract call flow from the frontend
- Real-time state synchronization from the deployed testnet contract
- Transaction status feedback for pending, success, and error states
- Three handled wallet/transaction errors: wallet not found, user rejected, and insufficient balance

## Tech stack

- Vite + React + TypeScript
- Stellar Wallets Kit
- Stellar SDK
- Soroban smart contract written in Rust

## Local setup

1. Install dependencies
   ```bash
   npm install
   ```
2. Start the app locally
   ```bash
   npm run dev
   ```
3. Build the production bundle
   ```bash
   npm run build
   ```

## Project Links

- Repository: https://github.com/rahuldev8789/Crowdfunding
- Live demo: https://crowdfunding-mu-peach.vercel.app/
- Contract explorer: https://stellar.expert/explorer/testnet/contract/CDA2XIUNNPXW3XR2N752LCVATZDG2CQEK2L2LRVKSXRZWHZ4RERYEFOX

## Contract details

- Contract ID: `CDA2XIUNNPXW3XR2N752LCVATZDG2CQEK2L2LRVKSXRZWHZ4RERYEFOX`
- Deployment transaction: `9ed135ebf1af911d1bdd01887e487d83d4f29e7e9ea80270c6dd9002d00e2ee9`
- Contract creation transaction: `e348954ecca4cf5299281c7092bfb18a5dc3d05aeb0572d794ae9ef2aba5dd8f`
- Testnet explorer: https://stellar.expert/explorer/testnet/contract/CDA2XIUNNPXW3XR2N752LCVATZDG2CQEK2L2LRVKSXRZWHZ4RERYEFOX

## Submission checklist

- Public GitHub repository
- README with setup instructions
- Minimum 2+ meaningful commits
- Wallet options visible in the UI
- Deployed contract address listed above
- Transaction hash of a contract call shown in the app after a donation is submitted

## Proof Items

- Live demo: `https://crowdfunding-mu-peach.vercel.app/`
- Wallet options screenshot: add an image of the wallet selector area here
- Contract call hash: paste the transaction hash shown after a donation is submitted

## Screenshot

![Wallet options screenshot](./public/wallet-options.png)

## Final Submission Checklist

- Public GitHub repository
- README with setup instructions
- 2+ meaningful commits
- Wallet options visible in the app
- Deployed contract address listed above
- Transaction hash from a real contract call
- Live demo link if you choose to include one

## Suggested Submission Notes

- The app uses Stellar Wallets Kit for multi-wallet connection.
- The frontend reads live contract state from the deployed Soroban contract on testnet.
- Donation actions create real contract calls from the UI and surface transaction status in the app.

## Contract verification

Run the Soroban contract tests with:

```bash
cargo test --manifest-path contracts/crowdfunding/contracts/hello-world/Cargo.toml
```

## Notes

- The frontend targets Stellar testnet.
- The app polls the deployed contract for goal, raised, and owner state.
- Donation submissions build and sign a real Soroban invoke-contract transaction from the frontend.
