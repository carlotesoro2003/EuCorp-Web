<script lang="ts">
    import { supabase } from "$lib/supabaseClient";
    import DeptOptMonitoring from "$lib/components/monitoring/departments/DeptOptMonitoring.svelte";
    import AdminOptMonitoring from "$lib/components/monitoring/admin/AdminOptMonitoring.svelte";
  
    export let data: { session: any } | null = null; // Accept null as fallback
    let session: any = null;
  
    // Define the profile role
    let profile: { role?: string } | null = null;
    let loading = true;
  
    // Fetch the user's profile to get the role
    const fetchUserProfile = async () => {
      try {
        if (data?.session) {
          session = data.session; // Extract session from data
          const { user } = session;
  
          const { data: profileData, error } = await supabase
            .from("profiles")
            .select("role")
            .eq("id", user.id)
            .single();
  
          if (error) {
            console.error("Error fetching user profile:", error.message);
          } else {
            profile = profileData;
            console.log("Role in Opportunities: ", profile);
          }
        } else {
          console.warn("Session is not available or data is missing.");
        }
      } catch (error) {
        console.error("Error fetching user profile or session:", error);
      } finally {
        loading = false; // Stop loading state
      }
    };
  
    // Call the function when component is loaded
    fetchUserProfile();
  </script>
  
  <div class="min-h-screen bg-base-300 p-8">
    {#if loading}
      <div class="text-center">
        <span class="loading loading-spinner loading-lg"></span>
        <p class="mt-2">Loading...</p>
      </div>
    {:else if session !== null && profile}
      {#if profile.role === 'admin'}
        <AdminOptMonitoring />
      {:else if profile.role === 'user'}
        <DeptOptMonitoring />
      {:else}
        <p class="text-white text-xl">
          You do not have the required permissions to view this page.
        </p>
      {/if}
    {:else}
      <p class="text-red-500 text-xl">Failed to load session or profile data.</p>
    {/if}
  </div>
  