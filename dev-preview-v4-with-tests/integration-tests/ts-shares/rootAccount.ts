import {generateUniqueString} from "./share";

const nearApi = require('near-api-js')
const fs = require("fs");
import {
    config,
    INITIAL_BALANCE, MethodOptions,
    RANDOM_ACCOUNT_LENGTH,
    wasmPath
} from "../ts-testnet/config";

const {connect, keyStores, utils, Contract} = nearApi;
import {Near, Account, ConnectConfig} from "near-api-js";
import {SandboxConfig} from "../ts-workspaces/config";

export const createMasterAccountSandbox = async (config: ConnectConfig, accountId: string): Promise<Account> => {
    const keyFile = require(config.keyPath);
    const masterKey = nearApi.utils.KeyPair.fromString(
        keyFile.secret_key || keyFile.private_key
    );
    const pubKey = masterKey.getPublicKey();
    const keyStore = new nearApi.keyStores.InMemoryKeyStore();
    await keyStore.setKey(config.networkId, config.masterAccount, masterKey);
    let near = await nearApi.connect({...config, keyStore});
    return new nearApi.Account(near.connection, config.masterAccount);
}

export const createRootAccount = async (config: ConnectConfig, accountId: string): Promise<Account> => {
    const keyStore = new keyStores.InMemoryKeyStore();
    const keyPair = utils.KeyPair.fromRandom('ed25519');
    const rootAccountId = generateUniqueString('dev');
    let near: Near = await connect(config);
    await near.accountCreator.createAccount(rootAccountId, keyPair.getPublicKey());
    //console.log(`rootAccountId: ${rootAccountId}`)
    // update connection
    await keyStore.setKey(config.networkId, rootAccountId, keyPair);
    near = await connect({...config, keyStore});
    return await near.account(rootAccountId);
}

export const deployAndInitContract = async (rootAccount: Account): Promise<any> => {
    //console.table(account)
    // deploy contract
    const result = await rootAccount.deployContract(fs.readFileSync(wasmPath));
    console.log(`deploy contract status`);
    console.table(result.status)
    const rootContract = new Contract(
        rootAccount, // the account object that is connecting
        rootAccount.accountId, // the account object that is connecting
        {
            viewMethods: ["get_player", "get_players"], // view methods do not change state but usually return a value
            changeMethods: ["new", "player_add", "player_activate", "add_deposit", "get_auctions", "get_auction", "start_auction", "check_auction_state", "add_player_bid"], // change methods modify state
            sender: rootAccount
        }
    );
    await rootContract.new(
        {
            args: {
                owner_id: rootAccount.accountId
            }
        },
    );
    return rootContract
}