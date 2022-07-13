import {strict as assert} from 'assert';

const BN = require("bn.js");
const fs = require("fs");

const nearApi = require('near-api-js')
const {connect, keyStores, utils, Contract} = nearApi;
import {Account, Near} from "near-api-js";
import {createSubAccountSandbox, loadContractForSubAccount} from "../ts-shares/subAccount";
import {
    createRootAccount,
    deployAndInitContract,
    createMasterAccountSandbox
} from "../ts-shares/rootAccount";
import {methodOptions, wasmPath} from "../ts-testnet/config";
import {generateUniqueString} from "../ts-shares/share";
import {config} from './config';
import {FunctionCallOptions} from "near-api-js/lib/account";

async function startTests() {
    //master = await createMasterAccountSandbox(config, generateUniqueString('dev'));

    let master: Account = await createMasterAccountSandbox(
        {
            ...config,
            masterAccount: "test.near",
            keyPath: "/tmp/near-sandbox/validator_key.json",
        },
        generateUniqueString('dev'));
    let balance = await master.getAccountBalance();
    console.log(`masterId: ${master.accountId}, balance: ${utils.format.formatNearAmount(balance.total)}`)

    const contractId = `${generateUniqueString('dev')}.test.near`;
    const keyStore = new keyStores.InMemoryKeyStore();
    const keyPair = utils.KeyPair.fromRandom('ed25519');
    await keyStore.setKey(config.networkId, contractId, keyPair);
    const contract = fs.readFileSync(wasmPath);
    let contractAccount = await master.createAndDeployContract(
        contractId,
        keyPair.getPublicKey().toString(),
        contract,
        new BN(10).pow(new BN(25)) // x - NEAR
    );


    balance = await contractAccount.getAccountBalance()
    console.log(`contractID: ${contractId} accountId: ${contractAccount.accountId} balance: ${utils.format.formatNearAmount(balance.total)}`)
    console.table(contractAccount);
    let near = await nearApi.connect({...config, keyStore});
    contractAccount = await near.account(contractId);

    const contractMethods = {
        viewMethods: ["get_players"],
        changeMethods: ["new"],
    };
    const contractUser = new nearApi.Contract(
        contractAccount,
        contractId,
        contractMethods,
    )

    const players = await contractUser.get_players();
    console.log(`players: ${players}`)

    await contractUser.new({
        args: {
            owner_id: contractId
        }
    })

    /*let options: FunctionCallOptions = {
        contractId: contractId,
        methodName: 'set_status',
        args: {
            message: 'hello sandbox'
        }
    }
    await contractAccount.functionCall(options);*/

    /*let userCount = 1
    const [alice] = await Promise.all<Account>([
        ...Array.from({length: userCount}, () => generateUniqueString('dev'))
            .map(async (uniqId) =>
                await createSubAccountSandbox(master, {
                    ...config,
                    masterAccount: "test.near",
                }, uniqId)
            )]);
    balance = await alice.getAccountBalance();
    console.log(`aliceId: ${alice.accountId}, balance: ${utils.format.formatNearAmount(balance.total)}`)

    const result = await alice.deployContract(fs.readFileSync(wasmPath));
    console.log(`deploy contract status`);
    console.table(result.status)

    let options: FunctionCallOptions = {
        contractId: alice.accountId,
        methodName: 'new',
        args: {
            owner_id: alice.accountId
        }
    }
    alice.functionCall(options);

    const aliceContract = new Contract(
        alice, // the account object that is connecting
        alice.accountId, // the account object that is connecting
        methodOptions(alice)
    );
    console.log('contract')*/
    //console.table(aliceContract)


    /*await aliceContract.new(
        {
            args: {owner_id: alice.accountId}
        },
    );*/
    /*const root = await master.createAndDeployContract(
        config.contractAccount,
        pubKey,
        fs.readFileSync(wasmPath),
        utils.format.parse("1N")
    );

    await contractAccount.new(
        {
            args: {
                owner_id: rootAccount.accountId
            }
        },
    );*/
    /*let userCount = 4
    const [alice, bob, dave] = await Promise.all<Account>([
        ...Array.from({length: userCount}, () => generateUniqueString('dev'))
            .map(async (uniqId) =>
                await createSubAccount(master, config, uniqId)
            )]);
    console.log(alice.accountId, bob.accountId, dave.accountId);

    const keyStore = new keyStores.InMemoryKeyStore();
    const keyPair = utils.KeyPair.fromRandom('ed25519');
    let root: Account = await master.createAndDeployContract(
        config.contractAccount,
        keyPair.getPublicKey().toString(),
        fs.readFileSync(wasmPath),
        new BN(10).pow(new BN(25))
    );

    await keyStore.setKey(config.networkId, root.accountId, keyPair);
    let near: Near = await connect({...config, keyStore});

    root = await near.account(root.accountId)

    console.log('deploy result')
    console.table(root)*/

    // connect contract to root
    /*const rootContract = new Contract(
        master, // the account object that is connecting
        config.contractAccount, // the account object that is connecting
        methodOptions(master)
    );

    await rootContract.new(
        {
            args: {
                owner_id: master.accountId
            }
        },
    );*/
    // const rootContract: any = await deployAndInitContract(root, methodOptions(root));


    /*const [aliceContract, bobContract, daveContract] = await Promise.all<any>([
        [alice, bob, dave].map(async (account: Account) =>
            await loadContractForSubAccount(account, root.accountId, methodOptions(account)))
    ])*/
}

startTests()