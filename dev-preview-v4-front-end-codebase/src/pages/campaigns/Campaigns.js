import React from 'react';
import {
    addDeposit, loginNearWallet,
    registerAdvertiser,
    registerPublisher,
    useNearWalletDispatch,
    useNearWalletState, viewPlayerByAccount,
    startAuction, viewAuctions, sendBid,
} from "../../context/NearWalletContext";
import {Button, CircularProgress, Divider, IconButton, Stack, TextField, Typography} from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import Box from "@mui/material/Box";

export default function Campaign() {
    var nearWalletState = useNearWalletState();
    var nearWalletDispatch = useNearWalletDispatch();

    var [bidFloor, setBidFloor] = React.useState('1')
    var [bidPrice, setBidPrice] = React.useState('1')
    var [bidAuctionId, setBidAuctionId] = React.useState('')

    var [auctionId] = React.useState(() => crypto.randomUUID())
    var [bidId] = React.useState(() => crypto.randomUUID())

    var [addUnitsId] = React.useState(() => crypto.randomUUID())

    // bid_request: getBidRequest('123', davePlayerId, bidfloor.toString(), "240", "400")
    // connect with ad-units

    React.useEffect(() => {
        if (nearWalletState.wallet.isSignedIn()) {
            if (nearWalletState.playerInfo === 'not-set') {
                viewPlayerByAccount(nearWalletDispatch, nearWalletState.contract, nearWalletState.currentAccount.accountId)
            }
        }
    }, [])

    React.useEffect(() => {
        if (nearWalletState.wallet.isSignedIn()) {
            if (nearWalletState.auctions === 'not-set') {
                viewAuctions(nearWalletDispatch, nearWalletState.contract, nearWalletState.playerInfo.id)
            }
        }
    }, [nearWalletState.playerInfo])

    const handleBidFloor = (event) => {
        if (event.target.value.length > 0) {
            const res = parseInt(event.target.value, 10)
            if (!isNaN(res)) {
                setBidFloor(res.toString());
            }
        } else {
            setBidFloor('')
        }
    }
    const handleBidPrice = (event) => {
        if (event.target.value.length > 0) {
            const res = parseInt(event.target.value, 10)
            if (!isNaN(res)) {
                setBidPrice(res.toString());
            }
        } else {
            setBidPrice('')
        }
    }
    const handleBidAuctionId = (event) => {
        if (event.target.value.length > 0) {
            setBidAuctionId(event.target.value)
        } else {
            setBidAuctionId('')
        }
    }

    function padTo2Digits(num) {
        return num.toString().padStart(2, '0');
    }

    function formateUnixTime(unixTimestamp) {
        const date = new Date(unixTimestamp * 1000);
        const hours = date.getHours();
        const minutes = date.getMinutes();
        const seconds = date.getSeconds();

// 👇️ Format as hh:mm:ss
        return `${padTo2Digits(hours)}:${padTo2Digits(minutes)}:${padTo2Digits(
            seconds,
        )}`;
    }

    return (
        nearWalletState.wallet.isSignedIn() ?
            <>{nearWalletState.isLoading
                ? <CircularProgress/>
                : nearWalletState.playerInfo === 'not set' ?
                    <Typography>Loading...</Typography>
                    : nearWalletState.playerInfo === 'not-found' ?
                        <Typography>
                            Player not registered
                        </Typography>
                        : (nearWalletState.playerInfo.player_type === 'Publisher'
                                ? <Stack spacing={2}> // publisher block
                                    <Typography variant="h5">Start auction:</Typography>
                                    <Typography>auction id: {auctionId}</Typography>
                                    <Typography>player id: {nearWalletState.playerInfo.id}</Typography>
                                    <Stack alignItems={'center'} spacing={2} direction={'row'}>
                                        <Typography
                                            variant="body">bidFloor: </Typography>
                                        <TextField id="bidFloor" size={'small'} label="bid floor"
                                                   variant="standard"
                                                   defaultValue={'1'}
                                                   value={bidFloor}
                                                   onChange={handleBidFloor}
                                        />
                                    </Stack>
                                    <Typography>add units: (not connected now): {addUnitsId}</Typography>
                                    <Button variant={'contained'}
                                            color={'primary'}
                                            disabled={bidFloor === '' || bidFloor === '0'}
                                            onClick={() => startAuction(nearWalletDispatch, auctionId, bidFloor)}
                                    >Start auction</Button>
                                </Stack>
                                : <Stack spacing={2}> // advertiser block
                                    <Typography variant="h5">Send bid:</Typography>
                                    <Typography>bid id: {bidId}</Typography>
                                    <Typography>player id: {nearWalletState.playerInfo.id}</Typography>
                                    <Stack alignItems={'center'} spacing={2} direction={'row'}>
                                        <Typography
                                            variant="body">price: </Typography>
                                        <TextField id="bidPrice" size={'small'} label="bid price"
                                                   variant="standard"
                                                   defaultValue={'1'}
                                                   value={bidPrice}
                                                   onChange={handleBidPrice}
                                        />
                                    </Stack>
                                    <Stack alignItems={'center'} spacing={2} direction={'row'}>
                                        <Typography
                                            variant="body">auction id: </Typography>
                                        <TextField id="bidAuctionId" size={'small'} label="bid auction id"
                                                   variant="standard"
                                                   defaultValue={'1'}
                                                   value={bidAuctionId}
                                                   onChange={handleBidAuctionId}
                                        />
                                    </Stack>
                                    <Button variant={'contained'}
                                            color={'primary'}
                                            disabled={bidFloor === '' || bidFloor === '0'}
                                            onClick={() => sendBid(nearWalletDispatch, bidAuctionId, bidFloor, [])}
                                    >Send bid</Button>
                                </Stack>
                        )
            }
                <Box sx={{py: 5}}><Divider></Divider></Box>
                {nearWalletState.isLoading
                    ? <CircularProgress/>
                    : nearWalletState.auctions === 'not-set' ?
                        <Typography>Loading...</Typography>
                        : nearWalletState.auctions === 'not-found' ?
                            <Typography>
                                Auctions not registered
                            </Typography>
                            : (
                                <Stack spacing={2}>
                                    <Typography variant="h5">Current auctions: </Typography>
                                    <Typography variant="h6">Count: {nearWalletState.auctions.length} </Typography>
                                    {nearWalletState.auctions.map((auction) => (
                                        <>
                                            <Typography>Id: {auction.auction_id}</Typography>
                                            <Typography>winner: {auction.winner === '?' ? 'not set' : auction.winner} </Typography>
                                            <Typography>start: {formateUnixTime(auction.start_at)} </Typography>
                                            <Typography>end: {formateUnixTime(auction.end_at)} </Typography>
                                            <Typography>bids count: {auction.bid_responses.length} </Typography>
                                        </>
                                    ))}
                                </Stack>
                            )
                }
            </>
            : <Button variant={'contained'}
                      onClick={() => loginNearWallet(nearWalletDispatch)}
            >Near Login</Button>
    )
}