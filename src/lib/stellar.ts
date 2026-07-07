import { Networks, Operation, TransactionBuilder, rpc, scValToNative, nativeToScVal, xdr } from '@stellar/stellar-sdk'

export const TESTNET_NETWORK_PASSPHRASE = Networks.TESTNET
export const HORIZON_URL = 'https://horizon-testnet.stellar.org'
export const FRIENDBOT_URL = 'https://friendbot.stellar.org'
export const RPC_URL = 'https://soroban-testnet.stellar.org'
export const CONTRACT_ID = 'CDA2XIUNNPXW3XR2N752LCVATZDG2CQEK2L2LRVKSXRZWHZ4RERYEFOX'
export const TESTNET_EXPLORER_BASE = 'https://stellar.expert/explorer/testnet/contract'

const rpcServer = new rpc.Server(RPC_URL, { allowHttp: false })

const fundTestnetAccount = async (accountId: string) => {
  console.debug('[stellar] funding testnet account via Friendbot', accountId)
  const response = await fetch(`${FRIENDBOT_URL}?addr=${encodeURIComponent(accountId)}`)
  if (!response.ok) {
    throw new Error(`Testnet funding failed with status ${response.status}.`)
  }
}

export const formatAmount = (value: number | string) => {
  const amount = typeof value === 'string' ? Number(value) : value
  return Number.isFinite(amount) ? amount.toLocaleString() : '0'
}

export const testnetExplorerUrl = (contractId: string) => `${TESTNET_EXPLORER_BASE}/${contractId}`

export const getContractSnapshot = async () => {
  const [goalEntry, raisedEntry, ownerEntry] = await Promise.all([
    rpcServer.getContractData(CONTRACT_ID, xdr.ScVal.scvSymbol('goal')),
    rpcServer.getContractData(CONTRACT_ID, xdr.ScVal.scvSymbol('raised')),
    rpcServer.getContractData(CONTRACT_ID, xdr.ScVal.scvSymbol('owner')),
  ])

  return {
    goal: Number(scValToNative(goalEntry.val.contractData().val())),
    raised: Number(scValToNative(raisedEntry.val.contractData().val())),
    owner: String(scValToNative(ownerEntry.val.contractData().val())),
  }
}

export const buildDonationTransaction = async ({
  donor,
  amount,
}: {
  donor: string
  amount: number
}) => {
  let account
  try {
    console.debug('[stellar] loading testnet account', donor)
    account = await rpcServer.getAccount(donor)
  } catch (error) {
    const message = error instanceof Error ? error.message.toLowerCase() : ''
    if (message.includes('not found')) {
      await fundTestnetAccount(donor)
      console.debug('[stellar] retrying testnet account load after funding', donor)
      account = await rpcServer.getAccount(donor)
    } else {
      throw error
    }
  }
  const fee = '100'

  const tx = new TransactionBuilder(account, {
    fee,
    networkPassphrase: TESTNET_NETWORK_PASSPHRASE,
  })
    .addOperation(
      Operation.invokeContractFunction({
        contract: CONTRACT_ID,
        function: 'donate',
        args: [nativeToScVal(donor, { type: 'string' }), nativeToScVal(BigInt(Math.round(amount)), { type: 'i128' })],
      }),
    )
    .setTimeout(300)
    .build()

  let simulation
  try {
    simulation = await rpcServer.simulateTransaction(tx)
  } catch (error) {
    console.debug('[stellar] transaction simulation failed', error)
    throw error
  }
  console.debug('[stellar] transaction simulated', simulation)
  return rpc.assembleTransaction(tx, simulation).build()
}

export const submitSignedTransaction = async (signedTxXdr: string) => {
  const transaction = TransactionBuilder.fromXDR(signedTxXdr, TESTNET_NETWORK_PASSPHRASE)
  console.debug('[stellar] submitting signed transaction', transaction.toXDR())
  return rpcServer.sendTransaction(transaction)
}
