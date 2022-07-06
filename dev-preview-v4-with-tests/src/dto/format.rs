use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};
use near_sdk::serde::{Serialize, Deserialize};

#[derive(Serialize, Deserialize, BorshDeserialize, BorshSerialize)]
#[serde(crate = "near_sdk::serde")]
pub struct Format {
    pub w: Option<i32>,
    pub h: Option<i32>,
    pub wratio: Option<i32>,
    pub hratio: Option<i32>,
    pub wmin: Option<i32>,
    //pub ext: Option<serde_json::Value>,
}
