use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};
use near_sdk::serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, BorshDeserialize, BorshSerialize, Clone)]
#[serde(crate = "near_sdk::serde")]
pub struct Segment {
    pub id: Option<String>,
    pub name: Option<String>,
    pub value: Option<String>,
    //pub ext: Option<serde_json::Value>,
}
