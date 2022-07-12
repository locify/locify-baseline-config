import {Worker, NEAR, NearAccount} from "near-workspaces";
import anyTest, {TestFn} from "ava";
import {getBidRequest} from "../ts-shares/bidRequest";
import {getBidResponse} from "../ts-shares/bidResponse";
import {Auction, Player} from "../ts-shares/types";
import {config, generateUniqueString} from "../ts-testnet/config";

const test = anyTest as TestFn<{
    worker: Worker;
    accounts: Record<string, NearAccount>;
}>;

test.beforeEach(async (t) => {
    // Init the worker and start a Sandbox server
    const worker = await Worker.init();

    // deploy contract
    const root = worker.rootAccount;
    const contract = await root.createAndDeploy(
        root.getSubAccount("rtb-contract").accountId,
        "./res/rtb_contract.wasm",
        {initialBalance: NEAR.parse("50 N").toJSON()}
    );

    const [alice, bob, dave] = await Promise.all<NearAccount>([
        ...Array.from({length: 3}, () => generateUniqueString('dev'))
            .map(async (uniqId) =>
                await root.createSubAccount(uniqId, {
                        initialBalance: NEAR.parse("10 N").toJSON(),
                    }
                )
            )
    ]);

    // init smart contract
    await contract.call(contract, 'new', {
        owner_id: root,
    });

    console.log('near accounts ready')
    // Save state for test runs, it is unique for each test
    t.context.worker = worker;
    //t.context.accounts = {root, contract, alice, bob, dave};
    t.context.accounts = {root, contract, alice, bob, dave};
});


test.afterEach(async (t) => {
    // Stop Sandbox server
    await t.context.worker.tearDown().catch((error) => {
        console.log("Failed to stop the Sandbox:", error);
    });
});

test.skip("add player", async (t) => {
    const {root, contract, alice} = t.context.accounts;
    let playerId: string = await alice.call(contract, "player_add", {
        account_id: "alice.testnet",
        player_type: 'Publisher'
    });
    let players: Array<Player> = await root.call(contract, "get_players", {});
    t.is(players.length, 1, 'one player added');
});

test.skip("activate player", async (t) => {
    const {root, contract, alice} = t.context.accounts;
    let playerId: string = await alice.call(contract, "player_add", {
        account_id: alice.accountId,
        player_type: 'Publisher'
    });
    let result: string = await root.call(contract, 'player_activate', {player_id: playerId});
    const playerState: Player = await root.call(contract, "get_player", {player_id: playerId});
    t.is('Active', playerState.status, 'player activated');
});

test("verify auction", async (t) => {
    const {root, contract, alice, bob, dave} = t.context.accounts;
    /*let alicePlayerId: string = await alice.call(contract, "player_add", {
        account_id: alice.accountId,
        player_type: 'Advertiser'
    });
    let bobPlayerId: string = await bob.call(contract, "player_add", {
        account_id: bob.accountId,
        player_type: 'Advertiser'
    });
    let davePlayerId: string = await dave.call(contract, "player_add", {
        account_id: dave.accountId,
        player_type: 'Publisher'
    });*/
    console.log('start player add')
    const [alicePlayerId, bobPlayerId] = await Promise.all<any>([
        [alice, bob].map(async (account: NearAccount) => await account.call(contract, 'player_add', {
            account_id: account.accountId,
            player_type: 'Advertiser'
        }))
    ])
    /*const [davePlayerId] = await Promise.all<any>([
        [dave].map(async (account) => await account.call(contract, 'player_add', {
            account_id: account.accountId,
            player_type: 'Publisher'
        }))
    ])*/
    //console.log(`alice: ${alicePlayerId} bob: ${bobPlayerId}, dave: ${davePlayerId}`);

    /*await Promise.all<any>([
        [alicePlayerId, bobPlayerId, davePlayerId].map(async (playerId) =>
            await root.call(contract, 'player_activate', {player_id: playerId})
        )
    ])*/

    const bidfloor = 1;
    const daveRequestId = '123';
    /*const auctionId: string = await dave.call(contract, "start_auction", {
        bid_request: getBidRequest(daveRequestId, davePlayerId, bidfloor.toString(), "240", "400")
    });*/

    /*let newBalance: string | null = await alice.call(contract, 'add_deposit', {
        player_id: alicePlayerId,
    }, {
        gas: NEAR.parse("3N"),
        attachedDeposit: NEAR.parse('1N')
    });*/

    /*await Promise.all<any>([
        [alicePlayerId, bobPlayerId].map((async (playerId) => playerId.call(contract, 'add_deposit', {
                player_id: playerId,
            }, {
                attachedDeposit: NEAR.parse('1N')
            }
        )))
    ])*/
    t.pass('success')

    /*const aliceBid = 5;
    let bidCount: string = await alice.call(contract, 'add_player_bid', {
        auction_id: auctionId,
        bid_response: getBidResponse(alicePlayerId, aliceBid.toString(), "240", "400")
    });
    t.is("1", bidCount);

    const bobBid = 3
    bidCount = await bob.call(contract, 'add_player_bid', {
        auction_id: auctionId,
        bid_response: getBidResponse(bobPlayerId, bobBid.toString(), "240", "400")
    });
    t.is("2", bidCount);

    const auctionCount: Array<Auction> = await root.call(contract, 'get_auctions', {});
    t.is(1, auctionCount.length);

    const auctionResult: Array<Auction> = await root.call(contract, 'check_auction_state', {});
    t.is(alicePlayerId, auctionResult[0].winner)
    t.is(bidfloor, auctionResult[0].sell_price)
    t.is(aliceBid, auctionResult[0].highest_bid)*/
});

