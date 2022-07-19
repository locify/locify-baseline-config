import {Account, connect, ConnectConfig, keyStores, Near, utils} from "near-api-js";

const Big = require('big.js')

export const RANDOM_ACCOUNT_LENGTH = 32;

export const wasmPath = './res/rtb_contract.wasm'

export const BOATLOAD_OF_GAS = Big(3)
    .times(10 ** 13)
    .toFixed()
export const INITIAL_BALANCE = Big(100)
    .times(10 ** 18)
    .toFixed()

export const INITIAL_TRANSFER200 = Big(199)
    .times(10 ** 24)
    .toFixed()

export const INITIAL_TRANSFER5 = Big(5)
    .times(10 ** 24)
    .toFixed()

export const INITIAL_TRANSFER7 = Big(7)
    .times(10 ** 24)
    .toFixed()

export type Player = {
    id: string,
    linked_account: string,
    status: string,
    balance: string,
}

export type Auction = {
    auction_id: string,
    winner: any,
    sell_price: number,
    highest_bid: number,
    start_at: any,
    end_at: any,
    bid_request: any,
    bid_responses: any,
}

export function formatNear(balance: string): string {
    return utils.format.formatNearAmount(balance, 2)
}

export const generateUniqueString = (prefix: string): string => {
    let result = `${prefix}-${Date.now()}-${Math.round(Math.random() * 1000000)}`;
    let add_symbols = Math.max(RANDOM_ACCOUNT_LENGTH - result.length, 1);
    for (let i = add_symbols; i > 0; --i) result += '0';
    return result;
}

export type MethodOptions = {
    viewMethods: Array<string>,
    changeMethods: Array<string>,
    sender: Account,
}

export const methodOptions = (account: Account): MethodOptions => ({
    viewMethods: ['view_accounts_info', 'view_players', 'view_player_by_id', 'view_player_by_account', 'view_auctions', 'view_auction_by_id'], // view methods do not change state but usually return a value
    changeMethods: ['init', 'clear_players', 'player_add', 'player_activate', 'add_deposit', 'clear_auctions', 'start_auction', 'add_player_bid', 'check_auction_state',], // change methods modify state
    sender: account, // account object to initialize and sign transactions.
})