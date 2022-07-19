import {createContractAccounts, loadAccounts} from "./loadAccounts";
import {config} from "./config";
import {Account, ConnectConfig, utils} from "near-api-js";
import {deployAndInitContract} from "../ts-shares/rootAccount";
import {formatNear} from "../ts-shares/config";

export async function createContract(config: ConnectConfig, rootAccountId: string, contractAccountId: string, homedir, keyPathRoot: string, keyPathContract: string) {
    const rootAccount = await loadAccounts(config, rootAccountId, homedir, keyPathRoot)
    const rootBalance = await rootAccount.getAccountBalance();
    console.log(`root account: ${rootAccount.accountId}, available balance: ${formatNear(rootBalance.available)}`);
    const contractAccount: Account = await createContractAccounts(rootAccount, config, contractAccountId, homedir, keyPathContract);
    const contractBalance = await contractAccount.getAccountBalance();
    console.log(`contract: ${contractAccount.accountId} balance: ${formatNear(contractBalance.available)}`)
}
