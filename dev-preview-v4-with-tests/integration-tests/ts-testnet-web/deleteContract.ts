import {Account, ConnectConfig} from "near-api-js";
import {loadAccounts} from "./loadAccounts";

///************************* delete contract ********************************
export async function deleteContract(root_account_id: string, config: ConnectConfig, contract_account_id: string, homedir, key_path_contract: string) {
    console.log('delete contract account');
    const contractAccount: Account = await loadAccounts(config, contract_account_id, homedir, key_path_contract)
    await contractAccount.deleteAccount(root_account_id);
}
