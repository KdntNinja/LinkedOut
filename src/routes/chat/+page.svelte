<script lang="ts">
    import {onDestroy, onMount} from "svelte";
    import {
        addDoc,
        auth,
        collection,
        db,
        deleteDoc,
        doc,
        getDoc,
        getDocs,
        limit,
        onSnapshot,
        orderBy,
        query,
        updateDoc
    } from "$lib/firebase.js";

    import BackButton from "$lib/BackButton.svelte";

    type Message = {
        "id": string,
        "text": string,
        "timestamp": number,
        "user": string,
        "edited": boolean,
    };

    let messages: Message[] = [];
    let newMessage = '';
    let isLoading = false;
    let unsubscribe: () => void;
    let chatBox: HTMLElement;
    let editingMessageId: string | null = null;
    let editingMessageText = '';

    async function fetchMessages() {
        await deleteOldMessages()
        const messagesRef = collection(db, "messages");
        const q = query(messagesRef, orderBy("timestamp", "desc"), limit(25));

        unsubscribe = onSnapshot(q, (snapshot) => {
            messages = snapshot.docs.map(doc => ({...doc.data() as Message}));
            messages.reverse()
        });
    }

    async function deleteOldMessages() {
        const messagesRef = collection(db, "messages");

        const allMessagesQuery = query(messagesRef, orderBy("timestamp", "desc"));
        const allMessagesSnapshot = await getDocs(allMessagesQuery);
        const allMessages = allMessagesSnapshot.docs.map(doc => ({id: doc.id, ...doc.data()}));

        if (allMessages.length > 25) {
            const messagesToDelete = allMessages.slice(25);
            for (const message of messagesToDelete) {
                await deleteDoc(doc(messagesRef, message.id));
            }
        }
    }

    onMount(async () => {
        await fetchMessages();
    });

    onDestroy(() => {
        if (unsubscribe) {
            unsubscribe();
        }
    });

    async function editMessage(messageId: string) {
        const messageDoc = await getDoc(doc(collection(db, "messages"), messageId));
        const messageData = messageDoc.data();
        if (!messageData) {
            console.error("No message data found for the given message ID.");
            return;
        }
        editingMessageId = messageId;
        editingMessageText = messageData.text;
    }

    async function updateMessage() {
        if (editingMessageId && editingMessageText.trim() !== '') {
            await updateDoc(doc(collection(db, "messages"), editingMessageId), {
                text: editingMessageText,
                edited: true,
            });

            editingMessageId = null;
            editingMessageText = '';
        }
    }
    async function sendMessage() {
        if (newMessage.trim() === '') return;
        if (!auth.currentUser) {
            console.error("No user is currently signed in.");
            return;
        }
        isLoading = true;
        const timestamp = new Date();
        try {
            await addDoc(collection(db, "messages"), {
                text: newMessage,
                timestamp: timestamp.getTime(),
                user: auth.currentUser.uid,
                edited: false,
            });
            newMessage = "";
            await fetchMessages();
            chatBox.scrollTop = chatBox.scrollHeight;
        } catch (error) {
            console.error("Error sending message: ", error);
        } finally {
            isLoading = false;
        }
    }

    async function deleteMessage(messageId: string) {
        try {
            const messagesCollection = collection(db, "messages");
            await deleteDoc(doc(messagesCollection, messageId));
            await fetchMessages();
        } catch (error) {
            console.error("Error deleting message: ", error);
        }
    }
</script>

<main class="flex flex-col h-screen p-4 bg-gray-100 justify-center">
    <div class="flex-grow flex flex-col bg-white rounded-lg shadow-md p-4">
        <h1 class="text-3xl font-semibold mb-4">Chat Room</h1>

        <!-- Chat messages -->
        <div bind:this={chatBox}
             class="chat-messages flex-grow overflow-y-auto border rounded-lg mb-4 p-2 bg-gray-50" style="max-height: 500px;">
            {#each messages as message}
                {#if auth.currentUser && auth.currentUser.uid === message.user}
                    <div class="flex justify-end items-start mb-4">
                        <button on:click={() => editMessage(message.id)}
                                class="ml-2 bg-transparent text-green-500 border border-green-500 font-bold py-1 px-2 rounded-md hover:bg-green-500 hover:text-white transition duration-300 ease-in-out">
                            Edit
                        </button>
                        <button on:click={() => deleteMessage(message.id)}
                                class="ml-2 bg-transparent text-red-500 border border-red-500 font-bold py-1 px-2 rounded-md hover:bg-red-500 hover:text-white transition duration-300 ease-in-out">
                            Delete
                        </button>
                        <div class="userMessage rounded-lg px-4 py-2 ml-2 max-w-xs shadow-sm">
                            <p class="text-gray-100">{message.text}</p>
                            <small class="text-gray-200">{new Date(message.timestamp).toLocaleString()}</small>
                        </div>
                    </div>
                {:else}
                    <div class="flex justify-start items-start mb-4">
                        <div class="otherMessage rounded-lg px-4 py-2 mr-2 max-w-xs shadow-sm">
                            <p class="text-gray-100">{message.text}</p>
                            <small class="text-gray-200">{new Date(message.timestamp).toLocaleString()}</small>
                        </div>
                    </div>
                {/if}
            {/each}
        </div>
        {#if editingMessageId}
            <input bind:value={editingMessageText}
                   class="flex-grow rounded-md border px-4 py-4 mr-2 bg-gray-200 focus:outline-none focus:ring focus:border-blue-300"
                   on:keydown={(event) => { if (event.key === 'Enter') { event.preventDefault(); updateMessage(); } }}
                   placeholder="Edit your message..." style="height: 50px;"
                   type="text">
            <button class="bg-blue-500 text-white rounded-md px-6 py-2 hover:bg-blue-600 focus:outline-none focus:ring focus:border-blue-300"
                    on:click={updateMessage} disabled={isLoading}>{isLoading ? "Updating..." : "Update"}</button>
        {:else}
            <!-- Message input -->
            <div class="flex items-center border-t pt-4">
                <input bind:value={newMessage}
                       class="flex-grow rounded-md border px-4 py-4 mr-2 bg-gray-200 focus:outline-none focus:ring focus:border-blue-300"
                       on:keydown={(event) => { if (event.key === 'Enter') { event.preventDefault(); sendMessage(); } }} placeholder="Type your message..." style="height: 50px;"
                       type="text">
                <button class="bg-blue-500 text-white rounded-md px-6 py-2 hover:bg-blue-600 focus:outline-none focus:ring focus:border-blue-300" on:click={sendMessage} disabled={isLoading}>{isLoading ? "Sending..." : "Send"}</button>
            </div>
        {/if}
    </div>
    <BackButton/>
</main>

<style>
    .userMessage {
        background-color: blue;
    }

    .otherMessage {
        background-color: gray;
    }
</style>