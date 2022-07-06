use serde_json::json;
use serde::{Deserialize, Serialize};
use workspaces::prelude::*;
use workspaces::{network::Sandbox, Account, AccountId, Contract, Worker};
use near_sdk::{Balance, bs58, env};
use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};
use near_units::{parse_gas, parse_near};

#[derive(Clone, Serialize, Deserialize, PartialEq)]
pub enum PlayerStatus {
    Active,
    Disabled,
}

#[derive(Clone, Serialize, Deserialize, PartialEq)]
pub enum PlayerType {
    Advertiser,
    Publisher,
}

#[derive(Clone, Serialize, Deserialize)]
pub struct Player {
    pub(crate) id: String,
    pub(crate) linked_account: AccountId,
    pub(crate) status: PlayerStatus,
    pub(crate) balance: Balance,
}

impl Player {
    pub(crate) fn new(linked_account: AccountId) -> Self {
        Self {
            id: bs58::encode(env::sha256(&env::random_seed())).into_string(),
            linked_account,
            status: PlayerStatus::Disabled,

            balance: 0,
        }
    }
    pub(crate) fn activate(mut self) -> Player {
        self.status = PlayerStatus::Active;
        self.clone()
    }
    pub(crate) fn disable(mut self) -> Player {
        self.status = PlayerStatus::Disabled;
        self.clone()
    }
    pub(crate) fn add_balance(mut self, balance: Balance) {
        self.balance = self.balance + balance
    }
}

const WASM_FILEPATH: &str = "../../res/rtb_contract.wasm";

#[tokio::main]
async fn main() -> anyhow::Result<()> {
    let worker = workspaces::sandbox().await?;
    let wasm = std::fs::read(WASM_FILEPATH)?;
    let contract = worker.dev_deploy(&wasm).await?;

    // create accounts
    let owner = worker.root_account();
    let alice = owner
        .create_subaccount(&worker, "alice")
        .initial_balance(parse_near!("30 N"))
        .transact()
        .await?
        .into_result()?;

    contract.call(&worker, "new")
        .args_json(serde_json::json!({
            "owner_id": owner.id(),
        }))?
        .transact()
        .await?;

    // begin tests
    test_player_add(&owner, &alice, &contract, &worker).await?;
    Ok(())
}

async fn test_player_add(
    owner: &Account,
    user: &Account,
    contract: &Contract,
    worker: &Worker<Sandbox>,
) -> anyhow::Result<()> {
    let player_id: String = user
        .call(&worker, contract.id(), "player_add")
        .args_json(json!({ "account_id": "alice.testnet", "player_type": "Publisher" }))?
        .transact()
        .await?
        .json()?;

    let alice_id: Player = owner
        .call(&worker, contract.id(), "get_player")
        .args_json(json!({ "player_id": player_id }))?
        .transact()
        .await?
        .json()?;

    assert_eq!(alice_id.id, player_id);
    println!("      Passed ✅ player_add");
    Ok(())
}