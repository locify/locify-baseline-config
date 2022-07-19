import {config} from "./config";

const {parseSeedPhrase, generateSeedPhrase} = require('near-seed-phrase');

const nearApi = require('near-api-js')
const fs = require("fs");
const BN = require("bn.js");

const {connect, keyStores, utils, Contract} = nearApi;
import {Account, ConnectConfig, KeyPair, Near} from "near-api-js";
import {KeyStore} from "near-api-js/lib/key_stores";
import {methodOptions, wasmPath} from "../ts-shares/config";
import {KeyPairEd25519} from "near-api-js/lib/utils";

const setKeyStore = async (config: ConnectConfig, accountId: string, homeDir: string, keyPath: string): Promise<KeyStore> => {
    const credentials = JSON.parse(fs.readFileSync(homeDir + keyPath));
    const keyStore: KeyStore = new keyStores.InMemoryKeyStore();
    const privateKey = credentials.private_key;
    console.log(`${accountId} private key: ${privateKey}`)
    await keyStore.setKey(config.networkId, accountId, KeyPair.fromString(privateKey));
    return keyStore;
}

export const loadAccounts = async (config: ConnectConfig, accountId: string, homeDir: string, keyPath: string): Promise<Account> => {
    const keyStore = await setKeyStore(config, accountId, homeDir, keyPath);
    const account = await keyStore.getAccounts(config.networkId);
    const keyPair = await keyStore.getKey(config.networkId, accountId);
    console.log(`keystore: account: ${account} publicKey: ${keyPair.getPublicKey()}`)
    const nearConnection: Near = await connect({...config, keyStore});
    return await nearConnection.account(accountId);
    // RPC - return new Account(near.connection, accountId);
}

export const createSubAccount = async (rootAccount: Account, config: ConnectConfig, accountId: string, keyPath: string): Promise<Account> => {
    const {seedPhrase, publicKey, secretKey} = generateSeedPhrase()
    console.log(`account: ${accountId}, seedPhrase: ${seedPhrase}`)
    const credentials = {
        account_id: accountId,
        public_key: publicKey,
        private_key: secretKey,
        seed_phrase: seedPhrase
    }
    fs.writeFileSync(keyPath, JSON.stringify(credentials));

    return await createContractAccounts(rootAccount, config, accountId, './', keyPath)
}

export const createContractAccounts = async (rootAccount: Account, config: ConnectConfig, contractAccountId: string, homeDir: string, keyPath: string): Promise<Account> => {
    let keyStore = new keyStores.InMemoryKeyStore();
    let keyPair: KeyPairEd25519 = utils.KeyPair.fromRandom('ed25519');
    console.log(`start create contract account: ${contractAccountId}`)
    console.log(`publicKey:${keyPair.getPublicKey()}  privateKey:${keyPair.secretKey} `)
    const res = await rootAccount.createAccount(
        contractAccountId,
        keyPair.getPublicKey().toString(),
        new BN(10).pow(new BN(25))
    );
    console.log(`createContractAccounts result:`)
    console.table(res.status)
    const credentials = {
        account_id: contractAccountId,
        public_key: keyPair.getPublicKey().toString(),
        private_key: keyPair.secretKey,
    }
    fs.writeFileSync(homeDir + keyPath, JSON.stringify(credentials));

    const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
    await wait(3000)
    keyStore = await setKeyStore(config, contractAccountId, homeDir, keyPath);
    const account = await keyStore.getAccounts(config.networkId);
    keyPair = await keyStore.getKey(config.networkId, contractAccountId);
    console.log(`keystore: account: ${account} publicKey: ${keyPair.getPublicKey()}`)
    const nearConnection: Near = await connect({...config, keyStore});
    const contractAccount = await nearConnection.account(contractAccountId);

    await wait(3000)
    const result = await contractAccount.deployContract(fs.readFileSync(wasmPath));
    console.log(`deploy Contract result:`)
    console.table(result.status)
    const contract = new Contract(
        contractAccount, // the contract account object that is connecting
        contractAccount.accountId, // the contract account id that is connecting
        methodOptions(contractAccount)
    );
    console.log(`start init`)
    await contract.init(
        {
            args: {
                owner_id: contractAccount.accountId
            }
        },
    );
    return contractAccount
}