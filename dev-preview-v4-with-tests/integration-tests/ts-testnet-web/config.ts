import {ConnectConfig} from "near-api-js";

const Big = require('big.js')

export const config: ConnectConfig = {
    networkId: 'testnet',
    headers: {},
    nodeUrl: "https://rpc.testnet.near.org",
    walletUrl: "https://wallet.testnet.near.org",
    helperUrl: "https://helper.testnet.near.org",
};