use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};
use near_sdk::serde::{Serialize, Deserialize};

#[derive(Debug, Serialize, Deserialize, BorshDeserialize, BorshSerialize)]
#[serde(crate = "near_sdk::serde")]
pub struct Banner {
    w: usize,
    h: usize,
    pos: usize,
    battr: Vec<usize>,
    api: Vec<usize>,
    topframe: usize,
}