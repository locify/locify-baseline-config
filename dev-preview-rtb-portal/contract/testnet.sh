#!/bin/bash

./build.sh && \
export NEAR_ACCT=advo4.liv1.testnet && \
near delete $NEAR_ACCT liv1.testnet && \
sleep 1 && \
near create-account $NEAR_ACCT --masterAccount liv1.testnet --initialBalance 10 && \
sleep 1 && \
near deploy $NEAR_ACCT --wasmFile ./res/lao.wasm && \
sleep 1 && \
echo "!!! call init contract" && \
near call $NEAR_ACCT init '{"owner_id": "liv1.testnet"}' --accountId liv1.testnet && \
sleep 1
#echo "!!! call add_item [new item]" && \
#near call $NEAR_ACCT add_item "{\"item_id\":\"item_123\",\"first_interaction\":\"{\"in_game_ad_clicks\":12345,\"google_links\":6789,\"pop_up_ads\":10101,\"video_ads\":20202,\"banner_ads\":30303}\",\"last_interaction\":\"{\"in_game_ad_clicks\":54321,\"google_links\":9876,\"pop_up_ads\":40404,\"video_ads\":50505,\"banner_ads\":60606}\",\"shapley_value\":\"{\"c123\":70707,\"c234\":80808,\"c345\":90909}\"}" --accountId liv1.testnet
#echo "!!! call get_item [item]" && \
#near call $NEAR_ACCT get_item '{"item_id": "item_123"}' --accountId liv1.testnet
#echo "!!! call get_all_items" && \
#near call $NEAR_ACCT all_keys '{"paging_start": 0, "paging_size": 0}' --accountId liv1.testnet
