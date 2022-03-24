const nearAPI = require('near-api-js')
const Big = require('big.js')
const {Account} = require("near-api-js");
const fs = require("fs");
const {InMemoryKeyStore} = require("near-api-js/lib/key_stores");
const {connect, keyStores, KeyPair, KeyPairEd25519, WalletConnection, utils} =
    nearAPI

const BOATLOAD_OF_GAS = Big(3)
    .times(10 ** 13)
    .toFixed()

async function test_function() {

    const accountId = 'liv1.testnet' // set your account
    const networkId = 'testnet'
    const contractId = 'adv1.liv1.testnet'


    const credentials = JSON.parse(
        fs.readFileSync(
            `${process.env.HOME}/.near-credentials/testnet/${accountId}.json`
        )
    );
    const keyStore = new InMemoryKeyStore();
    console.log('sk: ', credentials.private_key)
    await keyStore.setKey(
        networkId,
        accountId,
        KeyPair.fromString(credentials.private_key)
    );

    // *****************************************************
    // without authentication
    const _keyStore = new InMemoryKeyStore();
    const _config = {
        networkId: "testnet",
        keyStore: _keyStore, // optional if not signing transactions
        nodeUrl: "https://rpc.testnet.near.org",
        walletUrl: "https://wallet.testnet.near.org",
        helperUrl: "https://helper.testnet.near.org",
        explorerUrl: "https://explorer.testnet.near.org",
    };
    const _near = await connect(_config);

    const _account = await _near.account(accountId);
    const _contract = new nearAPI.Contract(
        _account, // the account object that is connecting
        contractId,
        {
            // name of contract you're connecting to
            viewMethods: ["all_banner"], // view methods do not change state but usually return a value
            changeMethods: [], // change methods modify state
        }
    );

    const response = await _contract.all_banner();
    console.log(response);
    // *****************************************************

    const config = {
        networkId,
        keyStore, // optional if not signing transactions
        nodeUrl: 'https://rpc.testnet.near.org',
        walletUrl: 'https://wallet.testnet.near.org',
        helperUrl: 'https://helper.testnet.near.org',
        explorerUrl: 'https://explorer.testnet.near.org',
    }
    const near = await connect(config)

    const account = await near.account(accountId)
    try {
        const {connection} = near;
        const contractAccount = new Account(connection, accountId);
        const response = await contractAccount.functionCall({
                contractId,
                methodName: 'all_banner',
            }
        )
        console.info(response)
    } catch (e) {
        console.error('exception: ', e)
    }

    /*const contract = new nearAPI.Contract(
        account, // the account object that is
        contractId,// connecting,
        {
            // name of contract you're connecting to
            viewMethods: ['all_banner', 'all_adv'], // view methods do not change state but usually return a value
            changeMethods: ['add_banner', 'add_adv'], // change methods modify state
        }
    )*/
}

test_function()
