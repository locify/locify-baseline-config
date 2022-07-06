use super::common_defaults::default_curr;
use super::seatbid::SeatBid;
use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};
use near_sdk::serde::{Serialize, Deserialize};

#[derive(Serialize, Deserialize, BorshDeserialize, BorshSerialize)]
#[serde(crate = "near_sdk::serde")]
pub struct BidResponse {
    pub id: String,
    pub seatbid: Option<Vec<SeatBid>>,
    pub bidid: Option<String>,
    #[serde(default = "default_curr")]
    pub curr: String,
    pub customdata: Option<String>,
    pub nbr: Option<i32>,
    //pub ext: LazyOption<serde_json::Value>,
}
