<script lang="ts">
  import "tailwindcss/tailwind.css";
  import { goto } from "$app/navigation";
  import { supabase } from "$lib/supabaseClient";
  import { onMount } from "svelte";
  import { page } from "$app/stores";
  import IconParkHome from "~icons/mdi/home";
  import IconParkUserGroup from "~icons/mdi/account-group";
  import IconParkClipboardList from "~icons/mdi/clipboard-list";
  import IconParkMonitor from "~icons/mdi/chart-line";
  import IconSun from "~icons/mdi/weather-sunny";
  import IconMoon from "~icons/mdi/weather-night";
  import Login from "$lib/components/auth/Login.svelte";

  export let data: {
    supabase: typeof import("$lib/supabaseClient").supabase;
    session: any;
  };

  let { session } = data;
  let loading = true;
  let isVerified = false;
  let userRole: string | null = null;
  let departmentName = "";
  let profilePic: string | null = null;
  let email: string | null = null;

  let currentPath = "";
  let isDarkMode = false;

  $: currentPath = $page.url.pathname;

  const ensureSession = async () => {
    if (!session) {
      loading = false;
      goto("/login");
      return;
    }

    try {
      const user = session.user;
      const { data: profileData, error: fetchError } = await supabase
        .from("profiles")
        .select("id, role, is_verified, profile_pic, department_id, email")
        .eq("id", user.id)
        .single();

      if (fetchError) {
        if (fetchError.code === "PGRST116") {
          const { error: insertError } = await supabase.from("profiles").insert({
            id: user.id,
            email: user.email,
            first_name: user.user_metadata?.first_name || "New",
            last_name: user.user_metadata?.last_name || "User",
            role: "user",
            is_verified: false,
          });

          if (insertError) {
            goto("/login");
            return;
          }
        } else {
          goto("/login");
          return;
        }
      }

      if (profileData) {
        isVerified = profileData.is_verified ?? false;
        userRole = profileData.role ?? null;
        profilePic = profileData.profile_pic;
        email = profileData.email;

        if (profileData.department_id) {
          const { data: departmentData } = await supabase
            .from("departments")
            .select("name")
            .eq("id", profileData.department_id)
            .single();
          departmentName = departmentData?.name ?? "No Department";
        }

        if (!isVerified) {
          goto("/login");
          return;
        }
      }
    } catch (err) {
      goto("/login");
    } finally {
      loading = false;
    }
  };

  async function logout() {
    const { error } = await supabase.auth.signOut();
    if (error) console.error("Error logging out:", error.message);
    goto("/login");
  }

  function toggleTheme() {
    isDarkMode = !isDarkMode;
    document.documentElement.setAttribute(
      "data-theme",
      isDarkMode ? "dark" : "light"
    );
  }

  onMount(() => {
    ensureSession();
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_, newSession) => {
        session = newSession;
        if (!session) goto("/login");
        else ensureSession();
      }
    );
    return () => {
      authListener.subscription.unsubscribe();
    };
  });
</script>

