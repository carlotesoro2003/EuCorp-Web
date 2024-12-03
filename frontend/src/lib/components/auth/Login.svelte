<script lang="ts">
  import { supabase } from "$lib/supabaseClient";
  let email = "";
  let message = "";
  let isLoading = false;

  async function sendMagicLink() {
    isLoading = true;
    const { error } = await supabase.auth.signInWithOtp({ email });
    isLoading = false;
    if (error) {
      console.error("Error sending magic link:", error.message);
      message = `Failed to send magic link. ${error.message}`;
    } else {
      message = "Check your email for the magic link!";
    }
  }
</script>

<div class="h-screen grid lg:grid-cols-2">
  <!-- Left Section with Enhanced Background and Content -->
  <div
    class="relative hidden lg:block"
    style="
      background-image: 
        linear-gradient(180deg, rgba(103, 21, 21, 0.8) 0%, rgba(103, 21, 21, 0.3) 50%),
        url('/images/login_bg.png');;
      background-repeat: no-repeat;
      background-size: cover;
      background-position: center;
    "
  >
    <!-- Overlay and Content -->
    <div class="relative z-10 h-full flex flex-col items-center justify-center space-y-4 p-10">
      <!-- Logo and Title -->
      <div class="text-center">
        <h1 class="text-5xl font-extrabold text-white tracking-tight mb-4">
          EuCorp
        </h1>
        <p class="text-xl text-gray-300 max-w-md">
          Your Institutional Planning System
        </p>
      </div>

      <!-- Features List -->
      <div class="mt-6 space-y-2 text-gray-200">
        <div class="flex items-center space-x-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-6 w-6 text-green-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M5 13l4 4L19 7"
            />
          </svg>
          <p>Streamline Project Management</p>
        </div>
        <div class="flex items-center space-x-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-6 w-6 text-green-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M5 13l4 4L19 7"
            />
          </svg>
          <p>Enhance Collaboration</p>
        </div>
        <div class="flex items-center space-x-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-6 w-6 text-green-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M5 13l4 4L19 7"
            />
          </svg>
          <p>Monitor Progress Effectively</p>
        </div>
      </div>
    </div>
  </div>

  <!-- Right Section with Form -->
  <div class="flex items-center justify-center px-8">
    <div class="w-full max-w-md">
      <div class="text-center mb-8">
        <h1 class="text-2xl font-semibold">Create an account</h1>
        <p class="text-gray-600">
          Enter your email below to create your account
        </p>
      </div>

      <form on:submit|preventDefault={sendMagicLink} class="space-y-4">
        <input
          type="email"
          bind:value={email}
          placeholder="name@example.com"
          required
          class="input input-bordered w-full"
        />
        <button
          type="submit"
          class="btn bg-rose-700 w-full text-white"
          disabled={isLoading}
        >
          {#if isLoading}
            <span class="loading loading-spinner loading-sm"></span>
          {/if}
          <span>{isLoading ? "Sending..." : "Sign In with Email"}</span>
        </button>
      </form>

      {#if message}
        <p class="text-sm text-center mt-4">{message}</p>
      {/if}

      <div class="divider">OR CONTINUE WITH</div>

      <button class="btn btn-outline w-full">Google</button>

      <p class="text-gray-500 text-sm text-center mt-4">
        By clicking continue, you agree to our
        <a href="/terms" class="hover:underline text-primary">Terms of Service</a>
        and
        <a href="/privacy" class="hover:underline text-primary">Privacy Policy</a>.
      </p>
    </div>
  </div>
</div>

<style>
   .divider {
    display: flex;
    align-items: center;
    justify-content: center;
    color: #9ca3af;
    font-size: 0.875rem;
    position: relative;
    margin: 20px 0; /* Adjusts spacing around the divider */
  }

  .divider::before,
  .divider::after {
    content: "";
    flex: 1;
    height: 1px;
    background: #4b5563; /* Slightly darker gray for better contrast */
  }

  .divider::before {
    margin-right: 15px; /* Adjust space between line and text */
  }

  .divider::after {
    margin-left: 15px; /* Adjust space between line and text */
  }
</style>
