import {createRootAccount, deployAndInitContract} from "./rootAccount";

import anyTest, {TestFn} from "ava";
import {Account} from "near-api-js";
import {config, generateUniqueString, methodOptions} from "./config";
import {createSubAccount, loadContractForSubAccount} from "./subAccount";
import {getBidRequest} from "../ts-shares/bidRequest";
import {getBidResponse} from "../ts-shares/bidResponse";
import {Auction, Player} from "../ts-shares/types";

const test = anyTest as TestFn<{
    accounts: Record<string, Account>
    contracts: Record<string, any>
}>;

test.beforeEach('contract config test', async (t) => {
    const root: Account = await createRootAccount(config, generateUniqueString('dev'));
    const rootContract: any = await deployAndInitContract(root, methodOptions(root));

    const [alice, bob, dave] = await Promise.all<Account>([
        ...Array.from({length: 3}, () => generateUniqueString('dev'))
            .map(async (uniqId) =>
                await createSubAccount(root, config, uniqId)
            )]);

    const aliceContract: any = await loadContractForSubAccount(alice, root.accountId, methodOptions(alice));

    const bobContract: any = await loadContractForSubAccount(alice, root.accountId, methodOptions(bob));

    const daveContract: any = await loadContractForSubAccount(alice, root.accountId, methodOptions(bob));


    t.context.accounts = {root, alice, bob, dave}
    t.context.contracts = {rootContract, aliceContract, bobContract, daveContract}
});

test.skip("add player", async (t) => {
    const {alice} = t.context.accounts;
    const {rootContract, aliceContract} = t.context.contracts;
    const playerId: string = await aliceContract.player_add({
        args: {
            account_id: alice.accountId,
            player_type: 'Publisher'
        }
    });
    const players: Array<Player> = await rootContract.get_players();
    //console.log(`players: `)
    //console.table(players);
    t.is(1, players.length, "add player");

    await rootContract.player_activate({
        args: {
            player_id: playerId
        }
    });

    // non-existing player
    let playerStatus: Player | null = await rootContract.get_player({
        player_id: 'random-12345678'
    });
    t.true(playerStatus === null, "is player non found");

    playerStatus = await rootContract.get_player({
        player_id: playerId
    });
    t.is('Active', playerStatus.status, "player active");
});

test("verify auction", async (t) => {
    const {alice, bob} = t.context.accounts;
    const {rootContract, aliceContract, bobContract, daveContract} = t.context.contracts;
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

    /*const bidfloor = 1;
    const auctionId: string = await daveContract.start_auction({
        args: {
            bid_request: getBidRequest('123', davePlayerId, bidfloor.toString(), "240", "400")
        }
    });

    const aliceBid = 5;
    await aliceContract.add_player_bid({
        args: {
            auctionId,
            bid_response: getBidResponse(alicePlayerId, aliceBid.toString(), "240", "400")
        }
    });

    const bobBid = 3
    await bobContract.add_player_bid({
        args: {
            auctionId,
            bid_response: getBidResponse(bobPlayerId, bobBid.toString(), "240", "400")
        }
    });

    const auctionCount: Array<Auction> = await rootContract.get_auctions();
    t.is(1, auctionCount.length);

    const auctionResult: Array<Auction> = await rootContract.check_auction_state();
    t.is(alicePlayerId, auctionResult[0].winner)
    t.is(bidfloor, auctionResult[0].sell_price)
    t.is(aliceBid, auctionResult[0].highest_bid)*/
    t.pass('finish')
});