{#if loading}
  <div class="flex items-center justify-center min-h-screen bg-base-300">
    <span class="loading loading-spinner loading-lg"></span>
  </div>
{:else if session && isVerified}
  <div class="flex h-screen bg-base-100 overflow-hidden">
    <aside class="w-64 bg-base-200 h-screen fixed shadow-lg z-50">
      <div class="h-16 flex items-center justify-between bg-primary px-4">
        <span class="font-bold text-lg">Eucorp</span>
      </div>
      <nav class="flex-1 py-4 px-2">
        <ul class="menu space-y-2">
          <li>
            <a
              href="/dashboard"
              class:active={currentPath === "/dashboard"}
              class="flex items-center gap-3 font-bold"
            >
              <IconParkHome class="h-6 w-6 text-secondary" /> Dashboard
            </a>
          </li>
          <!-- ADMIN SIDEBAR -->
          {#if userRole === "admin"}
            <li>
              <details open>
                <summary class="flex items-center gap-3 font-bold">
                  <IconParkUserGroup class="h-6 w-6 text-accent" /> User Management
                </summary>
                <ul class="menu ml-4 space-y-2">
                  <li>
                    <a
                      href="/users"
                      class:active={currentPath === "/users"}
                      class="flex items-center gap-3 font-bold">Users</a
                    >
                  </li>
                  <li>
                    <a
                      href="/departments"
                      class:active={currentPath === "/departments"}
                      class="flex items-center gap-3 font-bold">Departments</a
                    >
                  </li>
                  <li>
                    <a
                      href="/leads"
                      class:active={currentPath === "/leads"}
                      class="flex items-center gap-3 font-bold">Leads</a
                    >
                  </li>
                  <li>
                    <a
                      href="/riskManagement"
                      class:active={currentPath === "/riskmanagement"}
                      class="flex items-center gap-3 font-bold"
                      >Risk Management</a
                    >
                  </li>
                  <li>
                    <a
                      href="/classification"
                      class:active={currentPath === "/classification"}
                      class="flex items-center gap-3 font-bold"
                      >Classification</a
                    >
                  </li>
                </ul>
              </details>
            </li>
            <li>
              <details>
                <summary class="flex items-center gap-3 font-bold">
                  <IconParkClipboardList class="h-6 w-6" /> Planning
                </summary>
                <ul class="menu ml-4 space-y-2">
                  <li>
                    <a
                      href="/plans"
                      class:active={currentPath === "/plans"}
                      class="flex items-center gap-3 font-bold"
                      >Strategic Planning</a
                    >
                  </li>
                  <li>
                    <a
                      href="/risks"
                      class:active={currentPath === "/risks"}
                      class="flex items-center gap-3 font-bold">Risks</a
                    >
                  </li>
                  <li>
                    <a
                      href="/opportunities"
                      class:active={currentPath === "/opportunities"}
                      class="flex items-center gap-3 font-bold">Opportunities</a
                    >
                  </li>
                </ul>
              </details>
            </li>
            <li>
              <details>
                <summary class="flex items-center gap-3 font-bold">
                  <IconParkMonitor class="h-6 w-6 " /> Monitoring
                </summary>
                <ul class="menu ml-4 space-y-2">
                  <li>
                    <a
                      href="/monitoring/mid-year"
                      class:active={currentPath === "/monitoring/mid-year"}
                      class="flex items-center gap-3 font-bold"
                      >Mid-Year Monitoring</a
                    >
                  </li>
                  <li>
                    <a
                      href="/monitoring"
                      class:active={currentPath === "/monitoring"}
                      class="flex items-center gap-3 font-bold"
                      >Year-End Monitoring</a
                    >
                  </li>
                </ul>
              </details>
            </li>
          {/if}
          <!-- USER SIDEBAR -->
          {#if userRole !== "admin"}
            <li>
              <details>
                <summary class="flex items-center gap-3 font-bold">
                  <IconParkClipboardList class="h-6 w-6 text-purple-400" /> Planning
                </summary>
                <ul class="menu ml-4 space-y-2">
                  <li>
                    <a
                      href="/plans/operationalPlans"
                      class:active={currentPath === "/plans/operationalPlans"}
                      class="flex items-center gap-3 font-bold"
                      >Operational Planning</a
                    >
                  </li>
                  <li>
                    <a
                      href="/risks"
                      class:active={currentPath === "/risks"}
                      class="flex items-center gap-3 font-bold"
                      >Risks Register</a
                    >
                  </li>
                  <li>
                    <a
                      href="/opportunities"
                      class:active={currentPath === "/opportunities"}
                      class="flex items-center gap-3 font-bold"
                      >Opportunities Register</a
                    >
                  </li>
                </ul>
              </details>
            </li>
            <li>
              <details>
                <summary class="flex items-center gap-3 font-bold">
                  <IconParkMonitor class="h-6 w-6 " /> Monitoring
                </summary>
                <ul class="menu ml-4 space-y-2">
                  <li>
                    <a
                      href="/monitoring/mid-year"
                      class:active={currentPath === "/monitoring/mid-year"}
                      class="flex items-center gap-3 font-bold"
                      >Mid-Year Monitoring</a
                    >
                  </li>
                  <li>
                    <a
                      href="/monitoring"
                      class:active={currentPath === "/monitoring"}
                      class="flex items-center gap-3 font-bold"
                      >Year-End Monitoring</a
                    >
                  </li>
                </ul>
              </details>
            </li>
          {/if}
        </ul>
      </nav>
    </aside>
    <div class="flex flex-col flex-1 ml-64 overflow-auto">
      <header class="h-16 flex justify-between bg-base-300 items-center px-4 fixed top-0 left-64 right-0 z-40 shadow">
        <div class="flex items-center">
          <span class="font-bold text-lg">{userRole === "admin" ? "Admin Panel" : departmentName} Dashboard</span>
        </div>
        <div class="flex items-center space-x-4">
          <button on:click={toggleTheme} class="btn btn-circle btn-sm bg-transparent border-none">
            {#if isDarkMode}
              <IconMoon class="h-6 w-6" />
            {:else}
              <IconSun class="h-6 w-6" />
            {/if}
          </button>
          <div class="dropdown dropdown-end">
            <button class="btn btn-ghost">
              {#if profilePic}
                <img src={profilePic} alt="Profile" class="w-10 h-10 rounded-full" />
              {:else}
                <div class="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5.121 18.364A7.986 7.986 7.986 0 0112 14a7.986 7.986 7.986 0 016.879 4.364M12 10a4 4 0 110-8 4 4 0 010 8z" />
                  </svg>
                </div>
              {/if}
            </button>
            <ul class="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52">
              <li><span class="text-gray-500 text-xs">{email}</span></li>
              <li><a href="/profile">Profile</a></li>
              <li>
                <button on:click={logout} class="w-full text-left">
                  Logout
                </button>
              </li>
            </ul>
          </div>
        </div>
      </header>
      <main class="pt-20 px-4 bg-base-100 h-full">
        <slot />
      </main>
    </div>
  </div>
{:else if !session}
  <Login />
{:else}
  <div class="flex items-center justify-center min-h-screen bg-base-300">
    <div class="text-center">
      <h1 class="text-2xl font-bold text-yellow-500 mb-4">Pending for System Access</h1>
      <p class="text-white">Your account is under review. Please wait for verification.</p>
      <p>TESTTTTT</p>
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
