use near_sdk::{AccountId, Balance, bs58, env, log, near_bindgen, Promise};
use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};
use near_sdk::serde::{Serialize, Deserialize};
use crate::{Contract, PlayerId};
use crate::ContractExt;


#[derive(Clone, Serialize, Deserialize, BorshDeserialize, BorshSerialize, PartialEq)]
#[serde(crate = "near_sdk::serde")]
/// A Player status active or disabled
pub enum PlayerStatus {
    Active,
    Disabled,
}

#[derive(Clone, Serialize, Deserialize, BorshDeserialize, BorshSerialize, PartialEq)]
#[serde(crate = "near_sdk::serde")]
/// A Player type publisher or advertiser
pub enum PlayerType {
    Advertiser,
    Publisher,
}

#[derive(Clone, Serialize, Deserialize, BorshDeserialize, BorshSerialize)]
#[serde(crate = "near_sdk::serde")]
/// A Player (advertiser or publisher) being is represented here
pub struct Player {
    /// Player ID
    pub(crate) id: String,
    /// one account can be linked to Player as Publisher or Advertiser
    pub(crate) linked_account: AccountId,
    /// Player Publisher or Advertiser type
    pub(crate) player_type: PlayerType,
    /// Player status - active or disabled
    pub(crate) status: PlayerStatus,
    /// Player balance
    pub(crate) balance: Balance,
    /// Player balance under stakes
    pub(crate) stakes: Balance,
}

impl Player {
    pub(crate) fn new(linked_account: AccountId, player_type: PlayerType) -> Self {
        Self {
            id: bs58::encode(env::sha256(&env::random_seed())).into_string(),
            linked_account,
            player_type,
            status: PlayerStatus::Disabled,
            balance: 0,
            stakes: 0,
        }
    }
    pub(crate) fn activate(mut self) -> Player {
        self.status = PlayerStatus::Active;
        self
    }
    pub(crate) fn disable(mut self) -> Player {
        self.status = PlayerStatus::Disabled;
        self
    }
    pub(crate) fn add_balance(mut self, balance: Balance) -> Player {
        self.balance += balance;
        self
    }
    pub(crate) fn withdrawal_balance(mut self, balance: Balance) -> Player {
        assert!(self.balance - balance > 0);
        assert!(self.status != PlayerStatus::Disabled);
        self.balance -= balance;
        self
    }
    pub(crate) fn is_enough_balance(&self, amount: Balance) -> bool {
        self.balance > self.stakes + amount
    }
    pub(crate) fn add_stake(mut self, amount: Balance) -> Player {
        self.stakes += amount;
        self
    }
}

#[near_bindgen]
impl Contract {
    /// clear all players
    pub fn clear_players(&mut self) { self.players.clear(); }

    // TODO make pagination for all players
    // TODO who can check info about all players
    /// get all players info
    pub fn view_players(&self) -> Vec<Player> {
        self.players.values().collect()
    }

    // TODO who can check info about player
    /// get player info by player_id
    pub fn view_player_by_id(&self, player_id: PlayerId) -> Option<Player> {
        log!("get player start: {}", player_id);
        if let Some(player) = self.players.get(&player_id) {
            return Some(player);
        }
        None
    }


    /// view player info by account_id
    pub fn view_player_by_account(&self, account_id: AccountId) -> Option<Player> {
        if self.players.is_empty() {
            log!("players vector is empty");
            return None;
        }
        let players: Vec<Player> = self.players.values()
            .filter(|player| player.linked_account == account_id)
            .collect();

        if players.len() == 1 {
            return Some(players[0].clone());
        }
        log!("error get player by account: {} len: {}", account_id, players.len());
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
            Promise::new(env::current_account_id()).transfer(attached_deposit);
            self.players.insert(&player_id, &update_player.add_balance(attached_deposit));
            // check deposit update
            if let Some(player) = self.players.get(&player_id) {
                return Some(player.balance);
            }
            return None;
        }
        None
    }
}