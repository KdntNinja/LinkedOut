<script>

    import {createUserWithEmailAndPassword} from "firebase/auth";
    import {auth} from "$lib/firebase.js";
    import {userCredentials} from "$lib/store.js";

    let email = "";
    let password = "";
    let confirmPassword = "";
    let errorMessage = "";

    async function handleSignup(event) {
        event.preventDefault();

        if (!email || !password || !confirmPassword) {
            errorMessage = "Please fill in all fields.";
            return;
        }

        if (password !== confirmPassword) {
            errorMessage = "Passwords do not match.";
            return;
        }

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            userCredentials.set({email, password});

            window.location.href = "/";

        } catch (error) {
            if (error.code === "auth/email-already-in-use") {
                errorMessage = "The email address is already in use by another account.";
            } else {
                errorMessage = error.message;
            }
        }
    }
</script>

<div class="container mx-auto px-4 py-8">
    <header class="text-center mb-8">
        <h1 class="text-4xl font-bold text-gray-800">Signup</h1>
    </header>
    <div class="login-container bg-white shadow-lg rounded-lg p-8 mb-8">
        <form on:submit={handleSignup}>
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
            <div class="form-group mb-4">
                <label for="confirmPassword" class="block text-sm font-semibold text-gray-700 mb-1">Confirm Password:</label>
                <input id="confirmPassword" bind:value={confirmPassword} type="password"
                       class="w-full px-4 py-2 border rounded-md focus:outline-none focus:border-blue-500"
                       placeholder="Confirm your password" required>
            </div>
            {#if errorMessage}
                <p class="text-red-500 text-sm mb-4">{errorMessage}</p>
            {/if}
            <button type="submit"
                    class="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-md focus:outline-none focus:shadow-outline">
                Signup
            </button>
        </form>
    </div>
    <div class="login-link mt-4">
        <a href="/login" class="text-blue-500 hover:text-blue-700">Already have an account? Login here.</a>
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
