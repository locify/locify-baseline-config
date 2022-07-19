use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};
use near_sdk::{Balance, PanicOnDefault, Timestamp};
use near_sdk::serde::{Serialize, Deserialize};
use crate::{AuctionId, PlayerId};
use crate::bid_request::BidRequest;
use crate::bid_response::BidResponse;

#[derive(Serialize, Deserialize, BorshDeserialize, BorshSerialize, PanicOnDefault, Clone)]
#[serde(crate = "near_sdk::serde")]
pub struct Auction {
    pub(crate) auction_id: AuctionId,
    pub(crate) winner: PlayerId,
    pub(crate) highest_bid: u128,
    pub(crate) start_at: Timestamp,
    pub(crate) end_at: Timestamp,
    pub(crate) bid_request: BidRequest,
    pub(crate) bid_responses: Vec<BidResponse>,
    pub(crate) deposits: Balance,
}

impl Auction {
    pub(crate) fn add_bid_response(mut self, bid_response: BidResponse) -> Auction {
        self.bid_responses.push(bid_response);
        self
    }

    pub(crate) fn set_winner(mut self) -> Auction {
        let mut max_bid = 0;
        for bid in &self.bid_responses {
            // TODO: you should operate only integer values or change parse method
            let bid_price = bid.seatbid[0].bid[0].price.parse::<u128>().unwrap();
            if bid_price > max_bid {
                self.winner = bid.seatbid[0].seat.clone();
                self.highest_bid = bid_price;
                max_bid = bid_price;
            }
        }
        self
    }
}