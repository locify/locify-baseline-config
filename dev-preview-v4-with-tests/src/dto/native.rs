use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};
use near_sdk::serde::{Serialize, Deserialize};

#[derive(Serialize, Deserialize, BorshDeserialize, BorshSerialize)]
#[serde(crate = "near_sdk::serde")]
pub struct Native {
    pub request: String,
    pub ver: Option<String>,
    pub api: Option<Vec<i32>>,
    pub battr: Option<Vec<i32>>,
    //pub ext: LazyOption<serde_json::Value>,
}
