#![cfg(test)]

use super::*;
use soroban_sdk::{Env, String};

#[test]
fn test_initialize() {
    let env = Env::default();
    let contract_id = env.register(Contract, ());
    let client = ContractClient::new(&env, &contract_id);

    client.initialize(&String::from_str(&env, "creator_alice"), &50000);

    assert_eq!(client.get_goal(), 50000);
    assert_eq!(client.get_raised(), 0);
    assert_eq!(client.get_owner(), String::from_str(&env, "creator_alice"));
}

#[test]
fn test_donate_updates_progress() {
    let env = Env::default();
    let contract_id = env.register(Contract, ());
    let client = ContractClient::new(&env, &contract_id);

    client.initialize(&String::from_str(&env, "creator"), &25000);
    let raised = client.donate(&String::from_str(&env, "alice"), &150);

    assert_eq!(raised, 150);
    assert_eq!(client.get_raised(), 150);
}

#[test]
fn test_multiple_donations() {
    let env = Env::default();
    let contract_id = env.register(Contract, ());
    let client = ContractClient::new(&env, &contract_id);

    client.initialize(&String::from_str(&env, "creator"), &10000);
    
    let raised1 = client.donate(&String::from_str(&env, "donor_1"), &500);
    assert_eq!(raised1, 500);

    let raised2 = client.donate(&String::from_str(&env, "donor_2"), &1250);
    assert_eq!(raised2, 1750);

    let raised3 = client.donate(&String::from_str(&env, "donor_3"), &300);
    assert_eq!(raised3, 2050);
    assert_eq!(client.get_raised(), 2050);
}

#[test]
fn test_getters_default() {
    let env = Env::default();
    let contract_id = env.register(Contract, ());
    let client = ContractClient::new(&env, &contract_id);

    assert_eq!(client.get_goal(), 0);
    assert_eq!(client.get_raised(), 0);
    assert_eq!(client.get_owner(), String::from_str(&env, ""));
}
