import Koa from "koa";
import Router from "koa-router";

import logger from "koa-logger";
import json from "koa-json";
import bodyParser from "koa-bodyparser";
import { utils } from "near-api-js";

const nearAPI = require("near-api-js");
const Big = require("big.js");

const app = new Koa();
const router = new Router();
const cors = require("@koa/cors");

app.use(cors());
interface ClickRequest {
  accountId: string;
  sKey: string;
  advId: string;
}

const BOATLOAD_OF_GAS = Big(3)
  .times(10 ** 13)
  .toFixed();

const { connect, keyStores, KeyPair } = nearAPI;

// post click
router.post("/click", async (ctx, next) => {
  console.table(ctx.request.body);
  const { accountId, sKey, advId } = <ClickRequest>ctx.request.body;
  console.info(accountId, sKey);
  const keyPair = utils.KeyPair.fromString(sKey);
  const keyStore = new keyStores.InMemoryKeyStore();
  await keyStore.setKey("testnet", `${accountId}.testnet`, keyPair);
  console.table(keyPair);
  console.log(`${accountId}.testnet`);
  const config = {
    networkId: "testnet",
    keyStore, // optional if not signing transactions
    nodeUrl: "https://rpc.testnet.near.org",
    walletUrl: "https://wallet.testnet.near.org",
    helperUrl: "https://helper.testnet.near.org",
    explorerUrl: "https://explorer.testnet.near.org",
  };
  const near = await connect(config);
  const account = await near.account(`${accountId}.testnet`);

  const contract = new nearAPI.Contract(
    account, // the account object that is connecting
    "adv1.liv1.testnet",
    {
      // name of contract you're connecting to
      viewMethods: [], // view methods do not change state but usually return a value
      changeMethods: ["on_adv_click"], // change methods modify state
    }
  );
  let result = "success";
  try {
    await contract.on_adv_click({
      meta: "some change adv data",
      //callbackUrl: '',
      args: {
        adv_id: advId,
      },
      gas: BOATLOAD_OF_GAS,
    });
  } catch (e) {
    console.log("exception: " + e);
    result = "failure";
  }
  ctx.body = { result };
  await next();
});

// Hello world
router.get("/", async (ctx, next) => {
  console.log(ctx.request.body);
  ctx.body = { hello: "man" };
  await next();
});

// Middlewares
app.use(json());
app.use(logger());
app.use(bodyParser());

// Routes
app.use(router.routes()).use(router.allowedMethods());

app.listen(3000, () => {
  console.log("Koa started");
});
