#![cfg(test)]

use super::*;
use soroban_sdk::{Env, String};

#[test]
fn credits_donor_balance() {
    let env = Env::default();
    let contract_id = env.register(Contract, ());
    let client = ContractClient::new(&env, &contract_id);

    let next = client.credit(&String::from_str(&env, "alice"), &75);
    assert_eq!(next, 75);
    assert_eq!(client.balance_of(&String::from_str(&env, "alice")), 75);
}

