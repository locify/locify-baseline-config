use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};
use near_sdk::serde::{Serialize, Deserialize};

#[derive(Serialize, Deserialize, BorshDeserialize, BorshSerialize, Clone)]
#[serde(crate = "near_sdk::serde")]
pub struct Publisher {
    pub id: Option<String>,
    pub name: Option<String>,
    pub cat: Option<Vec<String>>,
    pub domain: Option<String>,
    //pub ext: Option<serde_json::Value>,
}
