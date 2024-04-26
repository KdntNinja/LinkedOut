<script>
    export let destination = "/";
</script>

<button on:click={() => window.location.href = destination} class="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-md mt-4 transition duration-300 ease-in-out transform hover:-translate-y-1">Go Back</button>