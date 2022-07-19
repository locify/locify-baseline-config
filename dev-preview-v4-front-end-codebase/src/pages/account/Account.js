import React from 'react';

import {
    addDeposit,
    loginNearWallet,
    registerAdvertiser, registerPublisher,
    useNearWalletDispatch,
    useNearWalletState, viewPlayerByAccount
} from "../../context/NearWalletContext";
import {Button, CircularProgress, IconButton, Stack, TextField, Typography} from "@mui/material";
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import {formatNearAmount, parseNearAmount} from "near-api-js/lib/utils/format";
import fromExponential from "from-exponential";

export default function Account() {

    var nearWalletState = useNearWalletState();
    var nearWalletDispatch = useNearWalletDispatch();

    var [amount, setAmount] = React.useState('7')

    const handleAmount = (event) => {
        if (event.target.value.length > 0) {
            const res = parseInt(event.target.value, 10)
            if (!isNaN(res)) {
                setAmount(res.toString());
            }
        } else {
            setAmount('')
        }
    }

    React.useEffect(() => {
        if (nearWalletState.wallet.isSignedIn()) {
            if (nearWalletState.playerInfo === 'not-set') {
                viewPlayerByAccount(nearWalletDispatch, nearWalletState.contract, nearWalletState.currentAccount.accountId)
            }
        }
    }, [])

    function formatNear(balance) {
        console.log(`balance: ${balance}`)
        return formatNearAmount(balance, 2)
    }
    return (
        <>
            {nearWalletState.wallet.isSignedIn() ?
                <>{nearWalletState.isLoading ? <CircularProgress/>
                    : nearWalletState.playerInfo === 'not-set' ?
                        <Typography>Loading...</Typography>
                        : nearWalletState.playerInfo === 'not-found' ?
                            <Typography>
                                <Stack spacing={2}>
                                    <Button variant="outlined"
                                            onClick={() => {
                                                registerAdvertiser(nearWalletDispatch, nearWalletState.contract, nearWalletState.currentAccount.accountId)
                                            }}
                                    >Register Advertiser</Button>
                                    <Button variant="outlined"
                                            onClick={() => {
                                                registerPublisher(nearWalletDispatch, nearWalletState.contract, nearWalletState.currentAccount.accountId)
                                            }}
                                    >Register Publisher</Button>
                                </Stack>
                            </Typography>
                            : (
                                <Stack spacing={2}>
                                    <Typography variant="h5">Account
                                        balance: {formatNear(nearWalletState.currentAccount.balance)}</Typography>
                                    <Typography variant="body">id: {nearWalletState.playerInfo.id}</Typography>
                                    <Typography
                                        variant="body">linked_account: {nearWalletState.playerInfo.linked_account}</Typography>
                                    <Typography variant="body">type: {nearWalletState.playerInfo.player_type}</Typography>
                                    <Typography variant="body">status: {nearWalletState.playerInfo.status}</Typography>
                                    <Stack alignItems={'center'} spacing={2} direction={'row'}>
                                        <Typography
                                            variant="body">balance: {(nearWalletState.playerInfo.balance / 10e23).toFixed(2)}</Typography>
                                        <TextField id="amount" size={'small'} label="amount"
                                                   variant="standard"
                                                   defaultValue={'8'}
                                                   value={amount}
                                                   onChange={handleAmount}
                                        />
                                        <IconButton
                                            disabled={amount === ''}
                                            color={amount === '' ? 'error' : 'primary'}
                                            onClick={() => addDeposit(nearWalletDispatch, parseInt(amount, 10))}
                                        ><AddCircleOutlineIcon/></IconButton>
                                    </Stack>
                                    <Typography
                                        variant="body">stakes: {nearWalletState.playerInfo.stakes}</Typography></Stack>
                            )
                }
                </>
                : <Button variant={'contained'}
                          onClick={() => loginNearWallet(nearWalletDispatch)}
                >Near Login</Button>
            }
        </>
    )
}