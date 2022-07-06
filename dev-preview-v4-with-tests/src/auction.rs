use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};
use near_sdk::{AccountId, PanicOnDefault, Timestamp};
use near_sdk::collections::{UnorderedMap, Vector};
use crate::{AuctionId, BidRequest, Player};
use crate::dto::bid_response::BidResponse;

#[derive(BorshDeserialize, BorshSerialize, PanicOnDefault)]
pub struct Auction {
    pub(crate) auction_id: AuctionId,
    pub(crate) winner: Option<Player>,
    pub(crate) sell_price: u128,
    pub(crate) highest_bid: u128,
    pub(crate) description: String,
    pub(crate) start_at: Timestamp,
    pub(crate) end_at: Timestamp,
    pub(crate) bid_request: BidRequest,
    pub(crate) bid_responses: UnorderedMap<Player, BidResponse>,
}