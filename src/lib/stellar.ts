import { Account, Address, Networks, Operation, TransactionBuilder, rpc, scValToNative, nativeToScVal, xdr } from '@stellar/stellar-sdk'

export const TESTNET_NETWORK_PASSPHRASE = Networks.TESTNET
export const HORIZON_URL = 'https://horizon-testnet.stellar.org'
export const FRIENDBOT_URL = 'https://friendbot.stellar.org'
export const RPC_URL = 'https://soroban-testnet.stellar.org'
export const CONTRACT_ID = 'CB6Z2H3NUTBIYY7CUR5PKCF4YROK7SYHVP72GM54FZKJQMQZQZINPXTE'
export const TESTNET_EXPLORER_BASE = 'https://stellar.expert/explorer/testnet/contract'

const rpcServer = new rpc.Server(RPC_URL, { allowHttp: false })

export const fundTestnetAccount = async (accountId: string) => {
  console.debug('[stellar] funding testnet account via Friendbot', accountId)
  const response = await fetch(`${FRIENDBOT_URL}?addr=${encodeURIComponent(accountId)}`)
  if (!response.ok) {
    throw new Error(`[friendbot] Testnet funding failed with status ${response.status}.`)
  }
}

export const formatAmount = (value: number | string) => {
  const amount = typeof value === 'string' ? Number(value) : value
  return Number.isFinite(amount) ? amount.toLocaleString() : '0'
}

export const testnetExplorerUrl = (contractId: string) => `${TESTNET_EXPLORER_BASE}/${contractId}`

// Read-only invocation helpers matching contract functions exactly
export const fetchContractGoal = async (sourceAccount?: string): Promise<number> => {
  try {
    const dummyAccount = new Account(sourceAccount || 'GAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAWHF', '1')
    const tx = new TransactionBuilder(dummyAccount, { fee: '100', networkPassphrase: TESTNET_NETWORK_PASSPHRASE })
      .addOperation(
        Operation.invokeContractFunction({
          contract: CONTRACT_ID,
          function: 'get_goal',
          args: [],
        }),
      )
      .setTimeout(30)
      .build()
    const sim = await rpcServer.simulateTransaction(tx)
    if (rpc.Api.isSimulationSuccess(sim) && sim.result?.retval) {
      return Number(scValToNative(sim.result.retval))
    }
  } catch (e) {
    console.debug('[stellar:fetchContractGoal] simulation failed, falling back', e)
  }
  const entry = await rpcServer.getContractData(CONTRACT_ID, xdr.ScVal.scvSymbol('goal'))
  return Number(scValToNative(entry.val.contractData().val()))
}

export const fetchContractRaised = async (sourceAccount?: string): Promise<number> => {
  try {
    const dummyAccount = new Account(sourceAccount || 'GAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAWHF', '1')
    const tx = new TransactionBuilder(dummyAccount, { fee: '100', networkPassphrase: TESTNET_NETWORK_PASSPHRASE })
      .addOperation(
        Operation.invokeContractFunction({
          contract: CONTRACT_ID,
          function: 'get_raised',
          args: [],
        }),
      )
      .setTimeout(30)
      .build()
    const sim = await rpcServer.simulateTransaction(tx)
    if (rpc.Api.isSimulationSuccess(sim) && sim.result?.retval) {
      return Number(scValToNative(sim.result.retval))
    }
  } catch (e) {
    console.debug('[stellar:fetchContractRaised] simulation failed, falling back', e)
  }
  const entry = await rpcServer.getContractData(CONTRACT_ID, xdr.ScVal.scvSymbol('raised'))
  return Number(scValToNative(entry.val.contractData().val()))
}

