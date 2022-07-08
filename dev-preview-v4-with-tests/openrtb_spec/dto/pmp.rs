use super::deal::Deal;
use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};
use near_sdk::serde::{Serialize, Deserialize};

#[derive(Serialize, Deserialize, BorshDeserialize, BorshSerialize, Clone)]
#[serde(crate = "near_sdk::serde")]
pub struct Pmp {
    #[serde(default = "default_private_auction")]
    pub private_auction: u8,
    pub deals: Option<Vec<Deal>>,
    //pub ext: LazyOption<serde_json::Value>,
}

fn default_private_auction() -> u8 {
    0
}
