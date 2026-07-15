#![no_std]
use reward_badge::ContractClient as RewardBadgeClient;
use soroban_sdk::{
    contract, contractevent, contractimpl, contracttype, symbol_short, Address, Env, String, Symbol,
};

const GOAL: Symbol = symbol_short!("goal");
const RAISED: Symbol = symbol_short!("raised");
const OWNER: Symbol = symbol_short!("owner");
const DONOR_PREFIX: Symbol = symbol_short!("donor");
const FUNDED: Symbol = symbol_short!("funded");
const MIN_DON: Symbol = symbol_short!("mindon");
const DONOR_CNT: Symbol = symbol_short!("dcnt");

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub enum CampaignStatus {
    Active,
    GoalReached,
    Closed,
}

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct CampaignSummary {
    pub owner: String,
    pub goal: i128,
    pub raised: i128,
    pub donor_count: u32,
    pub is_funded: bool,
    pub min_donation: i128,
    pub status: CampaignStatus,
}

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct DonorRecord {
    pub total_contributed: i128,
    pub last_contribution: i128,
    pub contributions_count: u32,
}

#[contractevent]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct DonationReceived {
    #[topic]
    pub donor: String,
    pub amount: i128,
    pub raised: i128,
    pub goal: i128,
    pub donor_count: u32,
}

#[contractevent]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct DonationRefunded {
    #[topic]
    pub donor: String,
    pub amount: i128,
    pub raised: i128,
}

#[contractevent]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct CampaignWithdrawn {
    #[topic]
    pub owner: String,
    pub amount: i128,
}

#[contract]
pub struct Contract;

#[contractimpl]
impl Contract {
    pub fn initialize(env: Env, owner: String, goal: i128, min_donation: i128) {
        if goal <= 0 {
            panic!("goal must be positive");
        }
        if min_donation < 0 {
            panic!("min_donation cannot be negative");
        }
        env.storage().persistent().set(&GOAL, &goal);
        env.storage().persistent().set(&RAISED, &0i128);
        env.storage().persistent().set(&FUNDED, &false);
        env.storage().persistent().set(&OWNER, &owner);
        env.storage().persistent().set(&MIN_DON, &min_donation);
        env.storage().persistent().set(&DONOR_CNT, &0u32);
    }

    pub fn donate(env: Env, donor: String, amount: i128, reward_contract: Address) -> i128 {
        if amount <= 0 {
            panic!("donation must be positive");
        }
        let goal: i128 = env.storage().persistent().get(&GOAL).unwrap_or(0);
        if goal == 0 {
            panic!("contract is not initialized");
        }
        let min_don: i128 = env.storage().persistent().get(&MIN_DON).unwrap_or(0);
        if amount < min_don {
            panic!("donation is below required minimum");
        }

        let mut raised: i128 = env.storage().persistent().get(&RAISED).unwrap_or(0);
        raised += amount;
        env.storage().persistent().set(&RAISED, &raised);

        // Update donor contributions and record struct
        let mut donor_rec: DonorRecord = env
            .storage()
            .persistent()
            .get(&(DONOR_PREFIX, donor.clone()))
            .unwrap_or(DonorRecord {
                total_contributed: 0,
                last_contribution: 0,
                contributions_count: 0,
            });

        let mut donor_count: u32 = env.storage().persistent().get(&DONOR_CNT).unwrap_or(0);
        if donor_rec.contributions_count == 0 {
            donor_count += 1;
            env.storage().persistent().set(&DONOR_CNT, &donor_count);
        }

        donor_rec.total_contributed += amount;
        donor_rec.last_contribution = amount;
        donor_rec.contributions_count += 1;
        env.storage()
            .persistent()
            .set(&(DONOR_PREFIX, donor.clone()), &donor_rec);

        if raised >= goal {
            env.storage().persistent().set(&FUNDED, &true);
        }

        // Inter-contract call to reward badge contract
        let reward_client = RewardBadgeClient::new(&env, &reward_contract);
        let _: i128 = reward_client.credit(&donor, &amount);

        DonationReceived {
            donor,
            amount,
            raised,
            goal,
            donor_count,
        }
        .publish(&env);

        raised
    }