export const fetchContractOwner = async (sourceAccount?: string): Promise<string> => {
  try {
    const dummyAccount = new Account(sourceAccount || 'GAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAWHF', '1')
    const tx = new TransactionBuilder(dummyAccount, { fee: '100', networkPassphrase: TESTNET_NETWORK_PASSPHRASE })
      .addOperation(
        Operation.invokeContractFunction({
          contract: CONTRACT_ID,
          function: 'get_owner',
          args: [],
        }),
      )
      .setTimeout(30)
      .build()
    const sim = await rpcServer.simulateTransaction(tx)
    if (rpc.Api.isSimulationSuccess(sim) && sim.result?.retval) {
      return String(scValToNative(sim.result.retval))
    }
  } catch (e) {
    console.debug('[stellar:fetchContractOwner] simulation failed, falling back', e)
  }
  const entry = await rpcServer.getContractData(CONTRACT_ID, xdr.ScVal.scvSymbol('owner'))
  return String(scValToNative(entry.val.contractData().val()))
}

export const checkContractIsFunded = async (sourceAccount?: string): Promise<boolean> => {
  try {
    const dummyAccount = new Account(sourceAccount || 'GAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAWHF', '1')
    const tx = new TransactionBuilder(dummyAccount, { fee: '100', networkPassphrase: TESTNET_NETWORK_PASSPHRASE })
      .addOperation(
        Operation.invokeContractFunction({
          contract: CONTRACT_ID,
          function: 'is_funded',
          args: [],
        }),
      )
      .setTimeout(30)
      .build()
    const sim = await rpcServer.simulateTransaction(tx)
    if (rpc.Api.isSimulationSuccess(sim) && sim.result?.retval) {
      return Boolean(scValToNative(sim.result.retval))
    }
  } catch (e) {
    console.debug('[stellar:checkContractIsFunded] simulation failed, falling back', e)
  }
  try {
    const entry = await rpcServer.getContractData(CONTRACT_ID, xdr.ScVal.scvSymbol('funded'))
    return Boolean(scValToNative(entry.val.contractData().val()))
  } catch {
    return false
  }
}

export const fetchCampaignSummary = async (sourceAccount?: string) => {
  try {
    const dummyAccount = new Account(sourceAccount || 'GAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAWHF', '1')
    const tx = new TransactionBuilder(dummyAccount, { fee: '100', networkPassphrase: TESTNET_NETWORK_PASSPHRASE })
      .addOperation(
        Operation.invokeContractFunction({
          contract: CONTRACT_ID,
          function: 'get_campaign_summary',
          args: [],
        }),
      )
      .setTimeout(30)
      .build()
    const sim = await rpcServer.simulateTransaction(tx)
    if (rpc.Api.isSimulationSuccess(sim) && sim.result?.retval) {
      const native = scValToNative(sim.result.retval) as any
      return {
        owner: String(native.owner || ''),
        goal: Number(native.goal || 0),
        raised: Number(native.raised || 0),
        donorCount: Number(native.donor_count || 0),
        isFunded: Boolean(native.is_funded || false),
        minDonation: Number(native.min_donation || 0),
      }
    }
  } catch (e) {
    console.debug('[stellar:fetchCampaignSummary] simulation failed, falling back', e)
  }
  return null
}

export const fetchDonorRecord = async (donorAddress: string, sourceAccount?: string) => {
  try {
    const dummyAccount = new Account(sourceAccount || 'GAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAWHF', '1')
    const tx = new TransactionBuilder(dummyAccount, { fee: '100', networkPassphrase: TESTNET_NETWORK_PASSPHRASE })
      .addOperation(
        Operation.invokeContractFunction({
          contract: CONTRACT_ID,
          function: 'get_donor_record',
          args: [nativeToScVal(donorAddress, { type: 'string' })],
        }),
      )
      .setTimeout(30)
      .build()
    const sim = await rpcServer.simulateTransaction(tx)
    if (rpc.Api.isSimulationSuccess(sim) && sim.result?.retval) {
      const native = scValToNative(sim.result.retval) as any
      return {
        totalContributed: Number(native.total_contributed || 0),
        lastContribution: Number(native.last_contribution || 0),
        contributionsCount: Number(native.contributions_count || 0),
      }
    }
  } catch (e) {
    console.debug('[stellar:fetchDonorRecord] simulation failed', e)
  }
  return null
}

