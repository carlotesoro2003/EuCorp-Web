<script lang="ts">
  import "tailwindcss/tailwind.css";
  import { goto } from "$app/navigation";
  import { supabase } from "$lib/supabaseClient";
  import { onMount } from "svelte";

  export let data: { supabase: typeof import("$lib/supabaseClient").supabase; session: any };
  let session = data.session;
  let loading = true;
  let isVerified = false;

  // Ensure session and insert user if necessary
  const ensureSession = async () => {
    console.log("Ensuring session...");

    if (!session) {
      console.log("No session found. Redirecting to /login...");
      goto("/login");
      return;
    }

    try {
      const user = session.user;

      // Step 1: Check if the user exists in the profiles table
      const { data: profileData, error: fetchError } = await supabase
        .from("profiles")
        .select("id, is_verified")
        .eq("id", user.id)
        .single();

      if (fetchError) {
        if (fetchError.code === "PGRST116") {
          console.log("User not found in profiles. Adding new user...");

          // Step 2: Insert new user into profiles table
          const { error: insertError } = await supabase.from("profiles").insert({
            id: user.id,
            email: user.email,
            first_name: user.user_metadata?.first_name || "",
            last_name: user.user_metadata?.last_name || "",
            role: "user",
            is_verified: false,
          });

          if (insertError) {
            console.error("Error adding new user to profiles:", insertError.message);
            goto("/login");
            return;
          } else {
            console.log("New user added to profiles.");
            isVerified = false; // Set default verification status
          }
        } else {
          console.error("Error fetching user profile:", fetchError.message);
          goto("/login");
          return;
        }
      }

      // Step 3: If user exists, check their verification status
      if (profileData) {
        isVerified = profileData.is_verified ?? false;

        if (!isVerified) {
          console.warn("User is not verified. Redirecting to /login...");
          goto("/login");
        } else {
          console.log("User is verified. Redirecting to /...");
          goto("/"); // Redirect to the main page upon successful verification
        }
      }
    } catch (err) {
      console.error("Error during session check:", err);
      goto("/login");
    } finally {
      loading = false;
    }
  };

  onMount(() => {
    console.log("Page mounted. Checking session...");
    ensureSession();

    const { data: authListener } = supabase.auth.onAuthStateChange((event, newSession) => {
      console.log("Auth state changed:", event, "New session:", newSession);
      session = newSession;

      if (!session) {
        console.log("No active session, redirecting to login.");
        goto("/login");
      } else {
        ensureSession();
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  });
</script>

{#if loading}
  <div class="flex items-center justify-center min-h-screen bg-base-300">
    <div class="loader">
      <span class="loading loading-spinner loading-sm"></span>
      Checking verification status...
    </div>
  </div>
{/if}

<style>
  .loader {
    font-size: 1.25rem;
    font-weight: bold;
    color: white;
  }
</style>
