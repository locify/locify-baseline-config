#!/bin/bash

export NEAR_ACCT=rtb_v1.liv1.testnet && \
near call $NEAR_ACCT get_players '{}' --accountId liv1.testnet