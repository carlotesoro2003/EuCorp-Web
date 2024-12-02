<script lang="ts">
  import { supabase } from "$lib/supabaseClient";
  import { onMount } from "svelte";

  interface StrategicGoal {
    id: number;
    name: string;
  }

  interface StrategicObjective {
    name: string;
    strategic_initiatives: string;
    kpi: string;
    persons_involved: string;
    target: string;
    eval_measures: string;
    strategic_goal_id: number;
    profile_id: string;
  }

  let session: any = null;
  let profile: any = null;
  let strategicGoals: StrategicGoal[] = [];
  let selectedGoal: number | null = null;
  let objectives: StrategicObjective[] = [
    {
      name: "",
      strategic_initiatives: "",
      kpi: "",
      persons_involved: "",
      target: "",
      eval_measures: "",
      strategic_goal_id: 0,
      profile_id: "",
    },
  ];
  let uploadedImageUrl: string | null = null;
  let loading: boolean = true;

  // Alert states
  let successMessage: string | null = null;
  let errorMessage: string | null = null;

  // Fetch user profile details
  const fetchUserProfile = async () => {
    try {
      const { data: sessionData, error: sessionError } =
        await supabase.auth.getSession();
      if (sessionError) throw sessionError;

      session = sessionData.session;
      if (session) {
        const { user } = session;
        const { data, error } = await supabase
          .from("profiles")
          .select("first_name, last_name, email, role, profile_pic, id")
          .eq("id", user.id)
          .single();
        if (error) throw error;

        profile = data;
        uploadedImageUrl = profile.profile_pic || null;
      }
    } catch (error) {
      errorMessage = (error as Error).message;
    } finally {
      loading = false;
    }
  };

  // Fetch Strategic Goals
  const fetchStrategicGoals = async () => {
    try {
      const { data, error } = await supabase
        .from("strategic_goals")
        .select("id, name");
      if (error) throw error;

      strategicGoals = data;
    } catch (error) {
      errorMessage = "Failed to fetch strategic goals.";
    }
  };

  // Add a new row for Strategic Objectives
  const addRow = () => {
    objectives = [
      ...objectives,
      {
        name: "",
        strategic_initiatives: "",
        kpi: "",
        persons_involved: "",
        target: "",
        eval_measures: "",
        strategic_goal_id: selectedGoal || 0,
        profile_id: profile?.id || "",
      },
    ];
  };

  // Remove a row from Strategic Objectives table
  const removeRow = (index: number) => {
    if (objectives.length > 1)
      objectives = objectives.filter((_, i) => i !== index);
  };

  // Validate and Submit Strategic Objectives
  const handleSubmit = async () => {
    try {
      if (!selectedGoal) throw new Error("Please select a strategic goal");
      if (!profile?.id) throw new Error("Invalid profile");

      // Check if all fields in each objective are filled
      for (const obj of objectives) {
        if (
          !obj.name.trim() ||
          !obj.strategic_initiatives.trim() ||
          !obj.kpi.trim() ||
          !obj.persons_involved.trim() ||
          !obj.target.trim() ||
          !obj.eval_measures.trim()
        ) {
          throw new Error("Please fill in all fields for each objective");
        }
      }

      const insertData = objectives.map((obj) => ({
        ...obj,
        strategic_goal_id: selectedGoal,
        profile_id: profile.id,
      }));
      const { error } = await supabase
        .from("strategic_objectives")
        .insert(insertData);
      if (error) throw error;

      successMessage = "Strategic Objectives added successfully!";
      objectives = [
        {
          name: "",
          strategic_initiatives: "",
          kpi: "",
          persons_involved: "",
          target: "",
          eval_measures: "",
          strategic_goal_id: 0,
          profile_id: "",
        },
      ]; // Reset the form
    } catch (error) {
      errorMessage = (error as Error).message;
    }
  };

  // Clear alerts after a few seconds
  $: if (successMessage || errorMessage) {
    setTimeout(() => {
      successMessage = null;
      errorMessage = null;
    }, 5000);
  }

  // Fetch the data on mount
  onMount(() => {
    fetchUserProfile();
    fetchStrategicGoals();
  });
</script>

<div class="min-h-screen bg-base-300 p-8">
  <h1 class="text-2xl font-bold mb-4 text-white">Create Strategic Objectives</h1>

  <!-- Alerts -->
  {#if successMessage}
    <div class="alert alert-success shadow-lg my-4">
      <div>
        <span>{successMessage}</span>
      </div>
    </div>
  {/if}
  {#if errorMessage}
    <div class="alert alert-error shadow-lg my-4">
      <div>
        <span>{errorMessage}</span>
      </div>
    </div>
  {/if}

  <!-- Goal Selection -->
  <div class="mb-4">
    <label for="strategic_goal" class="block text-lg font-bold text-white mb-2"
      >Select Strategic Goal</label
    >
    <select
      id="strategic_goal"
      bind:value={selectedGoal}
      class="select select-bordered w-full font-semibold"
      required
    >
      <option value={null} disabled selected>Select a goal</option>
      {#each strategicGoals as goal}
        <option value={goal.id}>{goal.name}</option>
      {/each}
    </select>
  </div>

  <!-- Dynamic Table for Objectives -->
  <div class="overflow-x-auto">
    <table class="table w-full table-zebra shadow-lg rounded-lg">
      <thead>
        <tr>
          <th>Objective Name</th>
          <th>Strategic Initiatives</th>
          <th>KPI</th>
          <th>Persons Involved</th>
          <th>Target</th>
          <th>Evaluation Measures</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {#each objectives as objective, index}
          <tr>
            <td>
              <textarea
                bind:value={objective.name}
                class="textarea textarea-bordered w-full"
                placeholder="Enter objective name"
              ></textarea>
            </td>
            <td>
              <textarea
                bind:value={objective.strategic_initiatives}
                class="textarea textarea-bordered w-full"
                placeholder="Enter strategic initiatives"
              ></textarea>
            </td>
            <td>
              <textarea
                bind:value={objective.kpi}
                class="textarea textarea-bordered w-full"
                placeholder="Enter KPI"
              ></textarea>
            </td>
            <td>
              <textarea
                bind:value={objective.persons_involved}
                class="textarea textarea-bordered w-full"
                placeholder="Enter persons involved"
              ></textarea>
            </td>
            <td>
              <textarea
                bind:value={objective.target}
                class="textarea textarea-bordered w-full"
                placeholder="Enter target"
              ></textarea>
            </td>
            <td>
              <textarea
                bind:value={objective.eval_measures}
                class="textarea textarea-bordered w-full"
                placeholder="Enter evaluation measures"
              ></textarea>
            </td>
            <td>
              <button class="btn btn-error btn-sm" on:click={() => removeRow(index)}>
                Delete
              </button>
            </td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>

  <!-- Add and Submit Buttons -->
  <div class="flex space-x-4 mt-4">
    <button class="btn btn-primary" on:click={addRow}>
      Add Objective
    </button>
    <button class="btn btn-success" on:click={handleSubmit}>
      Submit Objectives
    </button>
  </div>
</div>

