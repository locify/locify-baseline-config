mod auction;
mod dto;
mod sample_ortb_res;
mod sample_ortb_req;
mod player;

use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};
use near_sdk::collections::{LazyOption, UnorderedMap, Vector};
use near_sdk::{AccountId, Balance, bs58, env, near_bindgen, PanicOnDefault, serde_json, Timestamp};
use crate::auction::Auction;
use crate::dto::bid_request::BidRequest;
use crate::dto::bid_response::BidResponse;
use crate::player::{Player, PlayerStatus, PlayerType};

pub type AuctionId = String;
pub type PlayerId = String;

const AUCTION_PERIOD: Timestamp = 5_000;


#[near_bindgen]
#[derive(BorshDeserialize, BorshSerialize, PanicOnDefault)]
/// A RTB Smart contract being is represented here
/// start documents
pub struct Contract {
    /// contract owner AccountId
    pub owner_id: AccountId,
    /// set last history auction state
    pub last_auction_state: Option<Auction>,
    /// current active auctions
    pub current_auctions: UnorderedMap<AuctionId, Auction>,
    /// players store
    pub players: UnorderedMap<PlayerId, Player>,
}

#[near_bindgen]
impl Contract {
    /// initialization RTB smart contract
    #[init]
    pub fn new(owner_id: AccountId) -> Self {
        Self {
            owner_id,
            last_auction_state: None,
            current_auctions: UnorderedMap::new(b"a".to_vec()),
            players: UnorderedMap::new(b"p".to_vec()),
        }
    }

    /// start auction
    pub fn start_auction(&mut self, bid_req: String) {
        let bid_request: BidRequest = serde_json::from_str(bid_req.as_str()).unwrap();
        let auction_id = bs58::encode(env::sha256(&env::random_seed())).into_string();

        let bid_responses: UnorderedMap<Player, BidResponse> = UnorderedMap::new(b"br".to_vec());
        self.current_auctions.insert(&auction_id.clone(), &Auction {
            auction_id,
            winner: None,
            sell_price: 0,
            highest_bid: 0,
            description: "".to_string(),
            start_at: env::block_timestamp_ms(),
            end_at: env::block_timestamp_ms() + AUCTION_PERIOD,
            bid_request,
            bid_responses,
        });
    }

    /// add player
    pub fn player_add(&mut self, account_id: AccountId, player_type: PlayerType) -> PlayerId {
        // TODO: check player existing
        let player = Player::new(account_id, player_type);
        self.players.insert(&player.id, &player);
        player.id
    }
    pub fn player_activate(&mut self, player_id: PlayerId) -> String {
        // only administrator can change player state
        if self.owner_id == env::predecessor_account_id() {
            if let Some(update_player) = self.players.get(&player_id) {
                self.players.insert(&player_id, &update_player.activate());
            }
            return r#"{"status":"success"}"#.to_string();
        }
        r#"{"status":"failure"}"#.to_string()
    }
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

    pub fn get_players(&self) -> Vec<Player> {
        self.players.values().collect()
    }

    pub fn get_player(&self, player_id: PlayerId) -> Option<Player> {
        if let Some(player) = self.players.get(&player_id) {
            return Some(player);
        }
        None
    }

    pub fn add_deposit(&mut self, player_id: PlayerId, balance: Balance) -> Option<Balance> {
        if let Some(update_player) = self.players.get(&player_id) {
            // update deposit first
            self.players.insert(&player_id, &update_player.add_balance(balance));
            // check deposit update
            if let Some(player) = self.players.get(&player_id) {
                return Some(player.balance);
            }
            return None;
        }
        None
    }
    pub fn withdrawal_deposit(&mut self, player_id: PlayerId, balance: Balance) -> Option<Balance> {
        if player_id == env::predecessor_account_id().as_str() {
            if let Some(update_player) = self.players.get(&player_id) {
                if update_player.status != PlayerStatus::Disabled
                    && update_player.balance - balance > 0 {
                    self.players.insert(&player_id, &update_player.withdrawal_balance(balance));
                } else {
                    return None;
                }
            }
        }
        None
    }
    // get all players deposit
    pub fn get_deposit(&self) -> Option<Balance> {
        // only administrator can view deposit
        if self.owner_id == env::predecessor_account_id() {
            return Some(self.players.values().map(|x| x.balance).sum());
        }
        None
    }
}

#[cfg(all(test, not(target_arch = "wasm32")))]
mod tests {
    use super::*;
    use near_sdk::test_utils::VMContextBuilder;
    use near_sdk::{log, testing_env, VMContext};

    // `FromStr` conversion
    // let alice: AccountId = "alice.near".parse().unwrap();
    // assert!("invalid.".parse::<AccountId>().is_err());

    fn get_context(is_view: bool) -> VMContext {
        VMContextBuilder::new()
            .signer_account_id("bob.near".parse::<AccountId>().unwrap())
            .is_view(is_view)
            .build()
    }

    #[test]
    fn default_test() {
        let context = get_context(false);
        testing_env!(context);
        let contract = Contract::new(env::current_account_id());
        /*let res = contract.get_current();
        log!("res: {}", res);
        assert_eq!(
            res,
            "current".to_string()
        )*/
    }

    #[test]
    fn add_player() {
        let alice: AccountId = "alice.near".parse().unwrap();
        let bob: AccountId = "bob.near".parse().unwrap();
        let context = get_context(false);
        testing_env!(context);
        let mut contract = Contract::new(env::current_account_id());
        contract.player_add(alice, PlayerType::Publisher);
        contract.player_add(bob, PlayerType::Advertiser);
        /*assert_eq!(
            res,
            "current".to_string()
        )*/
    }
}