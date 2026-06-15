#![cfg(test)]

use super::*;
use soroban_sdk::{Env, String};

#[test]
fn donate_updates_progress() {
    let env = Env::default();
    let contract_id = env.register(Contract, ());
    let client = ContractClient::new(&env, &contract_id);

    client.initialize(&String::from_str(&env, "creator"), &25000);
    let raised = client.donate(&String::from_str(&env, "alice"), &150);

    assert_eq!(raised, 150);
    assert_eq!(client.get_raised(), 150);
}
