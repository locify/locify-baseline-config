import {Account, Contract, utils} from "near-api-js";
import {createContractAccounts, createSubAccount, loadAccounts} from "./loadAccounts";
import {config} from "./config";
import {deployAndInitContract} from "../ts-shares/rootAccount";
import {deleteContract} from "./deleteContract";
import {createContract} from "./createContract";
import {activatePlayer} from "./activatePlayer";
import {clearAuctions} from "./clearAuctions";
import {checkAuctionsState} from "./checkAuctionsState";

const BN = require("bn.js");

const assert = require('assert');

const nearAPI = require("near-api-js");
const {connect} = nearAPI;

const {KeyPair, keyStores} = require("near-api-js");
const fs = require("fs");
const homedir = require("os").homedir();
const ROOT_ACCOUNT_ID = "liv1.testnet";
const CONTRACT_ACCOUNT_ID = "rtb_v10.liv1.testnet";
const KEY_PATH_ACCOUNT = 'dev-accounts';

async function test() {

    const KEY_PATH_ROOT = `/.near-credentials/testnet/${ROOT_ACCOUNT_ID}.json`;
    const KEY_PATH_CONTRACT = `/.near-credentials/testnet/${CONTRACT_ACCOUNT_ID}.json`;

    //await deleteContract(ROOT_ACCOUNT_ID, config, CONTRACT_ACCOUNT_ID, homedir, KEY_PATH_CONTRACT)

    //const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
    //await wait(5000)


    // await createContract(config, ROOT_ACCOUNT_ID, CONTRACT_ACCOUNT_ID, homedir, KEY_PATH_ROOT, KEY_PATH_CONTRACT)
    /*let playerId = 'EpNPanXyLK25NZvK8MAiq7paCXWMt7KxHpAedYMXFw6P'
    await activatePlayer(config, CONTRACT_ACCOUNT_ID, playerId, homedir, KEY_PATH_CONTRACT)
    playerId = '7g6QDYM654TemRtGiZCYAAKnP28rmuNqE3pzSJZCvLmm'
    await activatePlayer(config, CONTRACT_ACCOUNT_ID, playerId, homedir, KEY_PATH_CONTRACT)*/

    // await clearAuctions(config, CONTRACT_ACCOUNT_ID, homedir, KEY_PATH_CONTRACT)
    await checkAuctionsState(config, CONTRACT_ACCOUNT_ID, homedir, KEY_PATH_CONTRACT)



    ///************************* create subAccounts
    /*const rootAccount = await loadAccounts(config, ROOT_ACCOUNT_ID, homedir, KEY_PATH_ROOT)
    console.log(`root accountId: ${rootAccount.accountId}`)
    const rootBalance = await rootAccount.getAccountBalance();
    console.log(`root account: ${rootAccount.accountId}, available balance: ${utils.format.formatNearAmount(rootBalance.available, 2)}`);

    const [aliceAccount, bobAccount, daveAccount] = await Promise.all<Account>([
        ...Array.from(['alice', 'bob', 'dave']).map(async (subAccount: any) =>
            await createSubAccount(rootAccount, config, `${subAccount}.${ROOT_ACCOUNT_ID}`, `${KEY_PATH_ACCOUNT}/${subAccount}.${ROOT_ACCOUNT_ID}.json`)
        )
    ]);*/

    ///************************* operate contract ********************************
    /*const rootAccount = await loadAccounts(config, ROOT_ACCOUNT_ID, homedir, KEY_PATH_ROOT)
    console.log(`root accountId: ${rootAccount.accountId}`)
    const rootBalance = await rootAccount.getAccountBalance();
    console.log(`root account: ${rootAccount.accountId}, available balance: ${utils.format.formatNearAmount(rootBalance.available, 2)}`);*/

}

test()
