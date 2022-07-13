import {MethodOptions, RANDOM_ACCOUNT_LENGTH} from "../ts-testnet/config";
import {Account, connect, ConnectConfig, keyStores, Near, utils} from "near-api-js";

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

export const generateUniqueString = (prefix: string): string => {
    let result = `${prefix}-${Date.now()}-${Math.round(Math.random() * 1000000)}`;
    let add_symbols = Math.max(RANDOM_ACCOUNT_LENGTH - result.length, 1);
    for (let i = add_symbols; i > 0; --i) result += '0';
    return result;
}

export const methodOptions = (account: Account): MethodOptions => ({
    viewMethods: ['get_player', 'get_players'], // view methods do not change state but usually return a value
    changeMethods: ['new', 'player_add', 'player_activate', 'add_deposit', 'get_auctions', 'get_auction', 'start_auction', 'check_auction_state', 'add_player_bid'], // change methods modify state
    sender: account, // account object to initialize and sign transactions.
})