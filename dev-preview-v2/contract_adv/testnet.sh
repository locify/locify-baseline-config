#!/bin/bash

./build.sh && \
export NEAR_ACCT=adv1.liv1.testnet && \
near delete $NEAR_ACCT liv1.testnet && \
sleep 1 && \
near create-account $NEAR_ACCT --masterAccount liv1.testnet --initialBalance 10 && \
sleep 1 && \
near deploy $NEAR_ACCT --wasmFile ./res/lad.wasm && \
sleep 1 && \
echo "!!! call init contract" && \
near call $NEAR_ACCT init '{"owner_id": "liv1.testnet"}' --accountId liv1.testnet && \
sleep 1 && \
echo "!!! call add_banner [new message]" && \
near call $NEAR_ACCT add_banner '{"banner_uuid": "123", media_url: "media url field", "banner_page_url": "456", "banner_width": "b_width", "banner_height": "b_height", "banner_subscription_charge": "b_charge"}' --accountId 3ugen.testnet
sleep 1 && \
near call $NEAR_ACCT all_banner '{}' --accountId 3ugen.testnet
sleep 1 && \
near call $NEAR_ACCT add_adv '{"adv_uuid": "123", "banner_uuid": "123", "adv_image_url": "img_url", "adv_forwarding_url": "adv_forwarding_url"}' --accountId 3ugen.testnet --deposit 10
sleep 1 && \
near call $NEAR_ACCT all_advs '{}' --accountId 3ugen.testnet