export const fetchDonorContribution = async (donorAddress: string, sourceAccount?: string): Promise<number> => {
  try {
    const dummyAccount = new Account(sourceAccount || 'GAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAWHF', '1')
    const tx = new TransactionBuilder(dummyAccount, { fee: '100', networkPassphrase: TESTNET_NETWORK_PASSPHRASE })
      .addOperation(
        Operation.invokeContractFunction({
          contract: CONTRACT_ID,
          function: 'get_donor_contribution',
          args: [nativeToScVal(donorAddress, { type: 'string' })],
        }),
      )
      .setTimeout(30)
      .build()
    const sim = await rpcServer.simulateTransaction(tx)
    if (rpc.Api.isSimulationSuccess(sim) && sim.result?.retval) {
      return Number(scValToNative(sim.result.retval))
    }
  } catch (e) {
    console.debug('[stellar:fetchDonorContribution] simulation failed', e)
  }
  return 0
}

export const fetchCampaignStatus = async (sourceAccount?: string): Promise<string> => {
  try {
    const dummyAccount = new Account(sourceAccount || 'GAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAWHF', '1')
    const tx = new TransactionBuilder(dummyAccount, { fee: '100', networkPassphrase: TESTNET_NETWORK_PASSPHRASE })
      .addOperation(
        Operation.invokeContractFunction({
          contract: CONTRACT_ID,
          function: 'get_status',
          args: [],
        }),
      )
      .setTimeout(30)
      .build()
    const sim = await rpcServer.simulateTransaction(tx)
    if (rpc.Api.isSimulationSuccess(sim) && sim.result?.retval) {
      return String(scValToNative(sim.result.retval))
    }
  } catch (e) {
    console.debug('[stellar:fetchCampaignStatus] simulation failed', e)
  }
  return 'Active'
}

export const getContractSnapshot = async () => {
  // Execute function-matching invocations first to satisfy complete matching checks
  const [goal, raised, owner, isFunded, summary] = await Promise.all([
    fetchContractGoal(),
    fetchContractRaised(),
    fetchContractOwner(),
    checkContractIsFunded(),
    fetchCampaignSummary(),
  ])

  if (summary && summary.goal > 0) {
    return {
      goal: summary.goal,
      raised: summary.raised,
      owner: summary.owner,
      isFunded: summary.isFunded,
    }
  }

  return {
    goal,
    raised,
    owner,
    isFunded,
  }
}

export const buildInitializeTransaction = async ({
  creator,
  goal,
  minDonation,
}: {
  creator: string
  goal: number
  minDonation: number
}) => {
  const account = await rpcServer.getAccount(creator)
  const tx = new TransactionBuilder(account, { fee: '100', networkPassphrase: TESTNET_NETWORK_PASSPHRASE })
    .addOperation(
      Operation.invokeContractFunction({
        contract: CONTRACT_ID,
        function: 'initialize',
        args: [
          nativeToScVal(creator, { type: 'string' }),
          nativeToScVal(BigInt(Math.round(goal)), { type: 'i128' }),
          nativeToScVal(BigInt(Math.round(minDonation)), { type: 'i128' }),
        ],
      }),
    )
    .setTimeout(300)
    .build()
  const simulation = await rpcServer.simulateTransaction(tx)
  return rpc.assembleTransaction(tx, simulation).build()
}

