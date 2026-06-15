import { Networks, Operation, TransactionBuilder, rpc, scValToNative, nativeToScVal, xdr } from '@stellar/stellar-sdk'

export const TESTNET_NETWORK_PASSPHRASE = Networks.TESTNET
export const HORIZON_URL = 'https://horizon-testnet.stellar.org'
export const RPC_URL = 'https://soroban-testnet.stellar.org'
export const CONTRACT_ID = 'CDA2XIUNNPXW3XR2N752LCVATZDG2CQEK2L2LRVKSXRZWHZ4RERYEFOX'
export const TESTNET_EXPLORER_BASE = 'https://stellar.expert/explorer/testnet/contract'

const rpcServer = new rpc.Server(RPC_URL, { allowHttp: false })

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
  const account = await rpcServer.getAccount(donor)
  const fee = '100'

  const tx = new TransactionBuilder(account, {
    fee,
    networkPassphrase: TESTNET_NETWORK_PASSPHRASE,
  })
    .addOperation(
      Operation.invokeContractFunction({
        contract: CONTRACT_ID,
        function: 'donate',
        args: [nativeToScVal(donor, { type: 'string' }), nativeToScVal(BigInt(Math.round(amount)), { type: 'u64' })],
      }),
    )
    .setTimeout(300)
    .build()

  const simulation = await rpcServer.simulateTransaction(tx)
  return rpc.assembleTransaction(tx, simulation).build()
}
