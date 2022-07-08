use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};
use near_sdk::serde::{Serialize, Deserialize};

#[derive(Serialize, Deserialize, BorshDeserialize, BorshSerialize, Clone)]
#[serde(crate = "near_sdk::serde")]
pub struct Source {
    pub fd: Option<u8>,
    pub tid: Option<String>,
    pub pchain: Option<String>,
    //pub ext: Option<serde_json::Value>,
}
