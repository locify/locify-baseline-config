use near_sdk::{Balance, env, ext_contract, Gas, near_bindgen, PanicOnDefault, Promise, PromiseResult};
use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};
use near_sdk::collections::UnorderedMap;
use near_sdk::serde::Serialize;

near_sdk::setup_alloc!();

pub const XCC_GAS: Gas = 20000000000000;
const NO_DEPOSIT: Balance = 0;

#[derive(Debug, Serialize, BorshDeserialize, BorshSerialize)]
#[serde(crate = "near_sdk::serde")]
pub struct Channel {
    item_id: String,
    model: String,
    in_game_ad_clicks: usize,
    google_links: usize,
    pop_up_ads: usize,
    video_ads: usize,
    banner_ads: usize,
}

// define the methods we'll use on laov1
#[ext_contract(ext_oracle)]
trait ExtOracle {
    fn get_item(item_id: String) -> String;
    fn get_item_oracle() -> String;
}

// define methods we'll use as callbacks on lao_client
#[ext_contract(ext_self)]
pub trait ExtSelf {
    fn callback_oracle_result() -> String;
    fn callback_oracle_string() -> String;
}

#[near_bindgen]
#[derive(PanicOnDefault, BorshDeserialize, BorshSerialize)]
pub struct Contract {
    adv_channel: UnorderedMap<String, Channel>,
}

#[near_bindgen]
impl Contract {
    #[init]
    pub fn init() -> Self {
        Self {
            adv_channel: UnorderedMap::new(b'a')
        }
    }


    pub fn add_item(&mut self,
                    item_id: String,
                    model: String,
                    in_game_ad_clicks: usize,
                    google_links: usize,
                    pop_up_ads: usize,
                    video_ads: usize,
                    banner_ads: usize,
    ) {
        self.adv_channel.insert(&item_id.clone(), &Channel {
            item_id,
            model,
            in_game_ad_clicks,
            google_links,
            pop_up_ads,
            video_ads,
            banner_ads,
        });
    }

    pub fn get_item_result(&self, ext_contract_id: String, item_id: String) -> Promise {
        ext_oracle::get_item(item_id, &ext_contract_id.to_string(), NO_DEPOSIT, XCC_GAS).then(
            ext_self::callback_oracle_result(&env::current_account_id(), NO_DEPOSIT, XCC_GAS)
        )
    }

    pub fn get_item_string(&self, ext_contract_id: String) -> Promise {
        ext_oracle::get_item_oracle(&ext_contract_id.to_string(), NO_DEPOSIT, XCC_GAS).then(
            ext_self::callback_oracle_string(&env::current_account_id(), NO_DEPOSIT, XCC_GAS)
        )
    }

    pub fn callback_oracle_string(&self) -> String {
        assert_eq!(env::promise_results_count(), 1, "ERR_TOO_MANY_RESULTS");
        match env::promise_result(0) {
            PromiseResult::NotReady => unreachable!(),
            PromiseResult::Successful(val) => {
                String::from_utf8(val).unwrap()
            }
            PromiseResult::Failed => env::panic(b"ERR_CALL_FAILED"),
        }
    }

    pub fn callback_oracle_result(&mut self) -> String {
        assert_eq!(env::promise_results_count(), 1, "ERR_TOO_MANY_RESULTS");
        let mut adv_channel_item: String;
        match env::promise_result(0) {
            PromiseResult::NotReady => unreachable!(),
            PromiseResult::Successful(val) => {
                if let Ok(val) = String::from_utf8(val) {
                    adv_channel_item = val
                } else {
                    env::panic(b"ERR_WRONG_CHANNEL_VAL_RECEIVED")
                }
            }
            PromiseResult::Failed => env::panic(b"ERR_CALL_FAILED"),
        }
        adv_channel_item
    }
}