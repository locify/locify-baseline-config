use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};
use near_sdk::serde::{Serialize, Deserialize};

#[derive(Serialize, Deserialize, BorshDeserialize, BorshSerialize)]
#[serde(crate = "near_sdk::serde")]
pub struct Metric {
    #[serde(rename = "type")]
    pub _type: String,
    pub value: f32,
    pub vendor: Option<String>,
    //pub ext: LazyOption<serde_json::Value>,
}
