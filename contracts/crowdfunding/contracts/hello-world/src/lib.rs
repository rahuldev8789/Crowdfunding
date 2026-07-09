#![no_std]
use soroban_sdk::{contract, contractevent, contractimpl, symbol_short, Env, String, Symbol};

const GOAL: Symbol = symbol_short!("goal");
const RAISED: Symbol = symbol_short!("raised");
const OWNER: Symbol = symbol_short!("owner");
const DONOR_PREFIX: Symbol = symbol_short!("donor");
const FUNDED: Symbol = symbol_short!("funded");

#[contractevent]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct DonationReceived {
    #[topic]
    pub donor: String,
    pub amount: i128,
    pub raised: i128,
    pub goal: i128,
}

#[contract]
pub struct Contract;

#[contractimpl]
impl Contract {
    pub fn initialize(env: Env, owner: String, goal: i128) {
        if goal <= 0 {
            panic!("goal must be positive");
        }
        env.storage().persistent().set(&DONOR_PREFIX, &0u32);
        env.storage().persistent().set(&GOAL, &goal);
        env.storage().persistent().set(&RAISED, &0i128);
        env.storage().persistent().set(&FUNDED, &false);
        env.storage().persistent().set(&OWNER, &owner);
    }

    pub fn donate(env: Env, donor: String, amount: i128) -> i128 {
        if amount <= 0 {
            panic!("donation must be positive");
        }
        let mut raised: i128 = env.storage().persistent().get(&RAISED).unwrap_or(0);
        let goal: i128 = env.storage().persistent().get(&GOAL).unwrap_or(0);
        if goal == 0 {
            panic!("contract is not initialized");
        }
        raised += amount;
        env.storage().persistent().set(&RAISED, &raised);
        env.storage()
            .persistent()
            .set(&(DONOR_PREFIX, donor.clone()), &amount);
        if raised >= goal {
            env.storage().persistent().set(&FUNDED, &true);
        }

        DonationReceived { donor, amount, raised, goal }.publish(&env);
        raised
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
        env.storage()
            .persistent()
            .get(&(DONOR_PREFIX, donor))
            .unwrap_or(0)
    }

    pub fn is_funded(env: Env) -> bool {
        env.storage().persistent().get(&FUNDED).unwrap_or(false)
    }
}

mod test;
