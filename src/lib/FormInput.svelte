<script>
  export let label;
  export let id;
  export let type = "text";
  export let placeholder;
  export let value;
</script>

<div class="form-group mb-4">
  <label for={id} class="block text-sm font-semibold text-gray-700 mb-1">{label}:</label>
  {#if type === "text"}
    <input id={id} bind:value={value} type="text" class="w-full px-4 py-2 border rounded-md focus:outline-none focus:border-blue-500" placeholder={placeholder} required>
  {:else if type === "password"}
    <input id={id} bind:value={value} type="password" class="w-full px-4 py-2 border rounded-md focus:outline-none focus:border-blue-500" placeholder={placeholder} required>
  {/if}
</div>
