const nearApi = require('near-api-js')
const fs = require("fs");
import {
    BOATLOAD_OF_GAS,
    config, generateUniqueString,
    INITIAL_BALANCE, MethodOptions,
    RANDOM_ACCOUNT_LENGTH,
    wasmPath
} from "./config";

const {connect, keyStores, utils, Contract} = nearApi;
import {Near, Account, ConnectConfig} from "near-api-js";

export const createRootAccount = async (config: ConnectConfig, accountId: string): Promise<Account> => {
    const keyStore = new keyStores.InMemoryKeyStore();
    const keyPair = utils.KeyPair.fromRandom('ed25519');
    const rootAccountId = generateUniqueString('dev');
    let near: Near = await connect(config);
    await near.accountCreator.createAccount(rootAccountId, keyPair.getPublicKey());
    console.log(`rootAccountId: ${rootAccountId}`)
    // update connection
    await keyStore.setKey(config.networkId, rootAccountId, keyPair);
    near = await connect({...config, keyStore});
    return await near.account(rootAccountId);
}

export const deployAndInitContract = async (rootAccount: Account, methodOptions: MethodOptions): Promise<any> => {
    //console.table(account)
    // deploy contract
    const result = await rootAccount.deployContract(fs.readFileSync(wasmPath));
    console.log(`deploy contract status`);
    console.table(result.status)
    const rootContract = new Contract(
        rootAccount, // the account object that is connecting
        rootAccount.accountId, // the account object that is connecting
        methodOptions
    );
    await rootContract.new(
        {
            args: {
                owner_id: rootAccount.accountId, // argument name and value - pass empty object if no args required
            }
        },
    );

    return rootContract
}