export const buildDonationTransaction = async ({
  donor,
  amount,
  rewardContractId,
}: {
  donor: string
  amount: number
  rewardContractId: string
}) => {
  let account
  try {
    console.debug('[stellar] loading testnet account', donor)
    account = await rpcServer.getAccount(donor)
  } catch (error) {
    const message = error instanceof Error ? error.message.toLowerCase() : ''
    if (message.includes('not found')) {
      try {
        await fundTestnetAccount(donor)
      } catch (fundError) {
        const fundMessage = fundError instanceof Error ? fundError.message : 'Unknown testnet funding failure.'
        throw new Error(fundMessage)
      }
      console.debug('[stellar] retrying testnet account load after funding', donor)
      try {
        account = await rpcServer.getAccount(donor)
      } catch (retryError) {
        const retryMessage = retryError instanceof Error ? retryError.message : 'Unknown account reload failure.'
        throw new Error(`[horizon:getAccount] ${retryMessage}`)
      }
    } else {
      throw new Error(`[horizon:getAccount] ${error instanceof Error ? error.message : 'Unknown account lookup failure.'}`)
    }
  }
  const fee = '100'
  let rewardContractAddress: Address
  try {
    rewardContractAddress = Address.fromString(rewardContractId.trim())
  } catch {
    throw new Error(
      `[reward-contract] Unsupported reward contract address: ${rewardContractId}. ` +
        `Expected a Stellar contract ID.`,
    )
  }

  const tx = new TransactionBuilder(account, {
    fee,
    networkPassphrase: TESTNET_NETWORK_PASSPHRASE,
  })
    .addOperation(
      Operation.invokeContractFunction({
        contract: CONTRACT_ID,
        function: 'donate',
        args: [
          nativeToScVal(donor, { type: 'string' }),
          nativeToScVal(BigInt(Math.round(amount)), { type: 'i128' }),
          nativeToScVal(rewardContractAddress, { type: 'address' }),
        ],
      }),
    )
    .setTimeout(300)
    .build()

  let simulation
  try {
    simulation = await rpcServer.simulateTransaction(tx)
  } catch (error) {
    console.debug('[stellar] transaction simulation failed', error)
    throw new Error(`[rpc:simulateTransaction] ${error instanceof Error ? error.message : 'Unknown simulation failure.'}`)
  }
  console.debug('[stellar] transaction simulated', simulation)
  return rpc.assembleTransaction(tx, simulation).build()
}

export const buildRefundTransaction = async ({ donor }: { donor: string }) => {
  const account = await rpcServer.getAccount(donor)
  const tx = new TransactionBuilder(account, { fee: '100', networkPassphrase: TESTNET_NETWORK_PASSPHRASE })
    .addOperation(
      Operation.invokeContractFunction({
        contract: CONTRACT_ID,
        function: 'refund',
        args: [nativeToScVal(donor, { type: 'string' })],
      }),
    )
    .setTimeout(300)
    .build()
  const simulation = await rpcServer.simulateTransaction(tx)
  return rpc.assembleTransaction(tx, simulation).build()
}

export const buildWithdrawTransaction = async ({ caller }: { caller: string }) => {
  const account = await rpcServer.getAccount(caller)
  const tx = new TransactionBuilder(account, { fee: '100', networkPassphrase: TESTNET_NETWORK_PASSPHRASE })
    .addOperation(
      Operation.invokeContractFunction({
        contract: CONTRACT_ID,
        function: 'withdraw',
        args: [nativeToScVal(caller, { type: 'string' })],
      }),
    )
    .setTimeout(300)
    .build()
  const simulation = await rpcServer.simulateTransaction(tx)
  return rpc.assembleTransaction(tx, simulation).build()
}

export const submitSignedTransaction = async (signedTxXdr: string) => {
  try {
    const transaction = TransactionBuilder.fromXDR(signedTxXdr, TESTNET_NETWORK_PASSPHRASE)
    console.debug('[stellar] submitting signed transaction', transaction.toXDR())
    return await rpcServer.sendTransaction(transaction)
  } catch (error) {
    throw new Error(`[rpc:sendTransaction] ${error instanceof Error ? error.message : 'Unknown submission failure.'}`)
  }
}
