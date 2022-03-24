use near_sdk::{AccountId, env, near_bindgen, PanicOnDefault, Promise, PromiseResult, serde_json};
use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};
use near_sdk::collections::UnorderedMap;
use near_sdk::json_types::ValidAccountId;
use near_sdk::serde::Serialize;

const MIN_ATTACHED_DEPOSIT: u128 = 100_000_000_000_000_000_000_000;

#[derive(Debug, Serialize, BorshDeserialize, BorshSerialize)]
#[serde(crate = "near_sdk::serde")]
pub struct Banner {
    account: AccountId,
    banner_uuid: String,
    is_active: String,
    media_url: String,
    banner_subscription_charge: String,
    banner_page_url: String,
    banner_width: String,
    banner_height: String,
}

#[derive(Debug, Serialize, BorshDeserialize, BorshSerialize)]
#[serde(crate = "near_sdk::serde")]
pub struct Adv {
    account: AccountId,
    adv_uuid: String,
    is_active: String,
    banner_uuid: String,
    adv_image_url: String,
    adv_forwarding_url: String,
    remaining_hit_count: String,
}

#[near_bindgen]
#[derive(PanicOnDefault, BorshDeserialize, BorshSerialize)]
pub struct Contract {
    pub owner_id: AccountId,
    banner: UnorderedMap<String, Banner>,
    adv: UnorderedMap<String, Adv>,
}

#[near_bindgen]
impl Contract {
    #[init]
    pub fn init(owner_id: ValidAccountId) -> Self {
        assert!(!env::state_exists(), "Already initialized");
        Self {
            owner_id: owner_id.into(),
            adv: UnorderedMap::new(b'a'),
            banner: UnorderedMap::new(b'b'),
        }
    }

    pub fn add_banner(&mut self,
                      banner_uuid: String,
                      media_url: String,
                      banner_page_url: String,
                      banner_width: String,
                      banner_height: String,
                      banner_subscription_charge: String,
    ) {
        let new_banner = Banner {
            account: env::signer_account_id(),
            banner_uuid: banner_uuid.clone(),
            media_url,
            is_active: "true".to_string(),
            banner_subscription_charge,
            banner_page_url,
            banner_width,
            banner_height,
        };
        self.banner.insert(&banner_uuid, &new_banner);
    }

    #[payable]
    pub fn add_adv(&mut self,
                   adv_uuid: String,
                   banner_uuid: String,
                   adv_image_url: String,
                   adv_forwarding_url: String,
    ) {
        let deposit = env::attached_deposit();
        assert!(deposit >= MIN_ATTACHED_DEPOSIT, "Must attach at least 0.1 NEAR as deposit");
        // pay seller and remove sale
        Promise::new(self.owner_id.clone()).transfer(deposit);
        let new_adv = Adv {
            account: env::signer_account_id(),
            adv_uuid: adv_uuid.clone(),
            is_active: "true".to_string(),
            banner_uuid,
            adv_image_url,
            adv_forwarding_url,
            remaining_hit_count: "10".to_string(),
        };
        env::log(env::signer_account_id().as_bytes());
        self.adv.insert(&adv_uuid, &new_adv);
    }

    pub fn all_advs(&self) -> String {
        let advs = self.adv.values_as_vector().to_vec();
        //let account_id = env::signer_account_id();
        //env::log(env::signer_account_id().as_bytes());
        let mut res_string = "".to_string();
        //let res = advs.into_iter().filter(|b| b.account == account_id).collect::<Vec<Adv>>();
        for item in advs {
            res_string.push_str(&serde_json::to_string(&item).unwrap());
        }
        res_string
    }

    pub fn get_adv(&self, adv_uuid: String) -> String {
        match self.adv.get(&adv_uuid) {
            Some(adv) => serde_json::to_string(&adv).unwrap(),
            None => "".to_string()
        }
    }

    pub fn get_adv_by_banner(&self, banner_uuid: String) -> String {
        let advs = self.adv.values_as_vector().to_vec();
        let mut res_string = "".to_string();
        let advs = advs.into_iter().filter(|b| b.banner_uuid == banner_uuid).collect::<Vec<Adv>>();
        for item in advs {
            res_string.push_str(&serde_json::to_string(&item).unwrap());
        }
        res_string
    }

    pub fn get_banner(&self, banner_uuid: String) -> String {
        match self.banner.get(&banner_uuid) {
            Some(banner) => serde_json::to_string(&banner).unwrap(),
            None => "".to_string()
        }
    }

    pub fn all_banner(&self) -> String {
        let banners = self.banner.values_as_vector().to_vec();
        let account_id = env::current_account_id();
        let mut res_string = "".to_string();
        //let res = banners.into_iter().filter(|b| b.account == account_id).collect::<Vec<Banner>>();
        for item in banners {
            res_string.push_str(&serde_json::to_string(&item).unwrap());
        }
        res_string
    }

    pub fn on_view(self, adv_id: String) -> String {
        /*if let Some(adv) = self.adv.get(&adv_id) {
            let j = serde_json::to_string(&AdvView {
                banner_page_url: adv.banner_page_url,
                banner_width: adv.banner_width,
                banner_height: adv.banner_height,
                banner_subscription_charge: adv.banner_subscription_charge,
                adv_image_url: adv.adv_image_url,
                adv_forwarding_url: adv.adv_forwarding_url,
                remainging_hit_count: adv.remaining_hit_count,
            }).unwrap();
            return j;
        }*/
        String::from("not-found")
    }

    pub fn on_adv_click(&mut self, adv_id: String) {
        let update_adv = self.adv.get(&adv_id);
        if let Some(mut adv) = update_adv {
            let hit_count = adv.remaining_hit_count.parse::<i32>().unwrap();
            if hit_count > 0 {
                adv.remaining_hit_count = (hit_count - 1).to_string();
                self.adv.insert(&adv_id, &adv);
            }
        }
    }
}