use near_sdk::{near_bindgen, PanicOnDefault, serde_json};
use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};
use near_sdk::collections::UnorderedMap;
use near_sdk::serde::Serialize;

near_sdk::setup_alloc!();

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

    pub fn get_item(&self, item_id: String) -> String {
        match self.adv_channel.get(&item_id) {
            Some(val) => {
                serde_json::to_string(&val).unwrap()
            }
            None => "not found".to_string()
        }
    }

    pub fn all_keys(&self) -> String {
        let all_keys = self.adv_channel.keys_as_vector();
        let mut res_string: String = "".into();
        for k in all_keys.iter() {
            let res_key = format!("{};", k);
            res_string.push_str(&res_key);
        }
        res_string
    }

    pub fn get_item_oracle(&self) -> String {
        "item oracle success".to_string()
    }
}