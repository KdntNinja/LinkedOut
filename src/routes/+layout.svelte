<script>
    import "tailwindcss/tailwind.css";


    let navbar;
    let isLoggedIn = false;
</script>


{#if isLoggedIn}
    <nav bind:this={navbar}
         class="navbar bg-primary text-primary-content fixed w-full z-50 top-0 flex items-center justify-center h-16 transition-all duration-500 ease-in-out slide-down">
    <ul class="flex justify-between max-w-screen-xl mx-auto space-x-4">
        <li><a class="btn btn-ghost text-xl hover:text-gray-300 transition duration-200" href="/posts">Posts</a></li>
        <li><a class="btn btn-ghost text-xl hover:text-gray-300 transition duration-200" href="/chat">Chat</a></li>
        <li><a class="btn btn-ghost text-xl hover:text-gray-300 transition duration-200" href="/messages">Messages</a></li>
        <li><a class="btn btn-ghost text-xl hover:text-gray-300 transition duration-200" href="/profile">Profile</a></li>
    </ul>
    </nav>
{/if}

<slot />