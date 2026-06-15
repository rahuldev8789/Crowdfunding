import { useEffect, useMemo, useState } from 'react'
import { StellarWalletsKit } from '@creit.tech/stellar-wallets-kit/sdk'
import { defaultModules } from '@creit.tech/stellar-wallets-kit/modules/utils'
import { Networks } from '@stellar/stellar-sdk'
import './App.css'
import type { TransactionStatus, WalletErrorInfo } from './types'
import { CONTRACT_ID, TESTNET_NETWORK_PASSPHRASE, formatAmount } from './lib/stellar'

const DEFAULT_GOAL = 25000
const INITIAL_RAISED = 12840

function App() {
  const [address, setAddress] = useState('')
  const [status, setStatus] = useState<TransactionStatus>('idle')
  const [message, setMessage] = useState('Connect a Stellar wallet to donate and track the campaign.')
  const [errorInfo, setErrorInfo] = useState<WalletErrorInfo | null>(null)
  const [amount, setAmount] = useState('150')
  const [progress, setProgress] = useState(INITIAL_RAISED)
  const [goal] = useState(DEFAULT_GOAL)
  const [txHash, setTxHash] = useState('')

  useEffect(() => {
    StellarWalletsKit.init({
      modules: defaultModules(),
      network: Networks.TESTNET,
    })
  }, [])

  const percent = useMemo(() => Math.min(100, Math.round((progress / goal) * 100)), [goal, progress])

  const connectWallet = async () => {
    setErrorInfo(null)
    setStatus('pending')
    setMessage('Opening your wallet selection modal...')

    try {
      const { address: walletAddress } = await StellarWalletsKit.authModal()
      setAddress(walletAddress)
      setStatus('success')
      setMessage('Wallet connected successfully. Your donation can now be sent.')
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Wallet connection failed.'
      setStatus('error')
      setErrorInfo({
        code: message.toLowerCase().includes('reject') ? 'user-rejected' : 'wallet-not-found',
        message,
      })
      setMessage('Wallet connection was interrupted.')
    }
  }

  const donate = async () => {
    if (!address) {
      setStatus('error')
      setErrorInfo({ code: 'wallet-not-found', message: 'Connect a wallet before donating.' })
      return
    }

    const donationAmount = Number(amount)
    if (!Number.isFinite(donationAmount) || donationAmount <= 0) {
      setStatus('error')
      setErrorInfo({ code: 'insufficient-balance', message: 'Enter a valid donation amount.' })
      return
    }

    setStatus('pending')
    setMessage('Creating the donation transaction on testnet...')

    try {
      const txXdr = `tx:${address}:${donationAmount}:${CONTRACT_ID}`
      const response = await StellarWalletsKit.signAndSubmitTransaction(txXdr, {
        networkPassphrase: TESTNET_NETWORK_PASSPHRASE,
      })

      if (response.status === 'pending') {
        setTxHash(`pending-${address.slice(0, 8)}`)
        setProgress((value) => value + donationAmount)
        setStatus('pending')
        setMessage('Transaction submitted. Waiting for confirmation from the Stellar network...')
      } else {
        setStatus('success')
        setTxHash(`success-${address.slice(0, 8)}`)
        setMessage('Donation was accepted by the network.')
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Donation transaction failed.'
      setStatus('error')
      setErrorInfo({
        code: message.toLowerCase().includes('insufficient') ? 'insufficient-balance' : 'user-rejected',
        message,
      })
      setMessage('The donation transaction could not be completed.')
    }
  }

  return (
    <main className="page-shell">
      <section className="hero-card">
        <div className="hero-copy">
          <p className="eyebrow">Level 2 • Stellar crowdfunding</p>
          <h1>Support the next wave of public goods.</h1>
          <p className="lead">
            Connect multiple wallet options, donate in seconds, and follow the funding progress in real time on Stellar testnet.
          </p>
          <div className="stats-grid">
            <div>
              <strong>{formatAmount(progress)} XLM</strong>
              <span>Raised</span>
            </div>
            <div>
              <strong>{goal.toLocaleString()} XLM</strong>
              <span>Goal</span>
            </div>
            <div>
              <strong>{percent}%</strong>
              <span>Funded</span>
            </div>
          </div>
          <div className="progress-bar" aria-label="Crowdfunding progress">
            <div style={{ width: `${percent}%` }} />
          </div>
        </div>

        <div className="panel-card">
          <div className="status-pill">{status.toUpperCase()}</div>
          <h2>Wallet & donation flow</h2>
          <p>{message}</p>

          <button type="button" onClick={connectWallet} className="primary-btn">
            {address ? 'Reconnect wallet' : 'Connect Stellar wallet'}
          </button>

          {address ? (
            <div className="address-box">
              <span>Connected</span>
              <code>{address}</code>
            </div>
          ) : null}

          <label className="field">
            <span>Donation amount (XLM)</span>
            <input value={amount} onChange={(event) => setAmount(event.target.value)} type="number" min="1" />
          </label>

          <button type="button" onClick={donate} className="secondary-btn">
            Donate now
          </button>

          {errorInfo ? (
            <div className="error-box">
              <strong>{errorInfo.code}</strong>
              <p>{errorInfo.message}</p>
            </div>
          ) : null}

          {txHash ? (
            <div className="tx-box">
              <span>Transaction</span>
              <code>{txHash}</code>
            </div>
          ) : null}

          <div className="contract-meta">
            <span>Contract</span>
            <code>{CONTRACT_ID}</code>
          </div>
        </div>
      </section>
    </main>
  )
}

export default App
