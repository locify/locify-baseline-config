<script lang="ts">
  import logo from '$assets/images/logo-locify_black.png'

  export let isConnected
  export let getAccountName
  export let walletDisconnect
  export let walletConnect
</script>
<nav class="bg-white border-gray-200 px-2 py-2.5 rounded flex flex-row justify-between items-center">
  <img src={logo} class="object-contain h-14" alt="Locify Logo"/>
  {#if isConnected !== 'init'}
    {#if (isConnected === 'connected')}
      <div class="has-tooltip flex flex-col">
        <button class="btn-primary" on:click={walletDisconnect}>Disconnect</button>
        <span
          class='tooltip rounded shadow-lg p-1 bg-gray-100 text-blue-800'>{getAccountName()}</span>
      </div>
    {:else}
      <div>
        <button class="btn-primary" on:click={walletConnect}>Connect</button>
      </div>
    {/if}
  {/if}
</nav>

<style lang="postcss">
  /*nav {
    @apply
  }*/

  .tooltip {
    @apply invisible ;
  }

  .has-tooltip:hover .tooltip {
    @apply visible;
  }
</style>