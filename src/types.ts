export type TransactionStatus = 'idle' | 'pending' | 'success' | 'error'
export type SyncStatus = 'idle' | 'pending' | 'success' | 'error'

export type WalletErrorCode =
  | 'wallet-not-found'
  | 'wallet-unavailable'
  | 'contract-address-invalid'
  | 'user-rejected'
  | 'insufficient-balance'

export interface WalletErrorInfo {
  code: WalletErrorCode
  message: string
}

export interface WalletOption {
  id: string
  name: string
  type: string
  icon: string
  url: string
  isAvailable: boolean
}

export interface DonationEvent {
  id: string
  kind: 'donation'
  donor: string
  amount: number
  status: 'success' | 'pending' | 'error'
}
