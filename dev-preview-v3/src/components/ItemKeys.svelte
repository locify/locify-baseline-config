<script lang="ts">
  export let allKeys
  export let getAllKeys
  export let isConnected
</script>

{#if isConnected === 'connected'}
  <h3 class="text-2xl">All keys</h3>
  {#if allKeys !== 'not set'}
    all keys: {allKeys}
  {/if}<br/>
  <button class="btn-primary" on:click={getAllKeys}>Get item keys</button>
{/if}