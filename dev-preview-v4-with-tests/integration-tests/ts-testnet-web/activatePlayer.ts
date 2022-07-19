import {loadAccounts} from "./loadAccounts";
import {ConnectConfig, Contract} from "near-api-js";
import {formatNear, methodOptions, Player} from "../ts-shares/config";

export async function activatePlayer(config: ConnectConfig, contractAccountId: string, playerId: string, homedir: string, keyPathContract: string): Promise<void> {
    const contractAccount = await loadAccounts(config, contractAccountId, homedir, keyPathContract)
    const contractBalance = await contractAccount.getAccountBalance();
    console.log(`contract account: ${contractAccount.accountId}, available balance: ${formatNear(contractBalance.available)}`);
    const contract: any = new Contract(
        contractAccount, // the contract account object that is connecting
        contractAccount.accountId, // the contract account id that is connecting
        methodOptions(contractAccount)
    );
    console.log(`start activate`)
    await contract.player_activate({
        args: {
            player_id: playerId
        }
    })

    const allPlayers: Array<Player> = await contract.view_players({});
    if (allPlayers && allPlayers.length > 0) {
        console.log(`all players: ${JSON.stringify(allPlayers, null, '\t')}`)
    } else {
        console.log('players not found')
    }
}