use super::segment::Segment;
use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};
use near_sdk::serde::{Serialize, Deserialize};

#[derive(Serialize, Deserialize, BorshDeserialize, BorshSerialize)]
#[serde(crate = "near_sdk::serde")]
pub struct Data {
    pub id: Option<String>,
    pub name: Option<String>,
    pub segment: Option<Vec<Segment>>,
    //pub ext: LazyOption<serde_json::Value>,
}
