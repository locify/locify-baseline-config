use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};
use near_sdk::serde::{Serialize, Deserialize};
use super::common_defaults::default_curr;

#[derive(Serialize, Deserialize, BorshDeserialize, BorshSerialize, Clone)]
#[serde(crate = "near_sdk::serde")]
pub struct Deal {
    pub id: String,
    #[serde(default = "default_bidfloor")]
    pub bidfloor: f32,
    #[serde(default = "default_curr")]
    pub bidfloorcur: String,
    pub at: Option<i32>,
    pub wseat: Option<Vec<String>>,
    pub wadomain: Option<Vec<String>>,
    //pub ext: Option<serde_json::Value>,
}

fn default_bidfloor() -> f32 {
    0.0
}
