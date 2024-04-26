<script lang="ts">
  import {onDestroy, onMount} from "svelte";
  import {auth, getUserCollection} from "$lib/firebase.js";
  import {onAuthStateChanged} from "firebase/auth";
  import {addDoc, deleteDoc, doc, getDocs, setDoc} from "firebase/firestore";

  import BackButton from "$lib/BackButton.svelte"

  interface Post {
    id: string;
    title: string;
    content: string;
    uid?: string;
  }

  let posts: Post[] = [];
  let editMode = false;
  let newPost: Post = {id: "", title: "", content: ""};
  let intervalId;
  let showAddSection = false;

  onMount(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        for (let i = 0; i < 3; i++) {
          setTimeout(fetchPosts, i * 1000);
        }

        setTimeout(() => {
          intervalId = setInterval(fetchPosts, 30000);
        }, 3000);
      } else if (document.referrer.includes("/login")) {
        window.location.href = "/";
      }
    });

    onDestroy(() => {
      unsubscribe();
    });
  });

  async function fetchPosts() {
    return new Promise(async (resolve, reject) => {
      try {
        const publicCollection = getUserCollection("public", "posts");
        const snapshot = await getDocs(publicCollection);
        posts = snapshot.docs.map(doc => ({id: doc.id, title: doc.data().title, content: doc.data().content}));
        resolve(posts);
      } catch (error) {
        console.error("Error fetching posts: ", error);
        reject(error);
      }
    });
  }

  async function addPost() {
    return new Promise(async (resolve, reject) => {
      if (!newPost.title || !newPost.content) {
        alert("Please fill out all fields");
        reject("Please fill out all fields");
        return;
      }
      try {
        const publicCollection = getUserCollection("public", "posts");
        let newPostDoc;
        if (editMode) {
          const postRef = doc(publicCollection, newPost.id);
          await setDoc(postRef, {title: newPost.title, content: newPost.content}, {merge: true});
          editMode = false;
        } else {
          newPostDoc = await addDoc(publicCollection, {title: newPost.title, content: newPost.content});
        }
        newPost = {id: "", title: "", content: ""};
        if (newPostDoc) {
          posts = [...posts, {id: newPostDoc.id, title: newPost.title, content: newPost.content}];
        }
        await fetchPosts();
        resolve(posts);
        showAddSection = false;
      } catch (error) {
        console.error("Error adding/updating post: ", error);
        reject(error);
      }
    });
  }

  async function editPost({post}: {post: Post}) {
    if (auth.currentUser && auth.currentUser.uid !== post.uid) {
      alert("You can only edit your own posts");
      return;
    }
    showAddSection = true;
    editMode = true;
    newPost = {...post};
    await fetchPosts();
  }

  async function deletePost({id, uid}: {id: string, uid: string}) {
    try {
      if (auth.currentUser) {
        const userCollection = getUserCollection(auth.currentUser.uid, "posts");
        await deleteDoc(doc(userCollection, id));
        await fetchPosts();
      }
    } catch (e) {
      console.error("Error removing document: ", e);
    }
  }
</script>

<main class="min-h-screen flex flex-col items-center justify-top bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
  <header class="text-center mb-6 animate-pulse">
    <h1 class="text-3xl font-bold animate-slideInLeft">LinkedOut Posts</h1>
  </header>
  <section class="add-post w-full max-w-md mx-auto animate-slideInRight">
    <button class="text-2xl font-bold mb-4 add-post-link"
            on:click={() => showAddSection = !showAddSection}>{editMode ? 'Edit Post' : 'Add Post'}</button>
    {#if showAddSection}
      <form on:submit|preventDefault={addPost}>
        <div class="mb-4">
          <label for="title" class="block text-sm font-bold mb-1">Title:</label>
          <input type="text" id="title" class="w-full px-3 py-2 border rounded-md" bind:value={newPost.title}
                 placeholder="Enter post title" required>
        </div>
        <div class="mb-4">
          <label for="content" class="block text-sm font-bold mb-1">Content:</label>
          <textarea id="content" class="w-full px-3 py-2 border rounded-md" bind:value={newPost.content}
                    placeholder="Enter post content" required></textarea>
        </div>
        <button type="submit"
                class="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-md">{editMode ? "Update Post" : "Add Post"}</button>
      </form>
    {/if}
  </section>
  <section class="post-list w-full max-w-xl mx-auto animate-slideInLeft">
    <h2 class="text-2xl font-bold mb-4">Post List</h2>
    {#if posts.length === 0}
      <p>No posts added yet.</p>
    {:else}
      <ul>
        {#each posts as post (post.id)}
          <li>
            <div class="post-card bg-white border rounded-lg p-4 flex items-center justify-between hover:shadow-md mb-4 animate-slideInRight">
              <div class="post-info">
                <h3 class="text-lg font-semibold">{post.title}</h3>
                <p class="text-gray-600">{post.content}</p>
              </div>
              <div class="post-actions">
                <button on:click={() => editPost({post : post})}
                        class="bg-transparent text-blue-500 border border-blue-500 font-bold py-2 px-4 rounded-md hover:bg-blue-500 hover:text-white transition duration-300 ease-in-out">
                  Edit
                </button>
                <button on:click={() => deletePost({id: post.id, uid: post.uid})}
                        class="bg-transparent text-red-500 border border-red-500 font-bold py-2 px-4 rounded-md hover:bg-red-500 hover:text-white transition duration-300 ease-in-out">
                  Delete
                </button>
              </div>
            </div>
          </li>
        {/each}
      </ul>
    {/if}
    <BackButton/>
  </section>
</main>

<style>
  .add-post-link {
    color: #3b82f6;
    cursor: pointer;
    text-decoration: underline;
  }

  .animate-slideInLeft {
    animation: slideInLeft 1s forwards;
  }

  .animate-slideInRight {
    animation: slideInRight 1s forwards;
  }

  @keyframes slideInLeft {
    0% {
      transform: translateX(-100%);
      opacity: 0;
    }
    100% {
      transform: translateX(0);
      opacity: 1;
    }
  }

  @keyframes slideInRight {
    0% {
      transform: translateX(100%);
      opacity: 0;
    }
    100% {
      transform: translateX(0);
      opacity: 1;
    }
  }
</style>