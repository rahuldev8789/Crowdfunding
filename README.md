# Stellar crowdfunding dapp

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

## Contract verification

Run the Soroban contract tests with:

```bash
cargo test --manifest-path contracts/crowdfunding/contracts/hello-world/Cargo.toml
```

## Notes

- The frontend targets Stellar testnet.
- The app polls the deployed contract for goal, raised, and owner state.
- Donation submissions build and sign a real Soroban invoke-contract transaction from the frontend.
