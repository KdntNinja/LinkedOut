import {writable} from 'svelte/store';

export const userCredentials = writable({
    email: "",
    password: "",
});