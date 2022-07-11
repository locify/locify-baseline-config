use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};
use near_sdk::serde::{Serialize, Deserialize};
use crate::dto::content::Content;
use crate::dto::publisher::Publisher;

#[derive(Debug, Serialize, Deserialize, BorshDeserialize, BorshSerialize)]
#[serde(crate = "near_sdk::serde")]
pub struct Site {
    pub id: String,
    pub page: String,
    pub domain: String,
    pub publisher: Publisher,
    pub content: Content,
}
