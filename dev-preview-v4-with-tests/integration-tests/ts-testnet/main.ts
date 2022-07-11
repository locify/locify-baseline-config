import {Account} from "near-api-js";
import {getBidRequest} from "../ts-shares/bidRequest";
import {getBidResponse} from "../ts-shares/bidResponse";
import {Auction} from "../ts-shares/types";
import {createRootAccount, deployAndInitContract} from "./rootAccount";
import {config, generateUniqueString, methodOptions} from "./config";
import {createSubAccount, loadContractForSubAccount} from "./subAccount";

async function test() {
    const root: Account = await createRootAccount(config, generateUniqueString('dev'));
    const rootContract: any = await deployAndInitContract(root, methodOptions(root));

    const alice: Account = await createSubAccount(root, config, generateUniqueString('dev'))
    const aliceContract: any = await loadContractForSubAccount(alice, root.accountId, methodOptions(alice));

    const bob: Account = await createSubAccount(root, config, generateUniqueString('dev'))
    const bobContract: any = await loadContractForSubAccount(alice, root.accountId, methodOptions(bob));

    const dave: Account = await createSubAccount(root, config, generateUniqueString('dev'))
    const daveContract: any = await loadContractForSubAccount(alice, root.accountId, methodOptions(bob));

    const alicePlayerId: string = await aliceContract.player_add({
        args: {
            account_id: alice.accountId,
            player_type: 'Advertiser'
        }
    });
    const bobPlayerId: string = await bobContract.player_add({
        args: {
            account_id: bob.accountId,
            player_type: 'Advertiser'
        }
    });
    const davePlayerId: string = await daveContract.player_add({
        args: {
            account_id: bob.accountId,
            player_type: 'Publisher'
        }
    });
    await rootContract.player_activate({
        args: {
            player_id: alicePlayerId
        }
    });
    await rootContract.player_activate({
        args: {
            player_id: bobPlayerId
        }
    });
    await rootContract.player_activate({
        args: {
            player_id: davePlayerId
        }
    });

    const bidfloor = 1;
    const auctionId: string = await daveContract.start_auction({
        args: {
            bid_request: getBidRequest('123', davePlayerId, bidfloor.toString(), "240", "400")
        }
    });

    const aliceBid = 5;
    await aliceContract.add_player_bid({
        args: {
            auction_id: auctionId,
            bid_response: getBidResponse(alicePlayerId, aliceBid.toString(), "240", "400")
        }
    });

    const bobBid = 3
    await bobContract.add_player_bid({
        args: {
            auction_id: auctionId,
            bid_response: getBidResponse(bobPlayerId, bobBid.toString(), "240", "400")
        }
    });

    const auctionCount: Array<Auction> = await rootContract.get_auctions({args: {}});
    const auctionResult: Array<Auction> = await rootContract.check_auction_state({args: {}});
}

test()
