<script lang="ts">
  import Attribute from "./Attribute.svelte";

  export let isConnected
  export let item_id
  export let fi_in_game_ad_clicks
  export let fi_google_links
  export let fi_pop_up_ads
  export let fi_video_ads
  export let fi_banner_ads
  export let li_in_game_ad_clicks
  export let li_google_links
  export let li_pop_up_ads
  export let li_video_ads
  export let li_banner_ads
  export let c123
  export let c234
  export let c345
  export let randomFill
  export let getItem
  export let addItem
  let modelOptions = [
    {id: 0, text: "First Interaction"},
    {id: 1, text: "Last Interaction"},
    {id: 2, text: "Shapley Value"},
  ]
  let selected = modelOptions[0]
</script>
{#if isConnected === 'connected'}
  <div class="py-12">
    <h3 class="text-2xl font-bold">Attribution models</h3>
    <div class="mt-8 max-w-md">
      <button class="btn-primary" on:click={randomFill}>Random</button>

      <div class="grid grid-cols-1 gap-6">
        <Attribute attrId='item_id' attrType='text' bind:value={item_id}/>
        <label class="block">
          <span class="text-gray-700">Choose a model:</span>
          <select class="form-select block w-full mt-1" bind:value={selected}>
            <option value={modelOptions[0]}>
              {modelOptions[0].text}
            </option>
            <option value={modelOptions[1]}>
              {modelOptions[1].text}
            </option>
            <option value={modelOptions[2]}>
              {modelOptions[2].text}
            </option>
            <!--{#each modelOptions as model}
              <option value={model}>
                {model.text}
              </option>
            {/each}-->
          </select>
        </label>
        {#if selected.id === 0}
          <Attribute attrId='In Game Ad Click' attrType='number' bind:value={fi_in_game_ad_clicks}/>
          <Attribute attrId='Google Links' attrType='number' bind:value={fi_google_links}/>
          <Attribute attrId='Pop-Up Ads ' attrType='number' bind:value={fi_pop_up_ads}/>
          <Attribute attrId='Video Ads' attrType='number' bind:value={fi_video_ads}/>
          <Attribute attrId='Banner Ads' attrType='number' bind:value={fi_banner_ads}/>
        {:else if selected.id === 1}
          <Attribute attrId='In Game Ad Click' attrType='number' bind:value={li_in_game_ad_clicks}/>
          <Attribute attrId='Google Links' attrType='number' bind:value={li_google_links}/>
          <Attribute attrId='Pop-Up Ads ' attrType='number' bind:value={li_pop_up_ads}/>
          <Attribute attrId='Video Ads' attrType='number' bind:value={li_video_ads}/>
          <Attribute attrId='Banner Ads' attrType='number' bind:value={li_banner_ads}/>
        {:else}
          <Attribute attrId='In Game Ad Click - Google Links - Pop-Up Ads' attrType='number' bind:value={c123}/>
          <Attribute attrId='Google Links - Pop-Up Ads - Video Ads' attrType='number' bind:value={c234}/>
          <Attribute attrId='Pop-Up Ads - Video Ads - Banner Ads' attrType='number' bind:value={c345}/>
        {/if}
      </div>
      <div class="py-4 px-2 flex flex-row justify-between">
        <!--<button class="btn-primary" on:click={getItem}>Get item</button>
        <button class="{(item_id.length === 0 || item_id === 'not set') ? 'btn-disabled' : 'btn-primary'}"
                on:click={addItem}>Add items
        </button>-->

        <button class="btn-primary" on:click={getItem}>Submit the Bid</button>
        <button class="btn-primary" on:click={getItem}>Generate the Bid</button>
        <button class="btn-primary" on:click={getItem}>Generate the Bid</button>
      </div>
    </div>
  </div>
{/if}