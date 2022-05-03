<script>
  import "../app.css";
</script>

<slot/>
<style lang="postcss">
  :global(body) {
    @apply antialiased text-gray-900 px-6 max-w-xl mx-auto py-12 divide-y md:max-w-4xl;
  }
</style>