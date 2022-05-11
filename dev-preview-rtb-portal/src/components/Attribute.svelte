<script lang="ts">
  export let attrId: string
  export let attrType: 'text' | 'number'
  export let value: number
</script>
<div>
  {#if attrType === 'text'}
    <label for="{attrId + 't'}" class="block">
      <span class="text-gray-700">{attrId}</span>
      <input
        id="{attrId + 't'}"
        type="text"
        class="form-input mt-1 block w-full"
        placeholder="insert value"
        bind:value={value}
      />
    </label>
  {:else}
    <label for="{attrId + 'n'}" class="block">
      <span class="text-gray-700">{attrId}</span>
      <input
        id="{attrId + 'n'}"
        type="number"
        class="form-input mt-1 block w-full"
        placeholder="insert value"
        bind:value={value}
        min=1 max=100
      />
    </label>
  {/if}
</div>