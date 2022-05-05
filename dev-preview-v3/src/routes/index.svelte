<script lang="ts">
  import {onMount} from "svelte"
  import NearApi from "$lib/near-api";
  import NavBar from "$components/NavBar.svelte";
  import ItemKeys from "$components/ItemKeys.svelte";
  import ModelForm from "$components/ModelForm.svelte";
  import {random} from "$utils/utils";

  type ConnectionState = 'init' | 'disconnected' | 'connected'
  type AttributesT = {
    in_game_ad_clicks: number
    google_links: number
    pop_up_ads: number
    video_ads: number
    banner_ads: number
  }
  type CombinationsT = {
    c123: number
    c234: number
    c345: number
  }
  let isConnected: ConnectionState = 'init'

  const minVal = 8000
  const maxVal = 20000
  let allKeys = "not set"
  let item_id = "not set"
  let model = "First Interaction"
  let fi_in_game_ad_clicks = random(minVal, maxVal)
  let fi_google_links = random(minVal, maxVal)
  let fi_pop_up_ads = random(minVal, maxVal)
  let fi_video_ads = random(minVal, maxVal)
  let fi_banner_ads = random(minVal, maxVal)
  let li_in_game_ad_clicks = random(minVal, maxVal)
  let li_google_links = random(minVal, maxVal)
  let li_pop_up_ads = random(minVal, maxVal)
  let li_video_ads = random(minVal, maxVal)
  let li_banner_ads = random(minVal, maxVal)
  let c123 = random(minVal, maxVal)
  let c234 = random(minVal, maxVal)
  let c345 = random(minVal, maxVal)

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
    fi_in_game_ad_clicks = random(minVal, maxVal)
    fi_google_links = random(minVal, maxVal)
    fi_pop_up_ads = random(minVal, maxVal)
    fi_video_ads = random(minVal, maxVal)
    fi_banner_ads = random(minVal, maxVal)
    li_in_game_ad_clicks = random(minVal, maxVal)
    li_google_links = random(minVal, maxVal)
    li_pop_up_ads = random(minVal, maxVal)
    li_video_ads = random(minVal, maxVal)
    li_banner_ads = random(minVal, maxVal)
    c123 = random(minVal, maxVal)
    c234 = random(minVal, maxVal)
    c345 = random(minVal, maxVal)
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
        first_interaction: AttributesT,
        last_interaction: AttributesT,
        shapley_value: CombinationsT
      }
      item_id = val.item_id
      fi_in_game_ad_clicks = val.first_interaction.in_game_ad_clicks
      fi_google_links = val.first_interaction.google_links
      fi_pop_up_ads = val.first_interaction.pop_up_ads
      fi_video_ads = val.first_interaction.video_ads
      fi_banner_ads = val.first_interaction.banner_ads
      li_in_game_ad_clicks = val.last_interaction.in_game_ad_clicks
      li_google_links = val.last_interaction.google_links
      li_pop_up_ads = val.last_interaction.pop_up_ads
      li_video_ads = val.last_interaction.video_ads
      li_banner_ads = val.last_interaction.banner_ads
      c123 = val.shapley_value.c123
      c234 = val.shapley_value.c234
      c345 = val.shapley_value.c345
    }
  }
  const addItem = async () => {
    await nearApi.addItem(
      item_id,
      fi_in_game_ad_clicks,
      fi_google_links,
      fi_pop_up_ads,
      fi_video_ads,
      fi_banner_ads,
      li_in_game_ad_clicks,
      li_google_links,
      li_pop_up_ads,
      li_video_ads,
      li_banner_ads,
      c123,
      c234,
      c345,
    )
  }

</script>
<NavBar isConnected={isConnected} getAccountName={getAccountName} walletConnect="{walletConnect}"
        walletDisconnect="{walletDisconnect}"/>

<ItemKeys isConnected={isConnected} allKeys="{allKeys}" getAllKeys="{getAllKeys}"/>
<ModelForm
  isConnected="{isConnected}"
  bind:item_id="{item_id}"
  bind:fi_in_game_ad_clicks={fi_in_game_ad_clicks}
  bind:fi_google_links={fi_google_links}
  bind:fi_pop_up_ads={fi_pop_up_ads}
  bind:fi_video_ads={fi_video_ads}
  bind:fi_banner_ads={fi_banner_ads}
  bind:li_in_game_ad_clicks={li_in_game_ad_clicks}
  bind:li_google_links={li_google_links}
  bind:li_pop_up_ads={li_pop_up_ads}
  bind:li_video_ads={li_video_ads}
  bind:li_banner_ads={li_banner_ads}
  bind:c123={c123}
  bind:c234={c234}
  bind:c345={c345}
  randomFill={randomFill}
  getItem={getItem}
  addItem={addItem}
/>