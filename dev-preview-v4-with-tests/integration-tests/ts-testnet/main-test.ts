import {NEAR, NearAccount} from "near-workspaces";

var assert = require('assert');
import {Account} from "near-api-js";
import {getBidRequest} from "../ts-shares/bidRequest";
import {getBidResponse} from "../ts-shares/bidResponse";
import {Auction} from "../ts-shares/types";
import {createRootAccount, deployAndInitContract} from "./rootAccount";
import {config, generateUniqueString, methodOptions} from "./config";
import {createSubAccount, loadContractForSubAccount} from "./subAccount";

async function test() {
    const root: Account = await createRootAccount(config, generateUniqueString('dev'));

    // create accounts
    const [alice, bob, dave] = await Promise.all<Account>([
        ...Array.from({length: 3}, () => generateUniqueString('dev'))
            .map(async (uniqId) =>
                await createSubAccount(root, config, uniqId)
            )]);
    console.log(alice.accountId, bob.accountId, dave.accountId);

    // connect account to contract
    const rootContract: any = await deployAndInitContract(root, methodOptions(root));
    const [aliceContract, bobContract, daveContract] = await Promise.all<any>([
        [alice, bob, dave].map(async (account: Account) =>
            await loadContractForSubAccount(account, root.accountId, methodOptions(account)))
    ])

    // add publishers
    const davePlayerId: string = await daveContract.player_add({
        args: {
            account_id: bob.accountId,
            player_type: 'Publisher'
        }
    });
    // add advertisers
    const [alicePlayerId, bobPlayerId] = await Promise.all<any>([
        [aliceContract, bobContract].map(async (contract: any) =>
            await contract.player_add({
                args: {
                    account_id: alice.accountId,
                    player_type: 'Advertiser'
                }
            })
        )
    ]);

    // activate players
    await Promise.all<any>([
        [alicePlayerId, bobPlayerId, davePlayerId].map(async (playerId) =>
            await rootContract.player_activate({
                args: {
                    player_id: playerId,
                }
            })
        )
    ]);

    const aliceDep = await aliceContract.add_deposit({
        args: {
            player_id: alicePlayerId
        },
        gas: NEAR.parse("3N"),
        attachedDeposit: NEAR.parse('1N')
    })
    console.log(`aliceDep: ${aliceDep}`)

    // start auctions
    /*const bidfloor = 1;
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
    const auctionResult: Array<Auction> = await rootContract.check_auction_state({args: {}});*/
}

test()
