#!/usr/bin/env bash

export NEAR_ACCT=rtb_v1.liv1.testnet && \
#near delete $NEAR_ACCT liv1.testnet && \
sleep 1 && \
near create-account $NEAR_ACCT --masterAccount liv1.testnet --initialBalance 50 && \
sleep 1 && \
near deploy $NEAR_ACCT --wasmFile ./res/rtb_contract.wasm && \
sleep 1 && \
echo "!!! call init contract" && \
near call $NEAR_ACCT init '{"owner_id": "liv1.testnet"}' --accountId liv1.testnet
