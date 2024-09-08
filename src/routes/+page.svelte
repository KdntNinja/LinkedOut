<script>
    import {auth, onAuthStateChanged} from "$lib/supabase.js";
    import { isAuthenticated } from "$lib/auth.js";

    onAuthStateChanged(auth, user => {
        isAuthenticated.set(!!user);
        if (typeof window !== "undefined") {
            window.location.href = user ? "/posts" : "/login";
        }
    });
</script>

<main class="min-h-screen flex flex-col items-center justify-center bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">

    <div class="text-center animate-pulse mb-8 mt-12">
        <h1 class="text-4xl font-bold mb-4 text-gray-900 animate-slideInLeft">Welcome to LinkedOut</h1>
        <p class="text-lg text-gray-600 animate-slideInRight">Where professionals connect and thrive</p>
    </div>

    <div class="flex justify-center">
        <a href={"/login"}>
            <button class="mt-6 inline-block text-white text-lg px-8 py-3 rounded bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 animate-bounce transition duration-200 transform hover:scale-105">
                Explore Now
            </button>
        </a>
    </div>
</main>