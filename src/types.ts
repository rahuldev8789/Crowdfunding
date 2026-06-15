export type TransactionStatus = 'idle' | 'pending' | 'success' | 'error'

export type WalletErrorCode = 'wallet-not-found' | 'user-rejected' | 'insufficient-balance'

export interface WalletErrorInfo {
  code: WalletErrorCode
  message: string
}
