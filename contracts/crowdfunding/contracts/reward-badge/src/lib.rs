#![no_std]
use soroban_sdk::{contract, contractimpl, symbol_short, Env, String, Symbol};

const BALANCE_PREFIX: Symbol = symbol_short!("balance");

#[contract]
pub struct Contract;

#[contractimpl]
impl Contract {
    pub fn credit(env: Env, donor: String, amount: i128) -> i128 {
        let current: i128 = env
            .storage()
            .persistent()
            .get(&(BALANCE_PREFIX, donor.clone()))
            .unwrap_or(0);
        let updated = current + amount;
        env.storage()
            .persistent()
            .set(&(BALANCE_PREFIX, donor), &updated);
        updated
    }

    pub fn balance_of(env: Env, donor: String) -> i128 {
        env.storage()
            .persistent()
            .get(&(BALANCE_PREFIX, donor))
            .unwrap_or(0)
    }
}

mod test;