    pub fn get_campaign_summary(env: Env) -> CampaignSummary {
        let goal: i128 = env.storage().persistent().get(&GOAL).unwrap_or(0);
        let raised: i128 = env.storage().persistent().get(&RAISED).unwrap_or(0);
        let owner: String = env
            .storage()
            .persistent()
            .get(&OWNER)
            .unwrap_or(String::from_str(&env, ""));
        let donor_count: u32 = env.storage().persistent().get(&DONOR_CNT).unwrap_or(0);
        let is_funded: bool = env.storage().persistent().get(&FUNDED).unwrap_or(false);
        let min_donation: i128 = env.storage().persistent().get(&MIN_DON).unwrap_or(0);

        let status = if is_funded {
            CampaignStatus::GoalReached
        } else if goal == 0 {
            CampaignStatus::Closed
        } else {
            CampaignStatus::Active
        };

        CampaignSummary {
            owner,
            goal,
            raised,
            donor_count,
            is_funded,
            min_donation,
            status,
        }
    }

    pub fn get_donor_record(env: Env, donor: String) -> DonorRecord {
        env.storage()
            .persistent()
            .get(&(DONOR_PREFIX, donor))
            .unwrap_or(DonorRecord {
                total_contributed: 0,
                last_contribution: 0,
                contributions_count: 0,
            })
    }

    pub fn get_status(env: Env) -> CampaignStatus {
        Self::get_campaign_summary(env).status
    }

    pub fn get_goal(env: Env) -> i128 {
        env.storage().persistent().get(&GOAL).unwrap_or(0)
    }

    pub fn get_raised(env: Env) -> i128 {
        env.storage().persistent().get(&RAISED).unwrap_or(0)
    }

    pub fn get_owner(env: Env) -> String {
        env.storage()
            .persistent()
            .get(&OWNER)
            .unwrap_or(String::from_str(&env, ""))
    }

    pub fn get_donor_contribution(env: Env, donor: String) -> i128 {
        let rec = Self::get_donor_record(env, donor);
        rec.total_contributed
    }

    pub fn is_funded(env: Env) -> bool {
        env.storage().persistent().get(&FUNDED).unwrap_or(false)
    }

    pub fn refund(env: Env, donor: String) -> i128 {
        let is_funded: bool = env.storage().persistent().get(&FUNDED).unwrap_or(false);
        if is_funded {
            panic!("cannot refund: campaign goal reached");
        }
        let mut rec: DonorRecord = env
            .storage()
            .persistent()
            .get(&(DONOR_PREFIX, donor.clone()))
            .unwrap_or(DonorRecord {
                total_contributed: 0,
                last_contribution: 0,
                contributions_count: 0,
            });
        if rec.total_contributed <= 0 {
            panic!("no contributions found for donor");
        }
        let refund_amount = rec.total_contributed;
        let mut raised: i128 = env.storage().persistent().get(&RAISED).unwrap_or(0);
        raised -= refund_amount;
        env.storage().persistent().set(&RAISED, &raised);

        rec.total_contributed = 0;
        env.storage()
            .persistent()
            .set(&(DONOR_PREFIX, donor.clone()), &rec);

        DonationRefunded {
            donor,
            amount: refund_amount,
            raised,
        }
        .publish(&env);

        refund_amount
    }

    pub fn withdraw(env: Env, caller: String) -> i128 {
        let owner: String = env
            .storage()
            .persistent()
            .get(&OWNER)
            .unwrap_or(String::from_str(&env, ""));
        if caller != owner {
            panic!("unauthorized: caller must be campaign owner");
        }
        let is_funded: bool = env.storage().persistent().get(&FUNDED).unwrap_or(false);
        if !is_funded {
            panic!("cannot withdraw: campaign goal not reached");
        }
        let raised: i128 = env.storage().persistent().get(&RAISED).unwrap_or(0);
        if raised <= 0 {
            panic!("no funds available for withdrawal");
        }
        env.storage().persistent().set(&RAISED, &0i128);

        CampaignWithdrawn {
            owner: caller,
            amount: raised,
        }
        .publish(&env);

        raised
    }
}

mod test;
