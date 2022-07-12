import {Account, ConnectConfig} from "near-api-js";

const Big = require('big.js')

export const RANDOM_ACCOUNT_LENGTH = 32;
export const wasmPath = './res/rtb_contract.wasm'

export const BOATLOAD_OF_GAS = Big(3)
    .times(10 ** 13)
    .toFixed()
export const INITIAL_BALANCE = Big(100)
    .times(10 ** 18)
    .toFixed()

export const config: ConnectConfig = {
    networkId: 'testnet',
    headers: {},
    nodeUrl: "https://rpc.testnet.near.org",
    walletUrl: "https://wallet.testnet.near.org",
    helperUrl: "https://helper.testnet.near.org",
};

export type MethodOptions = {
    viewMethods: Array<string>,
    changeMethods: Array<string>,
    sender: Account,
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


