use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};
use near_sdk::serde::{Serialize, Deserialize};
use crate::dto::imp::Imp;
use crate::dto::site::Site;
use crate::dto::source::Source;

#[derive(Debug, Serialize, Deserialize, BorshDeserialize, BorshSerialize)]
#[serde(crate = "near_sdk::serde")]
pub struct BidRequest {
    pub id: String,
    pub source: Source,
    pub imp: Vec<Imp>,
    pub site: Site,
}