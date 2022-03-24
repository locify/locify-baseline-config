import getConfig from './config/near'
import * as nearAPI from 'near-api-js'
import { Base64 } from 'js-base64'
import axios from 'axios'
import Big from 'big.js'

const BOATLOAD_OF_GAS = Big(3)
    .times(10 ** 13)
    .toFixed()

class Near {
    constructor() {
        this.wallet = {}
        this.currentUser = null
        this.nearConfig = {}
        this.signer = {}
        this.token = null
        this.contractWalletNft = null
        this.contractParasNft = null
        this.pubKey = null
        this.balance = null
    }

    async authToken() {
        if (this.currentUser) {
            const accountId = this.currentUser.accountId
            const arr = new Array(accountId)
            for (let i = 0; i < accountId.length; i++) {
                arr[i] = accountId.charCodeAt(i)
            }
            const msgBuf = new Uint8Array(arr)
            const signedMsg = await this.signer.signMessage(
                msgBuf,
                this.wallet._authData.accountId,
                this.wallet._networkId
            )
            const pubKey = Buffer.from(signedMsg.publicKey.data).toString('hex')
            this.pubKey = pubKey
            const signature = Buffer.from(signedMsg.signature).toString('hex')
            const payload = [accountId, pubKey, signature]
            this.token = Base64.encode(payload.join('&'))
        }
    }

    async init() {
        const { keyStores, connect, WalletConnection, InMemorySigner } = nearAPI
        const keyStore = new keyStores.BrowserLocalStorageKeyStore()
        const nearConfig = {
            ...getConfig(process.env.APP_ENV || 'development'),
            keyStore,
        }
        const near = await connect(nearConfig)
        const wallet = new WalletConnection(near)

        let currentUser
        if (wallet.getAccountId()) {
            currentUser = {
                accountId: wallet.getAccountId(),
                balance: await wallet.account().getAccountBalance(),
            }
        }

        const contractWalletNftName = 'nft_v2.qstn-v2.testnet'
        this.contractWalletNft = await new nearAPI.Contract(
            wallet.account(),
            contractWalletNftName,
            {
                viewMethods: [''],
                changeMethods: ['nft_mint', 'nft_transfer'],
                signer: wallet.getAccountId(),
            }
        )
        const contractParasName = 'paras-token-v2.testnet'
        this.contractParasNft = await new nearAPI.Contract(
            wallet.account(),
            contractParasName,
            {
                // will add more later
                viewMethods: [],
                changeMethods: ['nft_create_series'],
                sender: wallet.getAccountId(),
            }
        )
        const contractParasMarketName = 'paras-marketplace-v2.testnet'

        this.wallet = wallet
        this.currentUser = currentUser
        this.nearConfig = nearConfig
        this.signer = new InMemorySigner(keyStore)
        await this.authToken()
        axios.defaults.headers.common['Authorization'] = this.token
    }

    signIn() {
        this.wallet.requestSignIn(this.nearConfig.contractName, 'QSTN v2')
    }

    signOut() {
        this.wallet.signOut()
        window.location.replace(
            window.location.origin + window.location.pathname
        )
    }

    getKey() {
        return this.pubKey
    }

    mintWalletNft(title, description, media) {
        const media_url = `https://${media}.ipfs.dweb.link/`
        // const media_url = `https://${data.value.cid}.ipfs.dweb.link/${data.value.files[0].name}`
        const receiver_id = this.currentUser.accountId
        console.log('media url: ' + media_url)
        console.log('user: ' + receiver_id)
        if (this.contractWalletNft) {
            this.contractWalletNft
                .nft_mint(
                    {
                        // @ts-ignore
                        receiver_id: receiver_id,
                        token_metadata: {
                            title: title,
                            description: description,
                            media: media_url,
                            copies: 1,
                        },
                    },
                    BOATLOAD_OF_GAS,
                    Big(0.1)
                        .times(10 ** 24)
                        .toFixed()
                )
                .then((res) => console.log('result', res))
        }
    }

    mintParasNft(title, description, media) {
        const receiver_id = this.currentUser.accountId
        console.log('user: ' + receiver_id)
        if (this.contractParasNft) {
            this.contractParasNft.nft_create_series(
                {
                    token_metadata: {
                        title: title,
                        media: media,
                        reference: media,
                        copies: 1,
                    },
                    price: null,
                    royalty: {
                        [receiver_id]: 1,
                    },
                },
                BOATLOAD_OF_GAS,
                Big(0.1)
                    .times(10 ** 24)
                    .toFixed()
            )
        }
    }

    isLoggedIn() {
        if (this.wallet.isSignedIn) {
            return this.wallet.isSignedIn()
        }
    }

    getAccount() {
        return this.currentUser
    }
}

export default new Near()
