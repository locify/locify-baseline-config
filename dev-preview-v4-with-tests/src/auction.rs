use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};
use near_sdk::{PanicOnDefault, Timestamp};
use near_sdk::serde::{Serialize, Deserialize};
use crate::{AuctionId, PlayerId};
use crate::bid_request::BidRequest;
use crate::bid_response::BidResponse;

#[derive(Serialize, Deserialize, BorshDeserialize, BorshSerialize, PanicOnDefault)]
#[serde(crate = "near_sdk::serde")]
pub struct Auction {
    pub(crate) auction_id: AuctionId,
    pub(crate) winner: Option<PlayerId>,
    pub(crate) sell_price: u128,
    pub(crate) highest_bid: u128,
    pub(crate) start_at: Timestamp,
    pub(crate) end_at: Timestamp,
    pub(crate) bid_request: BidRequest,
    pub(crate) bid_responses: Vec<BidResponse>,
}

impl Auction {
    pub(crate) fn add_bid_response(mut self, bid_response: BidResponse) -> Auction {
        self.bid_responses.push(bid_response);
        self
    }
}