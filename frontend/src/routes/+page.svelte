<script lang="ts">
    import "tailwindcss/tailwind.css";  
    import { goto } from '$app/navigation';
    import { supabase } from '$lib/supabaseClient';
    import { onMount } from 'svelte';
  
    export let data: { supabase: typeof import('$lib/supabaseClient').supabase, session: any };
    let session = data.session; // Use let to allow reassignment
    let loading = true; // State for loading
    let isVerified = false; // Track user verification status
  
    console.log("Session on load: ", session);
  
    const checkSessionAndInsertUser = async () => {
    if (!session) return; // Early exit if there's no session

    const user = session.user;

    try {
        // Step 1: Check if the user exists in the profiles table
        let { data: profileData, error: fetchError } = await supabase
            .from("profiles")
            .select("id, is_verified")
            .eq("id", user.id)
            .single();

        if (fetchError) {
            if (fetchError.code === "PGRST116") {
                // Step 2: If the user is not found, insert them into the profiles table
                console.log("User not found in profiles. Adding new user...");

                const { error: insertError } = await supabase.from("profiles").insert({
                    id: user.id,
                    email: user.email,
                    first_name: user.user_metadata?.first_name || "",
                    last_name: user.user_metadata?.last_name || "",
                    role: "user", // Default role for new users
                    is_verified: false, // Default to not verified
                });

                if (insertError) {
                    console.error("Error adding new user to profiles:", insertError.message);
                    goto('/login'); // Redirect to login on error
                    return;
                } else {
                    console.log("New user added to profiles.");
                    isVerified = false; // Set default verification status
                }
            } else {
                console.error("Error fetching user profile:", fetchError.message);
                goto('/login'); // Redirect to login on unexpected error
                return;
            }
        }

        // Step 3: If user exists, check their verification status
        if (profileData) {
            isVerified = profileData.is_verified ?? false;

            if (!isVerified) {
                console.warn("User is not verified. Redirecting...");
                goto('/login'); // Redirect unverified users
            } else {
                console.log("User is verified.");
                goto('/dashboard'); // Redirect verified users
            }
        }
    } catch (err) {
        console.error("Error during session check or user insertion:", err);
        goto('/login'); // Redirect to login on unexpected error
    } finally {
        loading = false;
    }
};

  
    onMount(() => {
        // Subscribe to authentication state changes
        const { data: authListener } = supabase.auth.onAuthStateChange((event, newSession) => {
            session = newSession; // Update the session variable in real-time
            console.log("Auth state changed:", event, "New session:", newSession);
  
            if (!newSession) {
                console.log("No active session, redirecting to login.");
                goto('/'); // Redirect to login if no active session
            } else {
                checkSessionAndInsertUser(); // Check the session and user verification
            }
        });
  
        // Cleanup listener on unmount
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
