export type TransactionStatus = 'idle' | 'pending' | 'success' | 'error'
export type SyncStatus = 'idle' | 'pending' | 'success' | 'error'

export type WalletErrorCode = 'wallet-not-found' | 'wallet-unavailable' | 'user-rejected' | 'insufficient-balance'

export interface WalletErrorInfo {
  code: WalletErrorCode
  message: string
}

export interface WalletOption {
  id: string
  label: string
  note: string
}

export interface DonationEvent {
  id: string
  kind: 'donation'
  donor: string
  amount: number
  status: 'success' | 'pending' | 'error'
}
