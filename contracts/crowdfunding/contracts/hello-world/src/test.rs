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
    assert_eq!(client.is_funded(), false);
}

#[test]
fn test_donate_updates_progress() {
    let env = Env::default();
    let contract_id = env.register(Contract, ());
    let reward_id = env.register(reward_badge::Contract, ());
    let client = ContractClient::new(&env, &contract_id);
    let reward_client = reward_badge::ContractClient::new(&env, &reward_id);

    client.initialize(&String::from_str(&env, "creator"), &25000);
    let raised = client.donate(&String::from_str(&env, "alice"), &150, &reward_id);

    assert_eq!(raised, 150);
    assert_eq!(client.get_raised(), 150);
    assert_eq!(client.get_donor_contribution(&String::from_str(&env, "alice")), 150);
    assert_eq!(reward_client.balance_of(&String::from_str(&env, "alice")), 150);
}

#[test]
fn test_multiple_donations() {
    let env = Env::default();
    let contract_id = env.register(Contract, ());
    let reward_id = env.register(reward_badge::Contract, ());
    let client = ContractClient::new(&env, &contract_id);
    let reward_client = reward_badge::ContractClient::new(&env, &reward_id);

    client.initialize(&String::from_str(&env, "creator"), &10000);
    
    let raised1 = client.donate(&String::from_str(&env, "donor_1"), &500, &reward_id);
    assert_eq!(raised1, 500);

    let raised2 = client.donate(&String::from_str(&env, "donor_2"), &1250, &reward_id);
    assert_eq!(raised2, 1750);

    let raised3 = client.donate(&String::from_str(&env, "donor_3"), &300, &reward_id);
    assert_eq!(raised3, 2050);
    assert_eq!(client.get_raised(), 2050);
    assert_eq!(client.get_donor_contribution(&String::from_str(&env, "donor_2")), 1250);
    assert_eq!(reward_client.balance_of(&String::from_str(&env, "donor_3")), 300);
}

#[test]
fn test_getters_default() {
    let env = Env::default();
    let contract_id = env.register(Contract, ());
    let client = ContractClient::new(&env, &contract_id);

    assert_eq!(client.get_goal(), 0);
    assert_eq!(client.get_raised(), 0);
    assert_eq!(client.get_owner(), String::from_str(&env, ""));
    assert_eq!(client.is_funded(), false);
}

#[test]
fn test_marks_funded_at_goal() {
    let env = Env::default();
    let contract_id = env.register(Contract, ());
    let reward_id = env.register(reward_badge::Contract, ());
    let client = ContractClient::new(&env, &contract_id);

    client.initialize(&String::from_str(&env, "creator"), &1000);
    client.donate(&String::from_str(&env, "alice"), &700, &reward_id);
    assert_eq!(client.is_funded(), false);
    client.donate(&String::from_str(&env, "bob"), &300, &reward_id);
    assert_eq!(client.get_raised(), 1000);
    assert_eq!(client.is_funded(), true);
}
