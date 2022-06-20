mod auction;
mod dto;
mod sample_ortb_res;
mod sample_ortb_req;

use std::str::FromStr;
use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};
use near_sdk::collections::{LazyOption, UnorderedMap, Vector};
use near_sdk::{AccountId, env, near_bindgen, PanicOnDefault, serde_json, Timestamp};
use crate::auction::Auction;
use crate::dto::bid_request::BidRequest;
use crate::dto::bid_response::BidResponse;

pub type AuctionId = String;

const AUCTION_PERIOD: Timestamp = 5_000;

#[near_bindgen]
#[derive(BorshDeserialize, BorshSerialize, PanicOnDefault)]
pub struct Contract {
    pub owner_id: AccountId,
    last_auction_id: AuctionId,
    current_auction: LazyOption<Auction>,
    players: UnorderedMap<AccountId, bool>,
    auctions_archive: UnorderedMap<AuctionId, Auction>,
}

#[near_bindgen]
impl Contract {
    #[init]
    pub fn new(owner_id: AccountId) -> Self {
        Self {
            owner_id,
            last_auction_id: "".to_string(),
            current_auction: LazyOption::new(b"l", None),
            players: UnorderedMap::new(b"p".to_vec()),
            auctions_archive: UnorderedMap::new(b"a".to_vec()),
        }
    }

    pub fn get_current(&self) -> String {
        "current".into()
    }

    pub fn start_auction(&mut self, bid_req: String) {
        let bid_request: BidRequest = serde_json::from_str(bid_req.as_str()).unwrap();
        let auction_id = u128::from_str(self.last_auction_id.as_str()).unwrap() + 1;
        self.last_auction_id = auction_id.to_string();
        // bidfloor - BidRequest::Imp - optional, default 0
        let players: Vector<AccountId> = Vector::new(b"p");
        let bid_responses: UnorderedMap<AccountId, BidResponse> = UnorderedMap::new(b"br".to_vec());
        let auction = Auction {
            auction_id: auction_id.to_string(),
            winner: None,
            sell_price: 0,
            highest_bid: 0,
            description: "".to_string(),
            start_at: env::block_timestamp_ms(),
            end_at: env::block_timestamp_ms() + AUCTION_PERIOD,
            bid_request,
            bid_responses,
            players,
        };
        self.current_auction = LazyOption::new(b"l", Some(&auction));
    }
    // update player state or create new player if not existing
    pub fn player_add(&mut self, player: AccountId) {
        self.players.insert(&player, &true);
    }
    pub fn player_remove(&mut self, player: AccountId) {
        // disable player
        self.players.insert(&player, &false);
    }
}
