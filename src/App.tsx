import { useEffect, useMemo, useRef, useState } from 'react'
import { StellarWalletsKit } from '@creit.tech/stellar-wallets-kit/sdk'
import { defaultModules } from '@creit.tech/stellar-wallets-kit/modules/utils'
import { Networks } from '@stellar/stellar-sdk'
import './App.css'
import type { DonationEvent, TransactionStatus, WalletErrorInfo, WalletOption, SyncStatus } from './types'
import {
  CONTRACT_ID,
  TESTNET_NETWORK_PASSPHRASE,
  createFreshTestnetAccount,
  buildDonationTransaction,
  formatAmount,
  getContractSnapshot,
  submitSignedTransaction,
  testnetExplorerUrl,
} from './lib/stellar'

const DEFAULT_GOAL = 25000
const INITIAL_RAISED = 12840
const POLL_INTERVAL_MS = 12000

const WALLET_OPTIONS: WalletOption[] = [
  { id: 'freighter', label: 'Freighter', note: 'Browser extension wallet' },
  { id: 'lobstr', label: 'LOBSTR', note: 'Mobile-first wallet support' },
]

function App() {
  const [address, setAddress] = useState('')
  const [selectedWallet, setSelectedWallet] = useState(WALLET_OPTIONS[0].id)
  const [status, setStatus] = useState<TransactionStatus>('idle')
  const [syncStatus, setSyncStatus] = useState<SyncStatus>('idle')
  const [message, setMessage] = useState('Connect a Stellar wallet to donate and track the campaign.')
  const [errorInfo, setErrorInfo] = useState<WalletErrorInfo | null>(null)
  const [amount, setAmount] = useState('150')
  const [goal, setGoal] = useState(DEFAULT_GOAL)
  const [raised, setRaised] = useState(INITIAL_RAISED)
  const [contractOwner, setContractOwner] = useState('Loading...')
  const [txHash, setTxHash] = useState('')
  const [contractEvents, setContractEvents] = useState<DonationEvent[]>([])
  const [walletsReady, setWalletsReady] = useState(false)
  const [availableWalletIds, setAvailableWalletIds] = useState<string[]>([])
  const [debugSteps, setDebugSteps] = useState<string[]>(['App booted'])
  const [freshAccount, setFreshAccount] = useState<{ publicKey: string; secretKey: string } | null>(null)
  const hasBootedRef = useRef(false)

  const percent = useMemo(() => Math.min(100, Math.round((raised / goal) * 100)), [goal, raised])

  useEffect(() => {
    StellarWalletsKit.init({
      modules: defaultModules(),
      network: Networks.TESTNET,
      authModal: {
        showInstallLabel: true,
        hideUnsupportedWallets: false,
      },
    })

    void StellarWalletsKit.refreshSupportedWallets()
      .then((wallets) => {
        setAvailableWalletIds(wallets.filter((wallet) => wallet.isAvailable).map((wallet) => wallet.id))
      })
      .finally(() => {
        setWalletsReady(true)
      })
  }, [])

  useEffect(() => {
    const restoreState = async () => {
      setSyncStatus('pending')
      try {
        const snapshot = await getContractSnapshot()
        setGoal(snapshot.goal)
        setRaised(snapshot.raised)
        setContractOwner(snapshot.owner)
        setSyncStatus('success')
      } catch (error) {
        setSyncStatus('error')
        setMessage(error instanceof Error ? error.message : 'Unable to read contract state.')
      }
    }

    if (!hasBootedRef.current) {
      hasBootedRef.current = true
      void restoreState()
    }

    const timer = window.setInterval(() => {
      void restoreState()
    }, POLL_INTERVAL_MS)

    return () => window.clearInterval(timer)
  }, [])

  const markError = (code: WalletErrorInfo['code'], message: string) => {
    setStatus('error')
    setErrorInfo({ code, message })
    setMessage(message)
  }

  const pushDebugStep = (step: string) => {
    setDebugSteps((current) => [step, ...current].slice(0, 6))
    console.debug(`[ui] ${step}`)
  }

  const buildWalletError = (rawMessage: string) => {
    const normalized = rawMessage.toLowerCase()

    if (normalized.includes('reject')) {
      return {
        code: 'user-rejected' as const,
        message: 'You rejected the wallet request. Please approve it in your wallet app and try again.',
      }
    }

    if (normalized.includes('not found') || normalized.includes('not installed') || normalized.includes('missing')) {
      return {
        code: 'wallet-not-found' as const,
        message: `No available ${selectedWallet.toUpperCase()} wallet was found. Install, unlock, or switch to a supported wallet.`,
      }
    }

    return {
      code: 'wallet-unavailable' as const,
      message: `The selected ${selectedWallet.toUpperCase()} wallet could not be reached. Open it, unlock it, and retry.`,
    }
  }

  const isWalletAvailable = (walletId: string) => availableWalletIds.length === 0 || availableWalletIds.includes(walletId)

  const connectWallet = async () => {
    setErrorInfo(null)
    setStatus('pending')
    setMessage('Opening the wallet selector...')
    pushDebugStep(`Connecting with ${selectedWallet.toUpperCase()}`)

    if (!isWalletAvailable(selectedWallet)) {
      markError(
        'wallet-not-found',
        `The selected ${selectedWallet.toUpperCase()} wallet is not available in this browser. Try Freighter or LOBSTR.`,
      )
      pushDebugStep(`Wallet unavailable: ${selectedWallet.toUpperCase()}`)
      return
    }

    try {
      StellarWalletsKit.setWallet(selectedWallet)
      const { address: walletAddress } = await StellarWalletsKit.fetchAddress()
      setAddress(walletAddress)
      setStatus('success')
      setMessage(`Connected to ${selectedWallet.toUpperCase()} and ready to sign.`)
      pushDebugStep(`Wallet connected: ${walletAddress.slice(0, 8)}...`)
    } catch (error) {
      const rawMessage = error instanceof Error ? error.message : 'Wallet connection failed.'
      const walletError = buildWalletError(rawMessage)
      markError(walletError.code, walletError.message)
      pushDebugStep(`Wallet connection failed: ${rawMessage}`)
    }
  }

  const readAmount = () => {
    const donationAmount = Number(amount)
    if (!Number.isFinite(donationAmount) || donationAmount <= 0) {
      throw new Error('Enter a valid donation amount.')
    }

    if (donationAmount > 1000000) {
      throw new Error('Donation amount is too large for this testnet example.')
    }

    return donationAmount
  }

  const donate = async () => {
    if (!address) {
      markError('wallet-not-found', 'Connect a wallet before donating.')
      pushDebugStep('Donation blocked: no connected wallet')
      return
    }

    let donationAmount = 0
    try {
      donationAmount = readAmount()
    } catch (error) {
      markError('insufficient-balance', error instanceof Error ? error.message : 'Enter a valid donation amount.')
      pushDebugStep('Donation blocked: invalid amount')
      return
    }

    setStatus('pending')
    setTxHash('')
    setMessage('Preparing a real Soroban contract call on testnet...')
    setSyncStatus('pending')
    pushDebugStep(`Preparing donation for ${donationAmount} XLM`)

    try {
      pushDebugStep('Building donation transaction')
      const tx = await buildDonationTransaction({
        donor: address,
        amount: donationAmount,
      })

      pushDebugStep('Signing donation transaction')
      const { signedTxXdr } = await StellarWalletsKit.signTransaction(tx.toXDR(), {
        networkPassphrase: TESTNET_NETWORK_PASSPHRASE,
        address,
      })

      pushDebugStep('Submitting signed transaction')
      const submit = await submitSignedTransaction(signedTxXdr)
      setStatus(submit.status === 'ERROR' ? 'error' : submit.status === 'PENDING' ? 'pending' : 'success')
      setMessage(
        submit.status === 'PENDING'
          ? 'Transaction signed and submitted. Watching the network for confirmation...'
          : submit.status === 'ERROR'
            ? 'The network rejected the submitted transaction.'
            : 'Donation accepted by the network.',
      )

      setTxHash(submit.hash ?? `pending:${address.slice(0, 8)}:${Date.now()}`)
      setRaised((current) => current + donationAmount)
      setContractEvents((events) => [
        {
          id: `donation-${Date.now()}`,
          kind: 'donation',
          donor: address,
          amount: donationAmount,
          status: submit.status === 'ERROR' ? 'error' : submit.status === 'PENDING' ? 'pending' : 'success',
        },
        ...events,
      ])

      try {
        pushDebugStep('Refreshing contract snapshot')
        const snapshot = await getContractSnapshot()
        setGoal(snapshot.goal)
        setRaised(snapshot.raised)
        setContractOwner(snapshot.owner)
        setSyncStatus('success')
        pushDebugStep('Donation flow completed')
      } catch (snapshotError) {
        const snapshotMessage =
          snapshotError instanceof Error ? snapshotError.message : 'Unable to refresh contract state.'
        setSyncStatus('error')
        setMessage(snapshotMessage)
        pushDebugStep(`Snapshot refresh failed: ${snapshotMessage}`)
      }
    } catch (error) {
      const rawMessage = error instanceof Error ? error.message : 'Donation transaction failed.'
      const normalized = rawMessage.toLowerCase()

      if (normalized.includes('insufficient')) {
        markError('insufficient-balance', rawMessage)
      } else if (normalized.includes('reject')) {
        markError('user-rejected', rawMessage)
      } else {
        markError('wallet-unavailable', rawMessage)
      }
      setSyncStatus('error')
      pushDebugStep(`Donation failed: ${rawMessage}`)
    }
  }

  const disconnectWallet = async () => {
    await StellarWalletsKit.disconnect()
    setAddress('')
    setStatus('idle')
    setMessage('Wallet disconnected. Reconnect when you want to donate again.')
    setTxHash('')
  }

  const createFreshAccount = async () => {
    setStatus('pending')
    setMessage('Creating and funding a fresh testnet account...')
    setErrorInfo(null)
    pushDebugStep('Creating fresh testnet account')

    try {
      const account = await createFreshTestnetAccount()
      setFreshAccount(account)
      setMessage('Fresh testnet account created and funded. Import the secret key into Freighter to sign with it.')
      setStatus('success')
      pushDebugStep(`Fresh account funded: ${account.publicKey.slice(0, 8)}...`)
    } catch (error) {
      const rawMessage = error instanceof Error ? error.message : 'Fresh testnet account creation failed.'
      markError('wallet-unavailable', rawMessage)
      pushDebugStep(`Fresh account failed: ${rawMessage}`)
    }
  }

  return (
    <main className="page-shell">
      <section className="hero-card">
        <div className="hero-copy">
          <p className="eyebrow">Level 2 · Stellar crowdfunding</p>
          <h1>Support the next wave of public goods.</h1>
          <p className="lead">
            Use multiple wallet options, send a real contract call, and watch the funding state stay in sync with
            the testnet contract.
          </p>

          <div className="wallet-option-grid">
            {WALLET_OPTIONS.map((wallet) => (
              <button
                key={wallet.id}
                type="button"
                className={`${selectedWallet === wallet.id ? 'wallet-chip active' : 'wallet-chip'}${
                  !isWalletAvailable(wallet.id) ? ' disabled' : ''
                }`}
                onClick={() => setSelectedWallet(wallet.id)}
                disabled={!isWalletAvailable(wallet.id)}
              >
                <strong>{wallet.label}</strong>
                <span>{wallet.note}</span>
              </button>
            ))}
          </div>

          <div className="stats-grid">
            <div>
              <strong>{formatAmount(raised)} XLM</strong>
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
            <div>
              <strong>{syncStatus.toUpperCase()}</strong>
              <span>Live sync</span>
            </div>
          </div>

          <div className="progress-bar" aria-label="Crowdfunding progress">
            <div style={{ width: `${percent}%` }} />
          </div>
        </div>

        <div className="panel-card">
          <div className={`status-pill status-${status}`}>{status.toUpperCase()}</div>
          <h2>Wallet, contract, and live state</h2>
          <p>{message}</p>

          <div className="button-row">
            <button type="button" onClick={connectWallet} className="primary-btn" disabled={!walletsReady}>
              {address ? 'Switch wallet' : 'Connect wallet'}
            </button>
            <button type="button" onClick={createFreshAccount} className="secondary-btn">
              Fresh testnet account
            </button>
            <button type="button" onClick={disconnectWallet} className="secondary-btn ghost-btn">
              Disconnect
            </button>
          </div>

          {address ? (
            <div className="address-box">
              <span>Connected address</span>
              <code>{address}</code>
            </div>
          ) : null}

          <label className="field">
            <span>Donation amount (XLM)</span>
            <input value={amount} onChange={(event) => setAmount(event.target.value)} type="number" min="1" />
          </label>

          <button type="button" onClick={donate} className="primary-btn donate-btn">
            Call contract
          </button>

          {errorInfo ? (
            <div className="error-box">
              <strong>{errorInfo.code}</strong>
              <p>{errorInfo.message}</p>
            </div>
          ) : null}

          <div className="tx-grid">
            {txHash ? (
              <div className="tx-box">
                <span>Transaction status</span>
                <code>{txHash}</code>
              </div>
            ) : null}
            <div className="tx-box">
              <span>Contract address</span>
              <code>{CONTRACT_ID}</code>
            </div>
            <div className="tx-box">
              <span>Explorer</span>
              <a href={testnetExplorerUrl(CONTRACT_ID)} target="_blank" rel="noreferrer">
                View contract on Stellar Explorer
              </a>
            </div>
          </div>

          <div className="contract-meta">
            <span>Contract owner</span>
            <code>{contractOwner}</code>
          </div>

          {freshAccount ? (
            <div className="fresh-account-box">
              <span>Fresh testnet account</span>
              <p>Import this secret key into Freighter if you want to sign transactions from the new account.</p>
              <code>Public key: {freshAccount.publicKey}</code>
              <code>Secret key: {freshAccount.secretKey}</code>
            </div>
          ) : null}

          <div className="debug-box">
            <span>Debug trail</span>
            <ul>
              {debugSteps.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="event-panel">
        <div className="section-heading">
          <h2>Real-time sync</h2>
          <p>We poll the deployed contract and mirror each completed donation in the activity feed.</p>
        </div>

        <div className="activity-list">
          {contractEvents.length === 0 ? (
            <div className="activity-card muted">
              No contract calls yet. Connect a wallet and submit a donation to create the first event.
            </div>
          ) : (
            contractEvents.map((event) => (
              <article className="activity-card" key={event.id}>
                <strong>{event.kind}</strong>
                <span>{event.status}</span>
                <p>{event.donor}</p>
                <p>{formatAmount(event.amount)} XLM</p>
              </article>
            ))
          )}
        </div>
      </section>
    </main>
  )
}

export default App
