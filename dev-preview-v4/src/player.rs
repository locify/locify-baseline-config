use near_sdk::{AccountId, bs58, env};
use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};
use near_sdk::serde::{Serialize, Deserialize};

#[derive(Clone, Serialize, Deserialize, BorshDeserialize, BorshSerialize)]
#[serde(crate = "near_sdk::serde")]
pub enum PlayerStatus {
    Active,
    Disabled,
}

#[derive(Clone, Serialize, Deserialize, BorshDeserialize, BorshSerialize)]
#[serde(crate = "near_sdk::serde")]
pub struct Player {
    pub(crate) id: String,
    pub(crate) linked_account: AccountId,
    pub(crate) status: PlayerStatus,
}

impl Player {
    pub(crate) fn new(linked_account: AccountId) -> Self {
        Self {
            id: bs58::encode(env::sha256(&env::random_seed())).into_string(),
            linked_account,
            status: PlayerStatus::Disabled,
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
}