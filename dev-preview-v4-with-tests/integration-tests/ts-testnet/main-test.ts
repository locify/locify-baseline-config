import {NEAR, NearAccount} from "near-workspaces";

var assert = require('assert');
import {Account} from "near-api-js";
import {getBidRequest} from "../ts-shares/bidRequest";
import {getBidResponse} from "../ts-shares/bidResponse";
import {Auction, generateUniqueString} from "../ts-shares/share";
import {createRootAccount, deployAndInitContract} from "../ts-shares/rootAccount";
import {config, methodOptions} from "./config";
import {createSubAccount, createSubAccountSandbox, loadContractForSubAccount} from "../ts-shares/subAccount";

async function test() {
    const root: Account = await createRootAccount(config, generateUniqueString('dev'));

    // create accounts
    const [alice, bob, dave] = await Promise.all<Account>([
        ...Array.from({length: 3}, () => generateUniqueString('dev'))
            .map(async (uniqId) =>
                await createSubAccount(root, config, uniqId)
            )]);
    console.log(`accounts: ${root.accountId}, ${alice.accountId}, ${bob.accountId}, ${dave.accountId}`);

    // connect account to contract
    const rootContract: any = await deployAndInitContract(root);

    const [aliceContract, bobContract, daveContract] = [alice, bob, dave].map(account =>
        loadContractForSubAccount(account, root.accountId))

    // add publishers
    const davePlayerId: string = await daveContract.player_add({
        args: {
            account_id: bob.accountId,
            player_type: 'Publisher'
        }
    });

    const [alicePlayerId, bobPlayerId] = await Promise.all<string>([
        ...Array.from([aliceContract, bobContract]).map(async (contract: any) =>
            await contract.player_add({
                args: {
                    account_id: contract.account.accountId,
                    player_type: 'Advertiser'
                }
            })
        )
    ]);

    console.log(`publisher: dave ${davePlayerId}`)
    console.log(`advertisers: alice ${alicePlayerId} bob: ${bobPlayerId}`)

    // activate players
    await Promise.all([
        [alicePlayerId, bobPlayerId, davePlayerId].map(async (playerId) =>
            await rootContract.player_activate({
                args: {
                    player_id: playerId,
                }
            })
        )
    ]);

    console.log(`start add deposit`)
    const aliceDepo = await aliceContract.add_deposit({
        args: {
            player_id: alicePlayerId
        },
        amount: 9
    })
    console.log(`aliceDepo: ${aliceDepo}`)

    const bobDepo = await bobContract.add_deposit({
        args: {
            player_id: bobPlayerId
        },
        amount: 8
    })

    console.log(`bodDepo: ${aliceDepo}`)
    // start auctions
    const bidfloor = 1;
    const auctionId: string = await daveContract.start_auction({
        args: {
            bid_request: getBidRequest('123', davePlayerId, bidfloor.toString(), "240", "400")
        }
    });

    console.log(`start bid`)
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

    console.log(`get auctions state`)
    const auctionCount: Array<Auction> = await rootContract.get_auctions({args: {}});

    console.log(`wait 4 seconds`)
    const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
    await wait(4000);

    console.log(`finish auctions`)
    const auctionResult: Array<Auction> = await rootContract.check_auction_state({args: {}});
}

test()
