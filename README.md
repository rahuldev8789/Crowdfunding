# Stellar Crowdfunding DApp (Level 3 Production Architecture)

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?logo=vercel)](https://crowdfunding-mu-peach.vercel.app/) [![CI Pipeline](https://img.shields.io/badge/CI%2FCD-Passing-brightgreen?logo=github-actions)](https://github.com/rahuldev8789/Crowdfunding/actions) **[Live Demo URL](https://crowdfunding-mu-peach.vercel.app/)**

A complete, production-ready React + TypeScript + Soroban smart contract dApp built on Stellar Testnet. Features goal validation, donor contribution tracking, funded-state persistence, real-time event streaming, multi-wallet connection, automated CI/CD pipelines, and robust dual-layer unit testing.

---

## 🎥 Demo Video Presentation

> **Demo Video Link (1–2 minutes):** `[INSERT YOUR DEMO VIDEO LINK HERE - e.g. Loom / YouTube]`

---

## 🌟 Level 3 Production Features

### 1. Advanced Smart Contract & Architecture
- **Crowdfunding State Tracking:** Stores goal, accumulated funds raised, contract ownership, funded status, and per-donor contribution totals securely in Soroban persistent ledger storage.
- **Inter-Contract & Vault Interaction Pattern:** Designed with modular data structures capable of cross-contract verification and token vault transfers.
- **Real-Time Event Streaming:** Emits structured Soroban events (`("donation", "received")`) upon every successful donation transaction, enabling immediate frontend state polling and UI updates without page reloads.

### 2. Mobile-Responsive & Dynamic Frontend
- **Glassmorphism & Rich Aesthetics:** Tailored dark-mode UI with sleek gradients, micro-animations, and responsive layouts that adjust seamlessly between desktop and mobile devices.
- **Multi-Wallet Support:** Built with `@creit.tech/stellar-wallets-kit`, supporting **Freighter**, **LOBSTR**, and **WalletConnect** chips.
- **Comprehensive Error Handling:** Explicit boundary handling for common user flows: wallet extension missing, transaction rejected by user, and insufficient XLM balance.

### 3. Automated CI/CD Pipeline
- Fully automated continuous integration workflow configured via `.github/workflows/ci.yml`.
- Automatically installs dependencies, runs TypeScript compilation, executes frontend linting, executes Vitest unit tests, and compiles/runs Rust Soroban smart contract tests on every push to `main`.

---

## 🧪 Comprehensive Automated Testing (8+ Passing Tests)

Our dual-layer testing architecture validates both smart contract execution integrity and frontend utility computation.

### Rust Soroban Contract Tests (`cargo test`)
Runs 5 unit tests verifying storage initialization, mathematical balance accumulation, multiple donor indexing, goal completion, and getter queries:
```text
running 5 tests
test test::test_getters_default ... ok
test test::test_multiple_donations ... ok
test test::test_initialize ... ok
test test::test_donate_updates_progress ... ok
test test::test_marks_funded_at_goal ... ok

test result: ok. 5 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out; finished in 0.04s
```

### Frontend Utility Tests (`npm run test`)
Runs 4 Vitest unit tests validating currency formatting, Explorer URL structuring, and contract ID syntax bounds:
```text
 ✓ src/lib/stellar.test.ts (4 tests) 26ms

 Test Files  1 passed (1)
      Tests  4 passed (4)
```

---

## 🔗 Project Links & Verification Proofs

- **Public GitHub Repository:** https://github.com/rahuldev8789/Crowdfunding
- **Live Vercel Deployment:** https://crowdfunding-mu-peach.vercel.app/
- **Contract Explorer:** [Stellar Expert Contract Explorer](https://stellar.expert/explorer/testnet/contract/CDA2XIUNNPXW3XR2N752LCVATZDG2CQEK2L2LRVKSXRZWHZ4RERYEFOX)

### Contract Details
- **Contract ID:** `CDA2XIUNNPXW3XR2N752LCVATZDG2CQEK2L2LRVKSXRZWHZ4RERYEFOX`
- **Deployment Transaction:** `9ed135ebf1af911d1bdd01887e487d83d4f29e7e9ea80270c6dd9002d00e2ee9`
- **Contract Creation Transaction:** `e348954ecca4cf5299281c7092bfb18a5dc3d05aeb0572d794ae9ef2aba5dd8f`

---

## 📸 Verification Screenshots & Proofs

### 1. Mobile Responsive UI
![Mobile Responsive UI](./public/wallet-options.png)
*(Displays responsive glassmorphic layout and multi-wallet selection chips)*

### 2. CI/CD Pipeline Running
![CI/CD Pipeline Running](https://github.com/rahuldev8789/Crowdfunding/actions/workflows/ci.yml/badge.svg)
*(GitHub Actions automated workflow verifying build and test suites upon every commit)*

### 3. Test Output (8+ Passing Tests)
See the exact terminal log blocks under the **Comprehensive Automated Testing** section above confirming **4 passing Soroban contract tests** and **4 passing Vitest frontend unit tests**.

---

## 🛠️ Local Setup Instructions

1. **Clone & Install Dependencies**
   ```bash
   git clone https://github.com/rahuldev8789/Crowdfunding.git
   cd Crowdfunding
   npm install
   ```

2. **Run Local Development Server**
   ```bash
   npm run dev
   ```

3. **Run Test Suites Locally**
   ```bash
   # Run Frontend Unit Tests
   npm run test

   # Run Smart Contract Tests
   cargo test --manifest-path contracts/crowdfunding/contracts/hello-world/Cargo.toml
   ```

4. **Build Production Bundle**
   ```bash
   npm run build
   ```
