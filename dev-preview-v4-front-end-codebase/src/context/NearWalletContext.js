import React from "react";
import Big from "big.js";
import {getBidRequest} from "./bidRequest";
import {getBidResponse} from "./bidResponse";

var NearWalletStateContext = React.createContext();
var NearWalletDispatchContext = React.createContext();

function userReducer(state, action) {
    switch (action.type) {
        case "NEAR_LOGIN":
            console.log('login near start')
            state.wallet.requestSignIn();
            return {...state, isLoading: true};
        case "NEAR_LOGOUT":
            console.log('dispatch near_logout');
            state.wallet.signOut();
            return {...state, isLoading: true};
        case "SET_LOADING":
            return {...state, isLoading: true};
        case "UNSET_LOADING":
            return {...state, isLoading: false};
        case "GET_PLAYER_INFO":
            return {...state};
        case "SET_PLAYER_ID":
            console.log(`set player: ${action.payload}`)
            return {...state, playerInfo: action.payload, isLoading: false}
        case "ADD_DEPOSIT":
            console.log(`amount: ${action.payload}`)
            state.contract.add_deposit({
                args: {
                    player_id: state.playerInfo.id
                },
                amount: Big(action.payload)
                    .times(10 ** 24)
                    .toFixed()
            });
            return {...state}
        case "START_AUCTION":
            state.contract.start_auction({
                args: {
                    bid_request: getBidRequest(action.payload.auctionId, state.playerInfo.id, action.payload.bidfloor, "240", "400")
                }
            })
            return {...state, isLoading: true}
        case "SET_AUCTIONS":
            return {...state, auctions: action.payload, isLoading: false}
        case "SEND_BID":
            state.contract.add_player_bid({
                args: {
                    auction_id: action.payload.auctionId,
                    bid_response: getBidResponse(state.playerInfo.id, action.payload.bidPrice, "240", "400")
                }
            })
            return {...state, isLoading: true}
        default: {
            throw new Error(`Unhandled action type: ${action.type}`);
        }
    }
}

function NearWalletProvider({contract, currentAccount, nearConfig, wallet, children}) {
    var [state, dispatch] = React.useReducer(userReducer, {
        isLoading: false,
        playerInfo: 'not-set',
        auctions: 'not-set',
        contract,
        currentAccount,
        nearConfig,
        wallet
    });

    return (
        <NearWalletStateContext.Provider value={state}>
            <NearWalletDispatchContext.Provider value={dispatch}>
                {children}
            </NearWalletDispatchContext.Provider>
        </NearWalletStateContext.Provider>
    );
}

function useNearWalletState() {
    var context = React.useContext(NearWalletStateContext);
    if (context === undefined) {
        throw new Error("useUserState must be used within a UserProvider");
    }
    return context;
}

function useNearWalletDispatch() {
    var context = React.useContext(NearWalletDispatchContext);
    if (context === undefined) {
        throw new Error("useUserDispatch must be used within a UserProvider");
    }
    return context;
}

export {
    NearWalletProvider,
    useNearWalletState,
    useNearWalletDispatch,
    loginNearWallet,
    signOutNearWallet,
    getPlayerInfo,
    registerAdvertiser,
    registerPublisher,
    viewPlayerByAccount,
    addDeposit,
    startAuction,
    viewAuctions,
    sendBid
};

// ###########################################################

function loginNearWallet(dispatch, login, password, history, setIsLoading, setError) {
    dispatch({type: "NEAR_LOGIN"});
}

function signOutNearWallet(dispatch, history) {
    console.log("logout near wallet");
    dispatch({type: "NEAR_LOGOUT"});
}

function getPlayerInfo(dispatch) {
    dispatch({type: "GET_PLAYER_INFO"})
}

function registerAdvertiser(dispatch, contract, accountId) {
    dispatch({type: "SET_LOADING"})
    contract.player_add({
        args: {
            account_id: accountId,
            player_type: 'Advertiser'
        }
    })
}

function registerPublisher(dispatch, contract, accountId) {
    dispatch({type: "SET_LOADING"})
    contract.player_add({
        args: {
            account_id: accountId,
            player_type: 'Publisher'
        }
    })
}

function addDeposit(dispatch, amount) {
    console.log(`amount: ${amount}`)
    dispatch({type: "ADD_DEPOSIT", payload: amount})
}

function startAuction(dispatch, auctionId, bidfloor) {
    console.log(`auctionId: ${auctionId}, bidfloor: ${bidfloor}`)
    dispatch({type: "START_AUCTION", payload: {auctionId, bidfloor}})

}

function sendBid(dispatch, auctionId, bidPrice) {
    dispatch({type: "SEND_BID", payload: {auctionId, bidPrice}})
}

function viewAuctions(dispatch, contract) {
    dispatch({type: "SET_LOADING"})
    contract.view_auctions({})
        .then((auctions) => {
            if (auctions && auctions.length > 0) {
                console.log('auctions found')
                console.log(JSON.stringify(auctions, null, '\t'))
                dispatch({type: "SET_AUCTIONS", payload: auctions})
            } else {
                console.log('auctions not found')
                dispatch({type: "SET_AUCTIONS", payload: 'not-found'})
            }
        })
}

function viewPlayerByAccount(dispatch, contract, accountId) {
    dispatch({type: "SET_LOADING"})
    contract.view_player_by_account({
        account_id: accountId
    })
        .then((playerInfo) => {
                if (playerInfo) {
                    console.log(`playerInfo: ${JSON.stringify(playerInfo, null, '\t')}`)
                    dispatch({type: 'SET_PLAYER_ID', payload: playerInfo})
                } else {
                    console.log('playerInfo not found')
                    dispatch({type: 'SET_PLAYER_ID', payload: 'not-found'})
                }
            }
        )
}
