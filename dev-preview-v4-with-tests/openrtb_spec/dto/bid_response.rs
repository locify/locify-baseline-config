use super::common_defaults::default_curr;
use super::seatbid::SeatBid;
use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};
use near_sdk::serde::{Serialize, Deserialize};
use crate::PlayerId;

#[derive(Serialize, Deserialize, BorshDeserialize, BorshSerialize, Clone)]
#[serde(crate = "near_sdk::serde")]
pub struct BidResponse {
    pub id: String,
    pub seatbid: Option<Vec<SeatBid>>,
    pub bidid: Option<String>,
    #[serde(default = "default_curr")]
    pub curr: String,
    pub customdata: Option<String>,
    pub nbr: Option<i32>,
    // TODO: implement standard, only for testing
    pub player_id: PlayerId,
    pub bid_price: u128,
    //pub ext: LazyOption<serde_json::Value>,
}
