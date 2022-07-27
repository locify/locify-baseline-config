use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};
use near_sdk::{Balance, PanicOnDefault, Timestamp, near_bindgen, env, Promise, log, bs58};
use near_sdk::json_types::U128;
use near_sdk::serde::{Serialize, Deserialize};
use crate::{AUCTION_PERIOD, AuctionId, Contract, PlayerId, PlayerStatus};
use crate::bid_request::BidRequest;
use crate::bid_response::BidResponse;

use crate::ContractExt;

#[derive(Serialize, Deserialize, BorshDeserialize, BorshSerialize, PanicOnDefault, Clone)]
#[serde(crate = "near_sdk::serde")]
pub struct Auction {
    pub(crate) auction_id: AuctionId,
    pub(crate) limited_participate: Vec<PlayerId>,
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

#[near_bindgen]
impl Contract {
    // TODO add error description
    /// withdrawal deposit by player
    pub fn withdrawal_deposit(&mut self, player_id: PlayerId, amount: U128) {
        let amount = amount.into();
        if let Some(update_player) = self.players.get(&player_id) {
            if update_player.status != PlayerStatus::Disabled
                && update_player.balance - amount > 0 {
                let linked_account = update_player.linked_account.clone();
                self.players.insert(&player_id, &update_player.withdrawal_balance(amount));
                Promise::new(linked_account).transfer(amount);
            }
        }
    }

    /// view all auctions state
    pub fn view_auctions(&self, player_id: PlayerId) -> Vec<Auction> {
        let public_auctions: Vec<Auction> = self.current_auctions.values()
            .filter(|auction| auction.limited_participate.is_empty())
            .collect();
        let private_auctions: Vec<Auction> = self.current_auctions.values()
            .filter(|auction| auction.limited_participate.contains(&player_id))
            .collect();
        [public_auctions, private_auctions].concat()
    }

    /// view all auctions state
    pub fn view_auction_by_id(&self, auction_id: AuctionId) -> Option<Auction> {
        if self.current_auctions.is_empty() {
            log!("auctions is empty");
            return None;
        }
        if let Some(auction) = self.current_auctions.get(&auction_id) {
            return Some(auction);
        }
        None
    }
    // change all auctions state - clear
    pub fn clear_auctions(&mut self) { self.current_auctions.clear() }

    // TODO: how to start auction automatically or approve every time
    /// start auction<br>only publisher can start auction
    /// open auction - if limited_member is empty
    /// private auction - if limited_member is not empty
    pub fn start_auction(&mut self, bid_request: BidRequest, limited_participate: Vec<PlayerId>) -> AuctionId {
        // check only publisher can start auction
        let auction_id = bs58::encode(env::sha256(&env::random_seed())).into_string();

        // if self.players.keys().any(|x| x == env::predecessor_account_id().to_string()) {}
        let bid_responses: Vec<BidResponse> = vec![];
        // TODO: you should operate only integer values or change parse method
        self.current_auctions.insert(&auction_id, &Auction {
            auction_id: auction_id.clone(),
            limited_participate,
            winner: "?".to_string(),
            highest_bid: 0,
            start_at: env::block_timestamp_ms(),
            end_at: env::block_timestamp_ms() + AUCTION_PERIOD,
            bid_request,
            bid_responses,
            deposits: 0,
        });
        auction_id
    }

    pub fn add_player_bid(&mut self, auction_id: AuctionId, bid_response: BidResponse) {
        if let Some(update_auction) = self.current_auctions.get(&auction_id) {
            let player_id = bid_response.seatbid[0].seat.clone();
            // TODO bid only integer value
            let bid = bid_response.seatbid[0].bid[0].price.parse::<u128>().unwrap();
            // check player existing
            if let Some(update_player) = self.players.get(&player_id) {
                // check player balance
                if update_player.is_enough_balance(bid) {
                    // update player state/stakes
                    self.players.insert(&player_id, &update_player.add_stake(bid));
                    // update auction state
                    self.current_auctions.insert(&auction_id, &update_auction.add_bid_response(bid_response));
                }
            }
        }
    }

    /// return only state for finished auction<br>for all history use [near-lake-indexer](https://github.com/near/near-lake-indexer)
    pub fn check_auction_state(&self) -> Vec<Auction> {
        let current_time = env::block_timestamp_ms();
        let finish_auction: Vec<Auction> = self.current_auctions.values()
            .filter(|x| x.end_at <= current_time)
            .collect();
        let mut auctions: Vec<Auction> = vec![];
        for auction in finish_auction {
            auctions.push(auction.set_winner());
        }
        auctions
    }
}