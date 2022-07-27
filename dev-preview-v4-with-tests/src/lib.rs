use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};
use near_sdk::collections::UnorderedMap;
use near_sdk::{AccountId, assert_self, env, near_bindgen, PanicOnDefault, Timestamp};
use crate::auction::Auction;
use crate::player::{Player, PlayerStatus};

mod auction;
mod player;
mod dto;
mod bid_request;
mod bid_response;

type AuctionId = String;

type PlayerId = String;

const AUCTION_PERIOD: Timestamp = 180_000; // 180 - 3 min

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
    pub fn init(owner_id: AccountId) -> Self {
        // Assert that predecessor_account_id == current_account_id,
        // meaning contract called itself.
        assert_self();
        Self {
            owner_id,
            current_auctions: UnorderedMap::new(b"a".to_vec()),
            players: UnorderedMap::new(b"p".to_vec()),
        }
    }
}

#[cfg(all(test, not(target_arch = "wasm32")))]
mod tests {
    use near_sdk::test_utils::{accounts, VMContextBuilder};
    use near_sdk::MockedBlockchain;
    use near_sdk::{testing_env, Balance};
    use crate::player::PlayerType;

    use super::*;

    fn get_context(predecessor_account_id: AccountId) -> VMContextBuilder {
        let mut builder = VMContextBuilder::new();
        builder
            .current_account_id(accounts(1))
            .signer_account_id(predecessor_account_id.clone())
            .predecessor_account_id(predecessor_account_id);
        builder
    }

    #[test]
    fn test_init() {
        let mut context = get_context(accounts(1));
        testing_env!(context.build());
        let contract = Contract::init(accounts(1));
        testing_env!(context.is_view(true).build());
        assert_eq!(contract.view_players().len(), 0);
    }

    #[test]
    #[should_panic(expected = "The contract is not initialized")]
    fn test_default() {
        let context = get_context(accounts(1));
        testing_env!(context.build());
        let _contract = Contract::default();
    }

    #[test]
    fn test_add_publisher() {
        let mut context = get_context(accounts(1));
        testing_env!(context.build());
        let mut contract = Contract::init(accounts(1));
        testing_env!(context
            .storage_usage(env::storage_usage())
            .predecessor_account_id(accounts(2))
            .build());
        let player_id = contract.player_add(accounts(2), PlayerType::Publisher);
        assert_ne!(player_id.len(), 0);
        testing_env!(context
            .storage_usage(env::storage_usage())
            .predecessor_account_id(accounts(1))
            .build());
        contract.player_activate(player_id);
    }

    #[test]
    fn test_activate_publisher() {
        let mut context = get_context(accounts(1));
        testing_env!(context.build());
        let contract = Contract::init(accounts(1));
        assert_eq!(contract.view_players().len(), 0);
    }

    #[test]
    fn test_add_advertiser() {
        let context = get_context(accounts(1));
        testing_env!(context.build());
        let mut contract = Contract::init(accounts(1));
        let player_id = contract.player_add(accounts(2), PlayerType::Advertiser);
        assert_ne!(player_id, "");
    }

    #[test]
    fn test_activate_advertiser() {
        let mut context = get_context(accounts(1));
        testing_env!(context.build());
        let contract = Contract::init(accounts(1));
        testing_env!(context.is_view(true).build());
        assert_eq!(contract.view_players().len(), 0);
    }
}