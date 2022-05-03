<script lang="ts">
  import Attribute from "./Attribute.svelte";

  export let isConnected
  export let item_id
  export let model
  export let in_game_ad_clicks
  export let google_links
  export let pop_up_ads
  export let video_ads
  export let banner_ads
  export let randomFill
  export let getItem
  export let addItem
  let selected
  let modelOptions = [
    {id: 1, text: "Last Interaction"},
    {id: 2, text: "First Interaction"},
    {id: 3, text: "Game theory based model"},
  ]
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
          <select class="form-select block w-full mt-1" bind:value={selected} on:change="{() => model = ''}">
            {#each modelOptions as model}
              <option value={model}>
                {model.text}
              </option>
            {/each}
          </select>
        </label>
        <Attribute attrId='In Game Ad Click' attrType='number' bind:value={in_game_ad_clicks}/>
        <Attribute attrId='Google Links' attrType='number' bind:value={google_links}/>
        <Attribute attrId='Pop-Up Ads ' attrType='number' bind:value={pop_up_ads}/>
        <Attribute attrId='Video Ads' attrType='number' bind:value={video_ads}/>
        <Attribute attrId='Banner Ads' attrType='number' bind:value={banner_ads}/>
      </div>
      <div class="py-4 px-2 flex flex-row justify-between">
        <button class="btn-primary" on:click={getItem}>Get item</button>
        <button class="{(item_id.length === 0 || item_id === 'not set') ? 'btn-disabled' : 'btn-primary'}"
                on:click={addItem}>Add items
        </button>
      </div>
    </div>
  </div>
{/if}