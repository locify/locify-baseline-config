use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};
use near_sdk::serde::{Serialize, Deserialize};
use crate::dto::imp::Imp;
use crate::dto::site::Site;
use crate::dto::source::Source;

#[derive(Debug, Serialize, Deserialize, BorshDeserialize, BorshSerialize)]
#[serde(crate = "near_sdk::serde")]
pub struct BidRequest {
    id: String,
    source: Source,
    imp: Vec<Imp>,
    site: Site,
}