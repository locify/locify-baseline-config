import {ConnectConfig, Contract} from "near-api-js";
import {loadAccounts} from "./loadAccounts";
import {Auction, formatNear, methodOptions} from "../ts-shares/config";

export async function checkAuctionsState(config: ConnectConfig, contractAccountId: string, homedir: string, keyPathContract: string, playerId: string): Promise<void> {
    console.log(`start check auctions state`)
    const contractAccount = await loadAccounts(config, contractAccountId, homedir, keyPathContract)
    const contractBalance = await contractAccount.getAccountBalance();
    console.log(`contract account: ${contractAccount.accountId}, available balance: ${formatNear(contractBalance.available)}`);
    const contract: any = new Contract(
        contractAccount, // the contract account object that is connecting
        contractAccount.accountId, // the contract account id that is connecting
        methodOptions(contractAccount)
    );

    console.log(`check auctions state`)
    await contract.check_auction_state({
        args: {}
    })
    const auctions: Array<Auction> = await contract.view_auctions({
        player_id: playerId
    })
    console.log(`auctions: ${JSON.stringify(auctions, null, '\t')}`)
}
