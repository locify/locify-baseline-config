use super::bid::Bid;
use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};
use near_sdk::serde::{Serialize, Deserialize};

#[derive(Serialize, Deserialize, BorshDeserialize, BorshSerialize)]
#[serde(crate = "near_sdk::serde")]
pub struct SeatBid {
    pub bid: Vec<Bid>,
    pub seat: Option<String>,
    #[serde(default = "default_group")]
    pub group: u8,
    //pub ext: LazyOption<serde_json::Value>,
}

fn default_group() -> u8 {
    0
}
