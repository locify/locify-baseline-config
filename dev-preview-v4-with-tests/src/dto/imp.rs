use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};
use near_sdk::serde::{Serialize, Deserialize};
use crate::dto::banner::Banner;
use crate::dto::ext::Ext;

#[derive(Debug, Serialize, Deserialize, BorshDeserialize, BorshSerialize)]
#[serde(crate = "near_sdk::serde")]
pub struct Imp {
    pub id: String,
    pub tagid: String,
    pub instl: String,
    pub secure: String,
    pub bidfloor: String,
    pub bidfloorcur: String,
    pub banner: Banner,
    pub ext: Ext,
}