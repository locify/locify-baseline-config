import {ConnectConfig, Contract} from "near-api-js";
import {loadAccounts} from "./loadAccounts";
import {Auction, formatNear, methodOptions} from "../ts-shares/config";

export async function clearAuctions(config: ConnectConfig, contractAccountId: string, homedir: string, keyPathContract: string): Promise<void> {
    console.log(`start clear auctions`)
    const contractAccount = await loadAccounts(config, contractAccountId, homedir, keyPathContract)
    const contractBalance = await contractAccount.getAccountBalance();
    console.log(`contract account: ${contractAccount.accountId}, available balance: ${formatNear(contractBalance.available)}`);
    const contract: any = new Contract(
        contractAccount, // the contract account object that is connecting
        contractAccount.accountId, // the contract account id that is connecting
        methodOptions(contractAccount)
    );
    console.log(`current auctions`)
    const auctions: Array<Auction> = await contract.view_auctions({})
    console.log(`auctions count: ${auctions.length}`)

    await contract.clear_auctions({
        args: {}
    })
    const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
    await wait(5000)
    const auctionsEmpty: Array<Auction> = await contract.view_auctions({})
    console.log(`auctions zero: ${auctions.length}`)
}