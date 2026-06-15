import { Horizon, Networks, rpc, xdr } from '@stellar/stellar-sdk'

export const TESTNET_NETWORK_PASSPHRASE = Networks.TESTNET
export const HORIZON_URL = 'https://horizon-testnet.stellar.org'
export const RPC_URL = 'https://soroban-testnet.stellar.org'
export const CONTRACT_ID = 'CDA2XIUNNPXW3XR2N752LCVATZDG2CQEK2L2LRVKSXRZWHZ4RERYEFOX'

export const loadAccount = async (publicKey: string) => {
  const server = new Horizon.Server(HORIZON_URL)
  return server.loadAccount(publicKey)
}

export const getContractState = async () => {
  const server = new rpc.Server(RPC_URL, { allowHttp: false })
  const response = await server.getContractData(CONTRACT_ID, xdr.ScVal.scvSymbol('goal'))
  return response
}

export const formatAmount = (value: number | string) => {
  const amount = typeof value === 'string' ? Number(value) : value
  return Number.isFinite(amount) ? amount.toLocaleString() : '0'
}
