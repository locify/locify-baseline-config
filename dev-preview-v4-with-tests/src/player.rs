use near_sdk::{AccountId, Balance, bs58, env};
use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};
use near_sdk::serde::{Serialize, Deserialize};
use crate::player;

#[derive(Clone, Serialize, Deserialize, BorshDeserialize, BorshSerialize, PartialEq)]
#[serde(crate = "near_sdk::serde")]
/// A Player status active or disabled
pub enum PlayerStatus {
    Active,
    Disabled,
}

#[derive(Clone, Serialize, Deserialize, BorshDeserialize, BorshSerialize, PartialEq)]
#[serde(crate = "near_sdk::serde")]
/// A Player type publisher or advertiser
pub enum PlayerType {
    Advertiser,
    Publisher,
}

#[derive(Clone, Serialize, Deserialize, BorshDeserialize, BorshSerialize)]
#[serde(crate = "near_sdk::serde")]
/// A Player (advertiser or publisher) being is represented here
pub struct Player {
    /// Player ID
    pub(crate) id: String,
    /// one account can be linked to Player as Publisher or Advertiser
    pub(crate) linked_account: AccountId,
    /// Player Publisher or Advertiser type
    pub(crate) player_type: PlayerType,
    /// Player status - active or disabled
    pub(crate) status: PlayerStatus,
    /// Player balance
    pub(crate) balance: Balance,
}

impl Player {
    pub(crate) fn new(linked_account: AccountId, player_type: PlayerType) -> Self {
        Self {
            id: bs58::encode(env::sha256(&env::random_seed())).into_string(),
            linked_account,
            player_type,
            status: PlayerStatus::Disabled,
            balance: 0,
        }
    }
    pub(crate) fn activate(mut self) -> Player {
        self.status = PlayerStatus::Active;
        self
    }
    pub(crate) fn disable(mut self) -> Player {
        self.status = PlayerStatus::Disabled;
        self
    }
    pub(crate) fn add_balance(mut self, balance: Balance) -> Player {
        self.balance += balance;
        self
    }
    pub(crate) fn withdrawal_balance(mut self, balance: Balance) -> Player {
        assert!(self.balance - balance > 0);
        assert!(self.status != PlayerStatus::Disabled);
        self.balance -= balance;
        self
    }
}