use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};
use near_sdk::serde::{Serialize, Deserialize};
use crate::dto::seat_bid::SeatBid;

#[derive(Debug, Serialize, Deserialize, BorshDeserialize, BorshSerialize, Clone)]
#[serde(crate = "near_sdk::serde")]
pub struct BidResponse {
    pub id: String,
    pub cur: String,
    pub seatbid: Vec<SeatBid>,
}