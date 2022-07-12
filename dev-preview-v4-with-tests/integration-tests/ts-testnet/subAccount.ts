const nearApi = require('near-api-js')
const fs = require("fs");
import {
    BOATLOAD_OF_GAS,
    config,
    INITIAL_BALANCE, MethodOptions,
    RANDOM_ACCOUNT_LENGTH,
    wasmPath
} from "./config";

const {connect, keyStores, utils, Contract} = nearApi;
import {Near, Account, ConnectConfig} from "near-api-js";

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

export const loadContractForSubAccount = (subAccount: Account, contactId: string, methodOptions: MethodOptions): any => {
    return new Contract(
        subAccount, // the account object that is connecting
        contactId,
        methodOptions
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