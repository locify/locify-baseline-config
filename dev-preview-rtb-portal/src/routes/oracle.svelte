<script lang="ts">
  import {onMount} from "svelte"
  import NearApi from "$lib/near-api";
  import NavBar from "$components/NavBar.svelte";
  import ItemKeys from "$components/ItemKeys.svelte";
  import ModelForm from "$components/ModelFormBidTemplate.svelte";
  import {random} from "$utils/utils";
  import Debugger from 'svelte-debugger';
  import Big from 'big.js';

  import {
    adname,
    bidprice,
    cryptotype,
    filename,
    tagname,
    title,
    pname,
    gaming, tmpl,
  } from '../stores/store';


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

  let fName
  filename.subscribe(value => fName = value)
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

  let adnameValue
  adname.subscribe(value => {
    console.log(`subscribe adname: ${value}`)
    adnameValue = value
  })
  let bidPriceValue
  bidprice.subscribe(value => {
    console.log(`subscribe bid: ${value}`)
    bidPriceValue = value
  })
  let tmplValue
  let makeVal = 'pc'
  let modelVal = ""
  let osVal = "Intel Mac OS"
  let osvVal = "X 10_6_8"
  let uaVal = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_6_8) AppleWebKit/534.59.10 (KHTML, like Gecko) Version/5.1.9 Safari/534.59.10"
  tmpl
    .subscribe(value => {
      console.log(`subscribe tmpl: ${value}`)
      tmplValue = value
      switch (tmplValue) {
        case 'Android Ads': {
          makeVal = "Samsung"
          modelVal = "SCH-I535"
          osVal = "Android"
          osvVal = "4.3"
          uaVal = "Mozilla/5.0 (Linux; U; Android 4.3; en-us; SCH-I535 Build/JSS15J) AppleWebKit/534.30 (KHTML, like Gecko) Version/4.0 Mobile Safari/534.30"
          break
        }
        case 'iOS Ads': {
          makeVal = "Apple"
          modelVal = "iPhone"
          osVal = "iOS"
          osvVal = "7.0"
          uaVal = "Mozilla/5.0 (iPhone; CPU iPhone OS 7_0 like Mac OS X) AppleWebKit/536.26 (KHTML, like Gecko) GSA/3.2.0.25255 Mobile/11A465 Safari/8536.25"
          break
        }
        default: {
          break
        }

      }
    })

  let cryptotypeVal
  cryptotype.subscribe(value => cryptotypeVal = value)

  let tagnameVal
  tagname.subscribe(value => tagnameVal = value)

  let titleVal
  title.subscribe(value => titleVal = value)

  let pnameVal
  pname.subscribe(value => pnameVal = value)

  let gamingVal
  gaming.subscribe(value => gamingVal = value)

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

  const getItemRubicon = async () => {
    const res = await nearApi.getItem(item_id)
    console.log(`res rubicon: ${res}`)
    if (res !== 'not found') {
      const val = JSON.parse(res) as any
      console.table(val)
      jsonResponse = JSON.stringify(val)
      tabId = 1
    }
  }

  const completePayment = async () => {
    const ATTACHED_TOKENS = Big(0)
      .times(10 ** 24)
      .toFixed(); // NEAR --> yoctoNEAR conversion
    await nearApi.completePayment(item_id, ATTACHED_TOKENS)
  }
  const addItemRubicon = async () => {
    console.log(`oracle: ${adnameValue}; ${bidPriceValue}`)

    let bunner = {
      w: 300,
      h: 250,
      pos: 1,
      battr: [9, 1, 14014, 3, 13],
      api: [3, 100],
      topframe: 1
    }
    let impItem = {
      id: "2",
      tagid: "123",
      iframebuster: ["ALL"],
      banner: bunner
    }
    let publisher = {
      id: "8428"
    }
    let extApp = {
      storerating: 1,
      appstoreid: "457637357"
    }
    let extGeo = {
      latlonconsent: 1
    }
    let geo = {
      country: "USA",
      region: "PA",
      tp: 3,
      ext: extGeo
    }
    let extUser = {
      sessiondepth: 207
    }
    const ATTACHED_GAS = Big(1)
      .times(10 ** 16)
      .toFixed(); // NEAR --> 10k picoNEAR conversion
    const ATTACHED_TOKENS = Big(0)
      .times(10 ** 24)
      .toFixed(); // NEAR --> yoctoNEAR conversion
    let rubicon = {
      id: item_id,
      adname: adnameValue,
      bidprice: bidPriceValue,
      cryptotype: cryptotypeVal,
      filename: fName,
      tagname: tagnameVal,
      title: titleVal,
      pname: pnameVal,
      gaming: gamingVal,
      tmpl: tmplValue,
      payment: ATTACHED_TOKENS,
      at: 2,
      tmax: 123,
      imp: [impItem],
      app: {
        id: "20625",
        cat: ["IAB1"],
        name: "com.cheezburger.icanhas",
        domain: "http://cheezburger.com",
        privacypolicy: 1,
        publisher: publisher,
        ext: extApp
      },
      device: {
        make: makeVal,
        model: modelVal,
        os: osVal,
        osv: osvVal,
        ua: uaVal,
        ip: "192.168.1.1",
        language: "en",
        devicetype: 1,
        js: 1,
        connectiontype: 3,
        dpidsha1: "F099E6D1C485756C45D1EEACB33C73B55C4BC499",
        carrier: "Verizon Wireless",
        geo: geo,
      },
      user: {
        id: "bd5adc55dcbab4bf090604df4f543d90b09f0c88",
        ext: extUser
      }
    }
    let channel = JSON.stringify(rubicon)
    await nearApi.addItemRubicon(channel)
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

  const handleClick = () => {
    alert(
      "Your Bid is is accepted. Click on Complete Payment to complete the process"
    );
  }

  let tabId = 0

  let jsonResponse = ""
</script>
<NavBar isConnected={isConnected} getAccountName={getAccountName} walletConnect="{walletConnect}"
        walletDisconnect="{walletDisconnect}"/>

<ItemKeys isConnected={isConnected} allKeys="{allKeys}" getAllKeys="{getAllKeys}"/>

<div class="text-sm font-medium text-center text-gray-500 border-b border-gray-200 dark:text-gray-400
  dark:border-gray-700">
  <ul class="flex flex-wrap -mb-px">
    <li class="mr-2">
      <button
        on:click={() => {tabId = 0}}
        class="{tabId === 0 ? 'selected' : 'default'}"
        aria-current="page">Request
      </button>
    </li>
    <li class="mr-2">
      <button
        on:click={() => {tabId = 1}}
        class="{tabId === 1 ? 'selected' : 'default'}"
        aria-current="page">Response
      </button>
    </li>
  </ul>
</div>
{#if tabId === 0}
  <div class="flex flex-wrap justify-center">
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
      getItem={handleClick}
      addItem={handleClick}
      addItemRubicon={addItemRubicon}
      getItemRubicon={getItemRubicon}
    />
  </div>
  <div class="flex flex-wrap justify-between">
    <button class="{(item_id.length === 0 || item_id === 'not set') ? 'btn-disabled' : 'btn-primary'}"
            on:click={addItemRubicon}>Submit the Bid
    </button>
    <button class="{(item_id.length === 0 || item_id === 'not set') ? 'btn-disabled' : 'btn-primary'}"
            on:click={completePayment}>Complete Payment
    </button>
    <button class="{(item_id.length === 0 || item_id === 'not set') ? 'btn-disabled' : 'btn-primary'}"
            on:click={getItemRubicon}>Generate JSON Response
    </button>
  </div>
{:else}
  {#if jsonResponse.length === 0}
    <p>not set</p>
  {:else}
    <Debugger
      data={JSON.parse(jsonResponse)}
      indent={2}
      colorOptions={{ falseColor: '#ff3e00', trueColor: '#40b3ff' }}
    />
    {jsonResponse}
  {/if}
{/if}

<style lang="postcss">
  .selected {
    @apply inline-block p-4 text-blue-600 rounded-t-lg border-b-2 border-blue-600 dark:text-blue-500 dark:border-blue-500
  }

  .default {
    @apply inline-block p-4 rounded-t-lg border-b-2 border-transparent hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300
  }
</style>




