use super::banner::Banner;
use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};
use near_sdk::serde::{Serialize, Deserialize};

#[derive(Serialize, Deserialize, BorshDeserialize, BorshSerialize)]
#[serde(crate = "near_sdk::serde")]
pub struct Audio {
    pub mimes: Vec<String>,
    pub minduration: Option<i32>,
    pub maxduration: Option<i32>,
    pub protocols: Option<Vec<i32>>,
    pub startdelay: Option<i32>,
    pub sequence: Option<i32>,
    pub battr: Option<Vec<i32>>,
    pub maxextended: Option<i32>,
    pub minbitrate: Option<i32>,
    pub maxbitrate: Option<i32>,
    pub delivery: Option<Vec<i32>>,
    pub companionad: Option<Vec<Banner>>,
    pub api: Option<Vec<i32>>,
    pub companiontype: Option<Vec<i32>>,
    pub maxseq: Option<i32>,
    pub feed: Option<i32>,
    pub stitched: Option<i32>,
    pub nvol: Option<i32>,
    //pub ext: Option<serde_json::Value>,
}
