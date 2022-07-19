import React from "react";
import ReactDOM from "react-dom";
import {ThemeProvider} from "@material-ui/styles";
import {CssBaseline} from "@material-ui/core";

import Themes from "./themes";
// import AppRouter from './router/AppRouter.js';
import App from "./components/App";
import {LayoutProvider} from "./context/LayoutContext";
import {UserProvider} from "./context/UserContext";
import * as nearAPI from "near-api-js";
import {NearWalletProvider} from "./context/NearWalletContext";

window.Buffer = window.Buffer || require("buffer").Buffer;

const CONTRACT_NAME = 'rtb_v10.liv1.testnet';

function getConfig() {
    return {
        networkId: 'testnet',
        nodeUrl: 'https://rpc.testnet.near.org',
        contractName: CONTRACT_NAME,
        walletUrl: 'https://wallet.testnet.near.org',
        helperUrl: 'https://helper.testnet.near.org'
    };
}

function getMethods() {
    return ({
        viewMethods: ['view_accounts_info', 'view_players', 'view_player_by_id', 'view_player_by_account', 'view_auctions', 'view_auction_by_id'],
        changeMethods: ['init', 'clear_players', 'player_add', 'player_activate', 'add_deposit', 'clear_auctions', 'start_auction', 'add_player_bid', 'check_auction_state',],
    })
}

// Initializing contract
async function initContract() {
    const nearConfig = getConfig();
    //const nearMethods = getMethods();

    // Initializing connection to the NEAR TestNet
    const near = await nearAPI.connect({
        deps: {
            keyStore: new nearAPI.keyStores.BrowserLocalStorageKeyStore()
        },
        ...nearConfig
    });

    // Needed to access wallet
    const wallet = new nearAPI.WalletConnection(near);

    // Load in account data
    let currentAccount;
    if (wallet.getAccountId()) {
        currentAccount = {
            accountId: wallet.getAccountId(),
            balance: (await wallet.account().state()).amount,
            lockedBalance: (await wallet.account().state()).locked
        };
    }

    // Initializing our contract APIs by contract name and configuration
    const contract = await new nearAPI.Contract(
        wallet.account(),
        nearConfig.contractName,
        getMethods(),
    );

    return {contract, currentAccount, nearConfig, wallet};
}

window.nearInitPromise = initContract()
    .then(({contract, currentAccount, nearConfig, wallet}) => {
        ReactDOM.render(
            <LayoutProvider>
                <NearWalletProvider
                    contract={contract}
                    currentAccount={currentAccount}
                    nearConfig={nearConfig}
                    wallet={wallet}
                >
                    <UserProvider>
                        <ThemeProvider theme={Themes.default}>
                            <CssBaseline/>
                            <App/>
                        </ThemeProvider>
                    </UserProvider>
                </NearWalletProvider>
            </LayoutProvider>,
            document.getElementById('root')
        );
    });

