use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};
use near_sdk::serde::{Serialize, Deserialize};
use crate::dto::banner::Banner;
use crate::dto::ext::Ext;

#[derive(Debug, Serialize, Deserialize, BorshDeserialize, BorshSerialize)]
#[serde(crate = "near_sdk::serde")]
pub struct Imp {
    id: String,
    tagid: String,
    instl: String,
    secure: String,
    bidfloor: String,
    bidfloorcur: String,
    banner: Banner,
    ext: Ext,
}