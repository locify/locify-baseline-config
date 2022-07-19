import {methodOptions} from "./config";

const nearApi = require('near-api-js')
const fs = require("fs");
import {Near, Account, ConnectConfig} from "near-api-js";

const {connect, keyStores, utils, Contract} = nearApi;

export const createSubAccountSandbox = async (rootAccount: Account, config: ConnectConfig, subAccountId: string): Promise<Account> => {
    const accountId = `${subAccountId}.${config.masterAccount}`;
    const keyStore = new keyStores.InMemoryKeyStore();
    const keyPair = utils.KeyPair.fromRandom('ed25519');
    await keyStore.setKey(config.networkId, accountId, keyPair);
    //console.log(`pkey: ${keyPair.getPublicKey().toString()}`);
    //console.log(`subAccountId: ${subAccountId}`);
    await rootAccount.createAccount(
        accountId,
        keyPair.getPublicKey().toString(),
        utils.format.parseNearAmount("10")
    )
    let near: Near = await connect({...config, keyStore});

    return await near.account(accountId);
}

export const createSubAccount = async (rootAccount: Account, config: ConnectConfig, subAccountId: string): Promise<Account> => {
    const keyStore = new keyStores.InMemoryKeyStore();
    const keyPair = utils.KeyPair.fromRandom('ed25519');
    await keyStore.setKey(config.networkId, subAccountId, keyPair);
    //console.log(`pkey: ${keyPair.getPublicKey().toString()}`);
    //console.log(`subAccountId: ${subAccountId}`);
    await rootAccount.createAccount(
        subAccountId,
        keyPair.getPublicKey().toString(),
        utils.format.parseNearAmount("10")
    )
    let near: Near = await connect({...config, keyStore});

    return await near.account(subAccountId);
}

export const loadContractForSubAccount = (subAccount: Account, contactId: string): any => {

    return new Contract(
        subAccount, // the account object that is connecting
        contactId,
        methodOptions(subAccount),
    );
}


/*await rootAccount.functionCall({
        contractId: config.networkId,
        methodName: 'create_account',
        args: {
            new_account_id: subAccountId,
            new_public_key: publicKey,
        },
        gas: BOATLOAD_OF_GAS,
        attachedDeposit: INITIAL_BALANCE,
    });*/