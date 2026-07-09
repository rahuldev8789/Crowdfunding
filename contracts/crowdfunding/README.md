# Crowdfunding Contracts

This folder contains the Soroban contract used by the Stellar Crowdfunding DApp.

## Layout

```text
contracts/hello-world/
├── Cargo.toml
├── Makefile
└── src
    ├── lib.rs
    └── test.rs
```

## What It Does

- Stores campaign goal, amount raised, owner, and funded state
- Records donations per donor
- Emits a donation event on each contribution

## Testing

Run the contract tests from the repository root:

```bash
cargo test --manifest-path contracts/crowdfunding/contracts/hello-world/Cargo.toml
```
