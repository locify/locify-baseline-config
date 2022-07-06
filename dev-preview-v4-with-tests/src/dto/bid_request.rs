use super::app::App;
use super::device::Device;
use super::imp::Imp;
use super::regs::Regs;
use super::site::Site;
use super::source::Source;
use super::user::User;
use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};
use near_sdk::serde::{Serialize, Deserialize};

#[derive(Serialize, Deserialize, BorshDeserialize, BorshSerialize)]
#[serde(crate = "near_sdk::serde")]
pub struct BidRequest {
    pub id: String,
    pub imp: Vec<Imp>,
    pub site: Option<Site>,
    pub app: Option<App>,
    pub device: Option<Device>,
    pub user: Option<User>,
    pub test: Option<u8>,
    pub at: Option<u8>,
    pub tmax: Option<u32>,
    pub wseat: Option<Vec<String>>,
    pub bseat: Option<Vec<String>>,
    pub allimps: Option<u8>,
    pub cur: Option<Vec<String>>,
    pub wlang: Option<Vec<String>>,
    pub bcat: Option<Vec<String>>,
    pub badv: Option<Vec<String>>,
    pub bapp: Option<Vec<String>>,
    pub source: Option<Source>,
    pub regs: Option<Regs>,
    //pub ext: Option<serde_json::Value>,
}
