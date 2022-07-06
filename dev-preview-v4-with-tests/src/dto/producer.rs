use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};
use near_sdk::serde::{Serialize, Deserialize};

#[derive(Serialize, Deserialize, BorshDeserialize, BorshSerialize)]
#[serde(crate = "near_sdk::serde")]
pub struct Producer {
    pub id: Option<String>,
    pub name: Option<String>,
    pub cat: Option<Vec<String>>,
    pub domain: Option<String>,
    //pub ext: LazyOption<serde_json::Value>,
}
