use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};
use near_sdk::collections::UnorderedMap;
use near_sdk::{AccountId, Balance, bs58, env, log, near_bindgen, PanicOnDefault, Promise, Timestamp};
use near_sdk::json_types::U128;
use crate::auction::Auction;
use crate::{AuctionId, PlayerId};
use crate::bid_request::BidRequest;
use crate::bid_response::BidResponse;
use crate::player::{Player, PlayerStatus, PlayerType};

const AUCTION_PERIOD: Timestamp = 1_000;

#[near_bindgen]
#[derive(BorshDeserialize, BorshSerialize, PanicOnDefault)]
/// A RTB Smart contract being is represented here
/// start documents
pub struct Contract {
    /// contract owner
    pub owner_id: AccountId,
    // store active auctions
    pub current_auctions: UnorderedMap<AuctionId, Auction>,
    // store players
    pub players: UnorderedMap<PlayerId, Player>,
}

#[near_bindgen]
impl Contract {
    /// initialization RTB smart contract
    #[init]
    pub fn new(owner_id: AccountId) -> Self {
        Self {
            owner_id,
            current_auctions: UnorderedMap::new(b"a".to_vec()),
            players: UnorderedMap::new(b"p".to_vec()),
        }
    }

    pub fn get_accounts_info(&self) -> String {
        format!("predecessor_account_id: {}, current_account: {}, signer_account_id: {}",
                // The id of the account that was the previous contract in the chain of cross-contract calls.
                // If this is the first contract, it is equal to signer_account_id.
                env::predecessor_account_id(),
                // The id of the account that owns the current contract.
                env::current_account_id(),
                // The id of the account that either signed the original transaction
                // or issued the initial cross-contract call.
                env::signer_account_id()
        )
    }

    // TODO make pagination for all players
    // TODO who can check info about all players
    /// get all players info
    pub fn get_players(&self) -> Vec<Player> {
        self.players.values().collect()
    }

    // TODO who can check info about player
    /// get player info
    pub fn get_player(&self, player_id: PlayerId) -> Option<Player> {
        log!("get player start: {}", player_id);
        if let Some(player) = self.players.get(&player_id) {
            return Some(player);
        }
        None
    }

    /// add player
    pub fn player_add(&mut self, account_id: AccountId, player_type: PlayerType) -> PlayerId {
        // TODO: check player existing
        let player = Player::new(account_id, player_type);
        self.players.insert(&player.id, &player);
        player.id
    }

    /// set player state Active, (default state - Disabled) <br> only administrator can change player state
    pub fn player_activate(&mut self, player_id: PlayerId) -> String {
        log!("activate player {}", player_id);
        if let Some(update_player) = self.players.get(&player_id) {
            self.players.insert(&player_id, &update_player.activate());
            return r#"{"status":"success"}"#.to_string();
        }
        // check predecessor_account_id for workspaces
        //if self.owner_id.as_str().eq(env::predecessor_account_id().as_str()) {}
        r#"{"status":"failure"}"#.to_string()
    }

    /// set player state Disabled, (default state - Disabled) <br> only administrator can change player state
    pub fn player_disable(&mut self, player_id: PlayerId) -> String {
        // only administrator can change player state
        if self.owner_id == env::predecessor_account_id() {
            if let Some(update_player) = self.players.get(&player_id) {
                self.players.insert(&player_id, &update_player.disable());
            }
            return r#"{"status":"success"}"#.to_string();
        }
        r#"{"status":"failure"}"#.to_string()
    }

    /// add deposit by player
    #[payable]
    pub fn add_deposit(&mut self, player_id: PlayerId) -> Option<Balance> {
        let attached_deposit = env::attached_deposit();
        if let Some(update_player) = self.players.get(&player_id) {
            // update deposit first
            self.players.insert(&player_id, &update_player.add_balance(attached_deposit));
            // check deposit update
            if let Some(player) = self.players.get(&player_id) {
                return Some(player.balance);
            }
            return None;
        }
        None
    }

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

    pub fn get_auctions(&self) -> Vec<Auction> {
        self.current_auctions.values().collect()
    }

    // TODO: how to start auction automatically or approve every time
    /// start auction<br>only publisher can start auction
    pub fn start_auction(&mut self, bid_request: BidRequest) -> AuctionId {
        // check only publisher can start auction
        let auction_id = bs58::encode(env::sha256(&env::random_seed())).into_string();

        // if self.players.keys().any(|x| x == env::predecessor_account_id().to_string()) {}
        let bid_responses: Vec<BidResponse> = vec![];
        // TODO: you should operate only integer values or change parse method
        self.current_auctions.insert(&auction_id, &Auction {
            auction_id: auction_id.clone(),
            winner: None,
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