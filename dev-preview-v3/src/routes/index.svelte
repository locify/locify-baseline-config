<script lang="ts">
  import {onMount} from "svelte"
  import NearApi from "$lib/near-api";
  import NavBar from "$components/NavBar.svelte";
  import ItemKeys from "$components/ItemKeys.svelte";
  import ModelForm from "$components/ModelForm.svelte";

  type ConnectionState = 'init' | 'disconnected' | 'connected'
  let isConnected: ConnectionState = 'init'

  const random = (min, max) => Math.floor(Math.random() * (max - min)) + min;

  let allKeys = "not set"
  let item_id = "not set"
  let model = "Last Interaction"
  let in_game_ad_clicks = 0
  let google_links = 0
  let pop_up_ads = 0
  let video_ads = 0
  let banner_ads = 0

  let nearApi!: NearApi
  onMount(async () => {
    nearApi = await NearApi.init()
    checkConnection()
  })

  function checkConnection() {
    if (nearApi.isConnected()) {
      isConnected = 'connected'
    } else {
      isConnected = 'disconnected'
    }
    console.log(isConnected)
  }

  const walletConnect = async () => {
    await nearApi.walletConnect()
  }
  const walletDisconnect = () => {
    nearApi.walletDisconnect()
    checkConnection()
  }

  function getAccountName(): string {
    return nearApi.accountName()
  }

  const randomFill = () => {
    in_game_ad_clicks = random(8000, 20000)
    google_links = random(8000, 20000)
    pop_up_ads = random(8000, 20000)
    video_ads = random(8000, 20000)
    banner_ads = random(8000, 20000)
  }

  const getAllKeys = async () => {
    const res = await nearApi.getKeys()
    console.log(`res: ${res}`)
    if (res.length > 0) {
      allKeys = res
    }
  }

  const getItem = async () => {
    const res = await nearApi.getItem(item_id)
    console.log(`res: ${res}`)
    if (res !== 'not found') {
      const val = JSON.parse(res) as {
        item_id: string,
        model: string,
        in_game_ad_clicks: number,
        google_links: number,
        pop_up_ads: number,
        video_ads: number,
        banner_ads: number
      }
      item_id = val.item_id
      model = val.model
      in_game_ad_clicks = val.in_game_ad_clicks
      google_links = val.google_links
      pop_up_ads = val.pop_up_ads
      video_ads = val.video_ads
      banner_ads = val.banner_ads
    }
  }
  const addItem = async () => {
    await nearApi.addItem(item_id,
      model,
      in_game_ad_clicks,
      google_links,
      pop_up_ads,
      video_ads,
      banner_ads
    )
  }

</script>
<NavBar isConnected={isConnected} getAccountName={getAccountName} walletConnect="{walletConnect}"
        walletDisconnect="{walletDisconnect}"/>

<ItemKeys isConnected={isConnected} allKeys="{allKeys}" getAllKeys="{getAllKeys}"/>
<ModelForm
  isConnected="{isConnected}"
  bind:item_id={item_id}
  bind:model="{model}"
  bind:in_game_ad_clicks={in_game_ad_clicks}
  bind:google_links={google_links}
  bind:pop_up_ads={pop_up_ads}
  bind:video_ads={video_ads}
  bind:banner_ads={banner_ads}
  randomFill={randomFill}
  getItem={getItem}
  addItem={addItem}
/>