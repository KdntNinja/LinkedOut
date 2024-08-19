<script>
  import { onMount } from "svelte";

  let showBanner = false;

  onMount(() => {
    const consent = localStorage.getItem("userConsent");
    if (!consent) {
      showBanner = true;
    }
  });

  function acceptConsent() {
    localStorage.setItem("userConsent", "accepted");
    showBanner = false;
  }
</script>

<style>
  .banner {
    position: fixed;
    bottom: 0;
    width: 100%;
    background-color: #000;
    color: #fff;
    padding: 1em;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .banner button {
    background-color: #4CAF50;
    color: white;
    border: none;
    padding: 0.5em 1em;
    cursor: pointer;
  }
  .banner button:hover {
    background-color: #45a049;
  }
</style>

{#if showBanner}
  <div class="banner">
    <span>We use cookies to enhance your experience. By continuing to visit this site you agree to our use of cookies.</span>
    <button on:click={acceptConsent}>Accept</button>
  </div>
{/if}