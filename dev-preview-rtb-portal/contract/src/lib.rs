use near_sdk::{AccountId, Balance, env, near_bindgen, PanicOnDefault, Promise, serde_json};
use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};
use near_sdk::collections::UnorderedMap;
use near_sdk::json_types::ValidAccountId;
use near_sdk::serde::{Serialize, Deserialize};

const MIN_ATTACHED_DEPOSIT: u128 = 100_000_000_000_000_000_000_000;

near_sdk::setup_alloc!();

// **************************************
#[derive(Debug, Serialize, Deserialize, BorshDeserialize, BorshSerialize)]
#[serde(crate = "near_sdk::serde")]
pub struct Banner {
    w: usize,
    h: usize,
    pos: usize,
    battr: Vec<usize>,
    api: Vec<usize>,
    topframe: usize,
}

#[derive(Debug, Serialize, Deserialize, BorshDeserialize, BorshSerialize)]
#[serde(crate = "near_sdk::serde")]
pub struct Imp {
    id: String,
    tagid: String,
    iframebuster: Vec<String>,
    banner: Banner,
}
// **************************************

#[derive(Debug, Serialize, Deserialize, BorshDeserialize, BorshSerialize)]
#[serde(crate = "near_sdk::serde")]
pub struct Publisher {
    id: String,
}

#[derive(Debug, Serialize, Deserialize, BorshDeserialize, BorshSerialize)]
#[serde(crate = "near_sdk::serde")]
pub struct Ext {
    storerating: usize,
    appstoreid: String,
}

#[derive(Debug, Serialize, Deserialize, BorshDeserialize, BorshSerialize)]
#[serde(crate = "near_sdk::serde")]
pub struct App {
    id: String,
    cat: Vec<String>,
    name: String,
    domain: String,
    privacypolicy: usize,
    publisher: Publisher,
    ext: Ext,
}

// **************************************
#[derive(Debug, Serialize, Deserialize, BorshDeserialize, BorshSerialize)]
#[serde(crate = "near_sdk::serde")]
pub struct ExtDevice {
    latlonconsent: usize,
}

#[derive(Debug, Serialize, Deserialize, BorshDeserialize, BorshSerialize)]
#[serde(crate = "near_sdk::serde")]
pub struct Geo {
    country: String,
    region: String,
    tp: usize,
    ext: ExtDevice,
}

#[derive(Debug, Serialize, Deserialize, BorshDeserialize, BorshSerialize)]
#[serde(crate = "near_sdk::serde")]
pub struct Device {
    make: String,
    model: String,
    os: String,
    osv: String,
    ua: String,
    ip: String,
    language: String,
    devicetype: usize,
    js: usize,
    connectiontype: usize,
    dpidsha1: String,
    carrier: String,
    geo: Geo,
}

// **************************************
#[derive(Debug, Serialize, Deserialize, BorshDeserialize, BorshSerialize)]
#[serde(crate = "near_sdk::serde")]
pub struct ExtUser {
    sessiondepth: usize,
}

#[derive(Debug, Serialize, Deserialize, BorshDeserialize, BorshSerialize)]
#[serde(crate = "near_sdk::serde")]
pub struct User {
    id: String,
    ext: ExtUser,
}

#[derive(Debug, Serialize, Deserialize, BorshDeserialize, BorshSerialize)]
#[serde(crate = "near_sdk::serde")]
pub struct Channel {
    id: String,
    adname: String,
    bidprice: usize,
    cryptotype: String,
    filename: String,
    tagname: String,
    title: String,
    pname: String,
    gaming: String,
    tmpl: String,
    payment: String,
    at: usize,
    tmax: usize,
    imp: Vec<Imp>,
    app: App,
    device: Device,
    user: User,
}

#[near_bindgen]
#[derive(PanicOnDefault, BorshDeserialize, BorshSerialize)]
pub struct Contract {
    owner_id: AccountId,
    adv_channel: UnorderedMap<String, Channel>,
}

#[near_bindgen]
impl Contract {
    #[init]
    pub fn init(owner_id: ValidAccountId) -> Self {
        assert!(!env::state_exists(), "Already initialized");
        Self {
            owner_id: owner_id.into(),
            adv_channel: UnorderedMap::new(b'a'),
        }
    }

    #[payable]
    pub fn payment(&mut self, item_id: String) {
        let deposit = env::attached_deposit();
        assert!(deposit >= MIN_ATTACHED_DEPOSIT, "Must attach at least 0.1 NEAR as deposit");
        Promise::new(self.owner_id.clone()).transfer(deposit);
        match self.adv_channel.get(&item_id) {
            Some(mut val) => {
                val.payment = deposit.to_string();
                self.adv_channel.insert(&item_id, &val);
                env::log("payment received".as_bytes());
            }
            None => {
                env::log("payment error: channel_id not found".as_bytes());
            }
        }
        env::log(env::signer_account_id().as_bytes());
    }


    pub fn add_item_rubicon(&mut self,
                            channel: String,
    ) {
        let channel: Channel = serde_json::from_slice(channel.as_ref()).unwrap();
        self.adv_channel.insert(&channel.id.clone(), &channel);
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