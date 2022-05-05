import type {ConnectConfig, Contract, Near, WalletConnection} from "near-api-js";

type OracleContractT = Contract & {
    get_item(arg0: ArgsGet): Promise<string>,
    all_keys(): Promise<string>,
    add_item(arg0: ArgsAdd): Promise<void>,
}

class ArgsGet {
    item_id: string

    public constructor(item_id: string) {
        this.item_id = item_id;
    }
}

class ArgsAdd {
    item_id: string
    first_interaction: string
    last_interaction: string
    shapley_value: string

    public constructor(item_id: string,
                       first_interaction: string,
                       last_interaction: string,
                       shapley_value: string,
    ) {
        this.item_id = item_id
        this.first_interaction = first_interaction
        this.last_interaction = last_interaction
        this.shapley_value = shapley_value
    }
}

export default class NearApi {
    private nearApi: any
    private near: Near
    private wallet!: WalletConnection
    private contract!: OracleContractT

    private constructor(nearApi: any, near: Near, wallet: WalletConnection, contract: OracleContractT) {
        this.nearApi = nearApi
        this.near = near
        this.wallet = wallet
        this.contract = contract
    }

    static async init() {
        await import('../utils/near-api-js.js')
        // eslint-disable-next-line  @typescript-eslint/no-explicit-any
        const nearApi = (window as any).nearApi as any
        console.log(nearApi)
        const config: ConnectConfig = {
            helperUrl: "https://helper.testnet.near.org",
            initialBalance: "",
            keyStore: undefined,
            masterAccount: "",
            networkId: "testnet",
            nodeUrl: "https://rpc.testnet.near.org",
            signer: undefined,
            walletUrl: "https://wallet.testnet.near.org",
            headers: {}
        }
        config.keyStore = new nearApi.keyStores.BrowserLocalStorageKeyStore()
        const near = await nearApi.connect(config) as Near
        console.log('connection state')
        console.table(near)
        const wallet = new nearApi.WalletConnection(near) as WalletConnection
        const contract: OracleContractT = new nearApi.Contract(
            wallet.account(),
            "advo3.liv1.testnet",
            {
                viewMethods: ["get_item", "all_keys"],
                changeMethods: ["add_item"],
                sender: wallet.account(),
            }
        )
        return new NearApi(nearApi, near, wallet, contract)
    }

    isConnected(): boolean {
        return !!this.wallet?.isSignedIn();
    }

    async walletConnect(): Promise<void> {
        await this.wallet?.requestSignIn({contractId: "advo3.liv1.testnet"}, 'oracle for Near protocol')
    }

    walletDisconnect() {
        this.wallet?.signOut()
    }

    accountName(): string {
        return this.wallet?.getAccountId() as string
    }

    async getItem(item_id: string): Promise<string> {
        return await this.contract?.get_item({item_id})
    }

    async getKeys(): Promise<string> {
        return await this.contract?.all_keys()
    }

    async addItem(
        item_id: string,
        fi_in_game_ad_clicks: number,
        fi_google_links: number,
        fi_pop_up_ads: number,
        fi_video_ads: number,
        fi_banner_ads: number,
        li_in_game_ad_clicks: number,
        li_google_links: number,
        li_pop_up_ads: number,
        li_video_ads: number,
        li_banner_ads: number,
        c123: number,
        c234: number,
        c345: number,
    ): Promise<void> {
        const first_interaction = JSON.stringify({
            in_game_ad_clicks: fi_in_game_ad_clicks,
            google_links: fi_google_links,
            pop_up_ads: fi_pop_up_ads,
            video_ads: fi_video_ads,
            banner_ads: fi_banner_ads
        })
        const last_interaction = JSON.stringify({
            in_game_ad_clicks: li_in_game_ad_clicks,
            google_links: li_google_links,
            pop_up_ads: li_pop_up_ads,
            video_ads: li_video_ads,
            banner_ads: li_banner_ads
        })
        const shapley_value = JSON.stringify({
            c123,
            c234,
            c345
        })
        console.log(`add item: ${item_id} 
        ${first_interaction} 
        ${last_interaction} 
        ${shapley_value}`)
        return await this.contract?.add_item({
            item_id,
            first_interaction,
            last_interaction,
            shapley_value
        })
    }
}