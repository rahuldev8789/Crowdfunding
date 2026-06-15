#![no_std]
use soroban_sdk::{contract, contractimpl, symbol_short, Env, String, Symbol};

const GOAL: Symbol = symbol_short!("goal");
const RAISED: Symbol = symbol_short!("raised");
const OWNER: Symbol = symbol_short!("owner");

#[contract]
pub struct Contract;

#[contractimpl]
impl Contract {
    pub fn initialize(env: Env, owner: String, goal: i128) {
        let owner_key = String::from_str(&env, "owner");
        env.storage().persistent().set(&owner_key, &owner);
        env.storage().persistent().set(&GOAL, &goal);
        env.storage().persistent().set(&RAISED, &0i128);
        env.storage().persistent().set(&OWNER, &owner);
    }

    pub fn donate(env: Env, donor: String, amount: i128) -> i128 {
        let mut raised: i128 = env.storage().persistent().get(&RAISED).unwrap_or(0);
        raised += amount;
        env.storage().persistent().set(&RAISED, &raised);

        env.events()
            .publish(("donation", "received"), (donor, amount, raised));
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
}

mod test;
