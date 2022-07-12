use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};
use near_sdk::serde::{Serialize, Deserialize};

#[derive(Debug, Serialize, Deserialize, BorshDeserialize, BorshSerialize, Clone)]
#[serde(crate = "near_sdk::serde")]
pub struct Bid {
    pub id: String,
    pub impid: String,
    // bid price
    pub price: String,
    pub adid: String,
    pub cid: String,
    pub crid: String,
    pub w: String,
    pub h: String,
}
