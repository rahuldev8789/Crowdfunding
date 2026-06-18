import { describe, it, expect } from 'vitest'
import { formatAmount, testnetExplorerUrl, CONTRACT_ID, TESTNET_EXPLORER_BASE } from './stellar'

describe('Stellar DApp Helper Utilities', () => {
  it('formats numeric amounts correctly with commas', () => {
    expect(formatAmount(25000)).toBe('25,000')
    expect(formatAmount('1500')).toBe('1,500')
    expect(formatAmount(0)).toBe('0')
  })

  it('handles invalid format amounts gracefully', () => {
    expect(formatAmount('invalid')).toBe('0')
  })

  it('generates the correct Stellar Expert explorer URL for contracts', () => {
    const expectedUrl = `${TESTNET_EXPLORER_BASE}/${CONTRACT_ID}`
    expect(testnetExplorerUrl(CONTRACT_ID)).toBe(expectedUrl)
  })

  it('maintains valid Testnet contract ID format', () => {
    expect(CONTRACT_ID).toMatch(/^C[A-Z0-9]{55}$/)
  })
})
