<script lang="ts">
  import { supabase } from "$lib/supabaseClient";

  // Admin Monitoring Pages
  import AdminPlansMonitoring from "$lib/components/monitoring/admin/AdminPlansMonitoring.svelte";
  import AdminRisksMonitoring from "$lib/components/monitoring/admin/AdminRisksMonitoring.svelte";
  import AdminOptMonitoring from "$lib/components/monitoring/admin/AdminOptMonitoring.svelte";

  // Department Monitoring Pages
  import DeptPlansMonitoring from "$lib/components/monitoring/departments/DeptPlansMonitoring.svelte";
  import DeptRisksMonitoring from "$lib/components/monitoring/departments/DeptRisksMonitoring.svelte";
  import DeptOptMonitoring from "$lib/components/monitoring/departments/DeptOptMonitoring.svelte";

  export let data: { session: any } | null = null; // Accept null as fallback
  let session: any = null;

  // Define the profile role
  let profile: { role?: string } | null = null;
  let loading = true;
  let activeTab = "Plans"; // Default active tab

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

  // Change the active tab
  const changeTab = (tab: string) => {
    activeTab = tab;
  };
</script>

<div class="min-h-screen bg-base-300 p-8">
  <div role="tablist" class="tabs tabs-boxed">
    <a
      role="tab"
      class="tab {activeTab === 'Plans' ? 'tab-active' : ''}"
      on:click={() => changeTab('Plans')}
      >Plans</a
    >
    <a
      role="tab"
      class="tab {activeTab === 'Risks' ? 'tab-active' : ''}"
      on:click={() => changeTab('Risks')}
      >Risks</a
    >
    <a
      role="tab"
      class="tab {activeTab === 'Opportunities' ? 'tab-active' : ''}"
      on:click={() => changeTab('Opportunities')}
      >Opportunities</a
    >
  </div>

  {#if loading}
    <div class="text-center">
      <span class="loading loading-spinner loading-lg"></span>
      <p class="mt-2">Loading...</p>
    </div>
  {:else if session !== null && profile}
    {#if profile.role === 'admin'}
      {#if activeTab === 'Plans'}
        <AdminPlansMonitoring />
      {:else if activeTab === 'Risks'}
        <AdminRisksMonitoring />
      {:else if activeTab === 'Opportunities'}
        <AdminOptMonitoring />
      {/if}
    {:else if profile.role === 'user'}
      {#if activeTab === 'Plans'}
        <DeptPlansMonitoring />
      {:else if activeTab === 'Risks'}
        <DeptRisksMonitoring />
      {:else if activeTab === 'Opportunities'}
        <DeptOptMonitoring />
      {/if}
    {:else}
      <p class="text-white text-xl">
        You do not have the required permissions to view this page.
      </p>
    {/if}
  {:else}
    <p class="text-red-500 text-xl">Failed to load session or profile data.</p>
  {/if}
</div>
