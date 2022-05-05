#!/bin/bash

./build.sh && \
export NEAR_ACCT=advo3-client.liv1.testnet && \
#near delete $NEAR_ACCT liv1.testnet && \
sleep 1 && \
near create-account $NEAR_ACCT --masterAccount liv1.testnet --initialBalance 10 && \
sleep 1 && \
near deploy $NEAR_ACCT --wasmFile ./res/lao_client.wasm && \
sleep 1 && \
echo "!!! call init contract" && \
near call $NEAR_ACCT init '{}' --accountId liv1.testnet && \
sleep 1 && \
echo "!!! call get_item_oracle [new item]" && \
near call $NEAR_ACCT get_item_string '{"ext_contract_id": "advo3.liv1.testnet"}' --accountId liv1.testnet --gas 200000000000000
near call $NEAR_ACCT get_item_result '{"ext_contract_id": "advo3.liv1.testnet", "item_id": "item_124"}' --accountId liv1.testnet --gas 200000000000000
