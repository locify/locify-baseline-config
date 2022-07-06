import {Worker, NEAR, NearAccount} from "near-workspaces";
import anyTest, {TestFn} from "ava";

type Player = {
    id: string,
    linked_account: string,
    status: string,
    balance: string,
}

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
        {initialBalance: NEAR.parse("30 N").toJSON()}
    );
    await contract.call(contract, 'new', {
        owner_id: root,
    });

    // some test accounts
    const alice = await root.createSubAccount("alice", {
        initialBalance: NEAR.parse("30 N").toJSON(),
    });
    const bob = await root.createSubAccount("bob", {
        initialBalance: NEAR.parse("30 N").toJSON(),
    });

    // Save state for test runs, it is unique for each test
    t.context.worker = worker;
    t.context.accounts = {root, contract, alice, bob};
});

test.afterEach(async (t) => {
    // Stop Sandbox server
    await t.context.worker.tearDown().catch((error) => {
        console.log("Failed to stop the Sandbox:", error);
    });
});

test("add player", async (t) => {
    const {root, contract, alice, bob, charlie} = t.context.accounts;
    let playerId: string = await alice.call(contract, "player_add", {
        account_id: "alice.testnet",
        player_type: 'Publisher'
    });
    const playerState: Player = await contract.view("get_player", {player_id: playerId});
    let players: Array<Player> = await root.call(contract, "get_players", {});
    t.is(playerId, playerState.id);
    t.is(players.length, 1);
});
test("activate player", async (t) => {
    const {root, contract, alice, bob, charlie} = t.context.accounts;
    let playerId: string = await alice.call(contract, "player_add", {
        account_id: "alice.testnet",
        "player_type": "Publisher"
    });
    await root.call(contract, "player_activate", {player_id: playerId});
    const playerState: Player = await contract.view("get_player", {player_id: playerId});
    t.is('Active', playerState.status);
});