import React from 'react';
import {Link, Stack, Typography} from "@mui/material";

export default function Transactions() {
    return (
        <Stack spacing={2}>
            <Typography variant={'h4'}>Transaction</Typography>
            <Link href="https://explorer.testnet.near.org/accounts/rtb_v10.liv1.testnet" variant={'h6'}>View the smart-contract transactions details with Near-explorer</Link>
        </Stack>
    )
}