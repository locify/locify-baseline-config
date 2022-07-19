import {ConnectionInfo} from "near-api-js/lib/utils/web";

const nearApi = require('near-api-js')
const {utils} = nearApi;
const {providers} = require("near-api-js");
import {Account, Near} from "near-api-js";
import {
    createRootAccount,
} from "../ts-shares/rootAccount";
import {formatNear, generateUniqueString, INITIAL_TRANSFER200} from "../ts-shares/config";
import {config} from './config';

// yarn run ts-node-dev integration-tests/nearUtils/addBalance.ts alice.liv1.testnet
async function addBalance() {
    const to = process.argv[2]
    if (to) {
        let toTest = "liv2.testnet"

        const root: Account = await createRootAccount(config, generateUniqueString('dev'));
        const balance = await root.getAccountBalance();
        console.log(`to: ${to}, root balance: ${formatNear(balance.available)}`)

        const connectionInfo: ConnectionInfo = {
            url: config.nodeUrl
        }
        try {
            const provider = new nearApi.providers.JsonRpcProvider(connectionInfo)
            let rawResult = await provider.query({
                request_type: "view_account",
                finality: "final",
                account_id: to,
            });
            //console.log(JSON.stringify(rawResult, null, '\t'));
            console.log(`to: ${to} balance: ${formatNear(rawResult.amount)}`)

            await root.sendMoney(to, INITIAL_TRANSFER200)

            const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
            await wait(3000)

            rawResult = await provider.query({
                request_type: "view_account",
                finality: "final",
                account_id: to,
            });
            //console.log(JSON.stringify(rawResult, null, '\t'));
            console.log(`to: ${to} new balance: ${formatNear(rawResult.amount)}`)

        } catch (e) {
            console.error(`view account error: ${e}`)
        }

    }
}

addBalance()