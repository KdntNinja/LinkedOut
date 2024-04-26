<script>
    import {auth, signInWithEmailAndPassword} from "$lib/firebase.js";

    let email = "";
    let password = "";
    let errorMessage = "";

    async function handleLogin(event) {
        event.preventDefault();

        if (!email || !password) {
            errorMessage = "Please fill in all fields.";
            return;
        }
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            console.log("Logged in:", user);
            window.location.href = "/";
        } catch (error) {
            errorMessage = error.message;
        }
    }

</script>

<div class="container mx-auto px-4 py-8">
    <header class="text-center mb-8">
        <h1 class="text-4xl font-bold text-gray-800">Login</h1>
    </header>
    <div class="login-container bg-white shadow-lg rounded-lg p-8 mb-8">
        <form on:submit={handleLogin}>
            <div class="form-group mb-4">
                <label for="email" class="block text-sm font-semibold text-gray-700 mb-1">Email:</label>
                <input id="email" bind:value={email} type="email"
                       class="w-full px-4 py-2 border rounded-md focus:outline-none focus:border-blue-500"
                       placeholder="Enter your email" required>
            </div>
            <div class="form-group mb-4">
                <label for="password" class="block text-sm font-semibold text-gray-700 mb-1">Password:</label>
                <input id="password" bind:value={password} type="password"
                       class="w-full px-4 py-2 border rounded-md focus:outline-none focus:border-blue-500"
                       placeholder="Enter your password" required>
            </div>
            {#if errorMessage}
                <p class="text-red-500 text-sm mb-4">{errorMessage}</p>
            {/if}
            <button type="submit"
                    class="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-md focus:outline-none focus:shadow-outline">
                Login
            </button>
        </form>
    </div>
    <div class="signup-link mt-4">
        <a href="/signup" class="text-blue-500 hover:text-blue-700">Don't have an account? Sign up here.</a>
    </div>
</div>

<style>
    .container {
        max-width: 400px;
    }

    .login-container {
        background-color: #f8f9fa;
    }

    .form-group {
        margin-bottom: 1rem;
    }

    input {
        border-color: #ced4da;
    }

    button {
        cursor: pointer;
    }
</style>
