<script lang="ts">
  import { goto } from "$app/navigation";
  import { supabase } from "$lib/supabaseClient";
  import { onMount } from "svelte";

  interface Risk {
    rrn: string;
    risk_statement: string;
    classification: number | null;
    actions: string;
    key_persons: string;
    budget: number;
    profile_id: string;
  }

  interface Classification {
    id: number;
    name: string;
  }

  let risks: Risk[] = [];
  let classification: Classification[] = [];
  let session: any = null;
  let profile: any = null;
  let departmentName = "";
  let isLoading = true;
  let nextRrnNumber = 1;

  // Alert states
  let successMessage: string | null = null;
  let errorMessage: string | null = null;

  const fetchUserProfile = async () => {
    isLoading = true;
    try {
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      if (sessionError) throw sessionError;

      session = sessionData.session;
      if (session) {
        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select("id, department_id")
          .eq("id", session.user.id)
          .single();

        if (profileError) throw profileError;
        profile = profileData;

        const { data: departmentData, error: departmentError } = await supabase
          .from("departments")
          .select("name")
          .eq("id", profile.department_id)
          .single();

        if (departmentError) throw departmentError;
        departmentName = departmentData.name;

        await fetchRisks();
        await fetchNextRrnNumber();
        await fetchClassification();
      } else {
        errorMessage = "User is not logged in.";
      }
    } catch (error) {
      console.error("Error fetching user profile or department:", error);
      errorMessage = "Failed to fetch profile or department details.";
    } finally {
      isLoading = false;
    }
  };

  const fetchRisks = async () => {
    isLoading = true;
    try {
      const { data, error } = await supabase
        .from("risks")
        .select("*")
        .eq("profile_id", profile?.id)
        .order("rrn", { ascending: true });

      if (error) throw error;

      risks = data.sort((a, b) => {
        const getNumericPart = (rrn: string) => {
          const match = rrn.match(/(\d+)$/);
          return match ? parseInt(match[0], 10) : 0;
        };

        return getNumericPart(a.rrn) - getNumericPart(b.rrn);
      });
    } catch (error) {
      console.error("Error fetching risks:", error);
      errorMessage = "Failed to fetch risks.";
    } finally {
      isLoading = false;
    }
  };

  const fetchNextRrnNumber = async () => {
    try {
      const { data, error } = await supabase
        .from("risks")
        .select("rrn")
        .eq("profile_id", profile?.id)
        .order("rrn", { ascending: false })
        .limit(1);

      if (error) throw error;

      if (data.length > 0) {
        const lastRrn = data[0].rrn;
        const lastNumberMatch = lastRrn.match(/(\d+)$/);
        nextRrnNumber = lastNumberMatch ? parseInt(lastNumberMatch[0], 10) + 1 : 1;
      } else {
        nextRrnNumber = 1;
      }
    } catch (error) {
      console.error("Error fetching next RRN number:", error);
      errorMessage = "Failed to determine the next RRN number.";
    }
  };

  const fetchClassification = async () => {
    try {
      const { data, error } = await supabase
        .from("classification")
        .select("id, name");
      if (error) throw error;
      classification = data;
    } catch (error) {
      console.error("Error fetching classifications:", error);
      errorMessage = "Failed to fetch classifications.";
    }
  };

  const addRow = () => {
    risks = [
      ...risks,
      {
        rrn: `RRN-${departmentName}-${nextRrnNumber++}`,
        risk_statement: "",
        classification: null,
        actions: "",
        key_persons: "",
        budget: 0,
        profile_id: profile?.id || "",
      },
    ];
  };

  const removeRow = (index: number) => {
    if (risks.length > 0 && index === risks.length - 1) {
      nextRrnNumber--;
    }
    risks = risks.filter((_, i) => i !== index);
  };

  const saveRisks = async () => {
    isLoading = true;

    try {
      const { error } = await supabase.from("risks").upsert(risks, { onConflict: "rrn" });
      if (error) throw error;

      successMessage = "Risks saved successfully!";
      errorMessage = null;

      await fetchRisks();
      await fetchNextRrnNumber();
    } catch (error) {
      console.error("Error saving risks:", error);
      successMessage = null;
      errorMessage = "Failed to save risks.";
    } finally {
      isLoading = false;
    }
  };

  const adjustTextareaSize = (target: HTMLTextAreaElement) => {
    target.style.height = "auto";
    target.style.width = "auto";
    target.style.height = `${target.scrollHeight}px`;
    target.style.width = `${Math.max(300, target.scrollWidth)}px`; // Set a minimum width
  };

  onMount(() => {
    fetchUserProfile();
  });
</script>

<div class="container mx-auto p-4">
  <h1 class="text-3xl font-bold mb-4">{departmentName} Risks Register</h1>

  <!-- Alerts -->
  {#if successMessage}
    <div class="alert alert-success shadow-lg mb-4">
      <span>{successMessage}</span>
    </div>
  {/if}
  {#if errorMessage}
    <div class="alert alert-error shadow-lg mb-4">
      <span>{errorMessage}</span>
    </div>
  {/if}

  <!-- Risks Table -->
  <div class="overflow-x-auto">
    <table class="table table-zebra w-full">
      <thead>
        <tr>
          <th>RRN</th>
          <th>Risk Statement</th>
          <th>Classification</th>
          <th>Actions</th>
          <th>Key Persons</th>
          <th>Budget</th>
          <th>Remove</th>
        </tr>
      </thead>
      <tbody>
        {#each risks as risk, index}
          <tr>
            <td style="width: 200px;">
              <input type="text" bind:value={risk.rrn} class="input input-bordered w-full" readonly />
            </td>
            <td>
              <textarea
                bind:value={risk.risk_statement}
                class="textarea textarea-bordered w-full"
                on:input={(e) => adjustTextareaSize(e.target as HTMLTextAreaElement)}
              ></textarea>
            </td>
            <td style="width: 250px;">
              <select bind:value={risk.classification} class="select select-bordered w-full">
                <option value={null}>Select classification</option>
                {#each classification as cls}
                  <option value={cls.id}>{cls.name}</option>
                {/each}
              </select>
            </td>
            <td>
              <textarea
                bind:value={risk.actions}
                class="textarea textarea-bordered w-full"
                on:input={(e) => adjustTextareaSize(e.target as HTMLTextAreaElement)}
              ></textarea>
            </td>
            <td>
              <textarea
                bind:value={risk.key_persons}
                class="textarea textarea-bordered w-full"
                on:input={(e) => adjustTextareaSize(e.target as HTMLTextAreaElement)}
              ></textarea>
            </td>
            <td>
              <textarea
              bind:value={risk.budget}
              class="textarea textarea-bordered w-full"
              on:input={(e) => adjustTextareaSize(e.target as HTMLTextAreaElement)}
            ></textarea>
            </td>
            <td>
              <button on:click={() => removeRow(index)} class="btn btn-error">Remove</button>
            </td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>

  <!-- Actions -->
  <div class="mt-4 flex gap-4">
    <button on:click={addRow} class="btn btn-primary">Add Row</button>
    <button on:click={saveRisks} class="btn btn-success">Save All</button>
    <button on:click={() => goto("/risks/riskAssessment")} class="btn btn-secondary">
      Create Risk Assessment
    </button>
  </div>

  <!-- Loading Indicator -->
  {#if isLoading}
    <div class="text-center mt-6">
      <span class="loading loading-spinner"></span> Loading...
    </div>
  {/if}
</div>
