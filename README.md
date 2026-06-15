# Stellar crowdfunding dapp

A polished React + TypeScript frontend for a Stellar testnet crowdfunding experience, paired with a Soroban smart contract that tracks funding progress and donation events.

## What is included

- Wallet connection flow for Stellar-compatible wallets
- Donation form with progress tracking and status feedback
- Soroban contract integration for a crowdfunding goal and raised amount
- Testnet deployment details and build verification

## Tech stack

- Vite + React + TypeScript
- Stellar Wallets Kit
- Stellar SDK
- Soroban smart contract written in Rust

## Project structure

- src/ — frontend UI and Stellar helper logic
- contracts/crowdfunding/contracts/hello-world/ — Soroban contract source and tests

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

## Contract deployment

The contract was built and deployed to Stellar testnet with the following address:

- Contract ID: CDA2XIUNNPXW3XR2N752LCVATZDG2CQEK2L2LRVKSXRZWHZ4RERYEFOX
- Deployment transaction: 9ed135ebf1af911d1bdd01887e487d83d4f29e7e9ea80270c6dd9002d00e2ee9
- Contract creation transaction: e348954ecca4cf5299281c7092bfb18a5dc3d05aeb0572d794ae9ef2aba5dd8f

## Contract verification

Run the Soroban contract tests with:

```bash
cargo test --manifest-path contracts/crowdfunding/contracts/hello-world/Cargo.toml
```

## Notes

- The frontend is configured for Stellar testnet.
- The contract currently exposes initialize, donate, get_goal, get_raised, and get_owner.
- The UI uses the deployed contract ID directly in the donation flow.
