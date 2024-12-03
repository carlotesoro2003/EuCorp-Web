<script lang="ts">
  import { onMount } from "svelte";
  import { supabase } from "$lib/supabaseClient";
  import { page } from "$app/stores";
  import { goto } from "$app/navigation";
  import jsPDF from "jspdf";
  import autoTable from "jspdf-autotable";

  interface StrategicObjective {
    id: number;
    name: string;
    strategic_initiatives: string;
    kpi: string;
    persons_involved: string;
    target: string;
    eval_measures: string;
    strategic_goal_id: number;
    profile_id: string;
  }

  interface StrategicGoal {
    id: number;
    goal_no: number;
    name: string;
    lead: string;
  }

  let goal: StrategicGoal | null = null;
  let objectives: StrategicObjective[] = [];
  let isLoading = false;
  let goalId: number | null = null;

  let editingObjective: StrategicObjective | null = null;
  let updatedObjective: StrategicObjective = {} as StrategicObjective;

  const fetchGoalDetails = async (): Promise<void> => {
    if (goalId === null) return;
    isLoading = true;

    try {
      const { data: goalData, error: goalError } = await supabase
        .from("strategic_goals")
        .select("id, name, goal_no, lead_id")
        .eq("id", goalId)
        .single();

      if (goalError || !goalData) {
        throw new Error("Failed to fetch goal details");
      }

      goal = {
        id: goalData.id,
        name: goalData.name,
        goal_no: goalData.goal_no,
        lead: "",
      };

      if (goalData.lead_id) {
        const { data: leadData, error: leadError } = await supabase
          .from("leads")
          .select("name")
          .eq("id", goalData.lead_id)
          .single();

        if (leadError) {
          console.error("Error fetching lead name:", leadError);
        } else if (leadData) {
          goal.lead = leadData.name;
        }
      }

      const { data: objectiveData, error: objectiveError } = await supabase
        .from("strategic_objectives")
        .select("*")
        .eq("strategic_goal_id", goalId);

      if (objectiveError) {
        throw new Error("Failed to fetch objectives");
      }

      objectives = objectiveData || [];
    } catch (error) {
      console.error(error);
    } finally {
      isLoading = false;
    }
  };

  const updateObjective = async () => {
    if (editingObjective) {
      const { error } = await supabase
        .from("strategic_objectives")
        .update(updatedObjective)
        .eq("id", editingObjective.id);

      if (error) {
        console.error("Error updating objective:", error);
      } else {
        fetchGoalDetails();
        editingObjective = null;
      }
    }
  };

  const handleObjectiveClick = (objectiveId: number) => {
    if (goalId !== null) {
      goto(`/plans/${goalId}/${objectiveId}`);
    }
  };

  const exportToPDF = () => {
    const doc = new jsPDF("landscape", "mm", "a4"); // Landscape orientation

    // Add title
    doc.setFontSize(18);
    doc.text("Strategic Objectives", 14, 20);

    // Add goal details
    if (goal) {
      doc.setFontSize(12);
      doc.text(`Goal Name: ${goal.name}`, 14, 30); // Goal Name
      doc.text(`Lead: ${goal.lead}`, 14, 37); // Lead Name
    }

    // Prepare table rows
    const rows = objectives.map((obj) => [
      obj.name,
      obj.strategic_initiatives,
      obj.kpi,
      obj.persons_involved,
      obj.target,
      obj.eval_measures,
    ]);

    // Define column headers
    const headers = [
      "Strategic Objectives",
      "Strategic Initiatives",
      "KPI",
      "Persons Involved",
      "Target",
      "Evaluation Measures",
    ];

    // Add table to PDF
    autoTable(doc, {
      head: [headers],
      body: rows,
      startY: 45, // Start below the goal details
      theme: "grid",
      styles: { fontSize: 10 }, // Adjust font size for better fitting
    });

    // Save the PDF
    doc.save("StrategicObjectives.pdf");
  };

  onMount(() => {
    $: goalId = $page.params.id ? parseInt($page.params.id) : null;
    fetchGoalDetails();
  });
</script>

<div class="container mx-auto p-4">
  {#if isLoading}
    <span class="loading loading-spinner text-primary">Loading...</span>
  {/if}

  {#if !isLoading && objectives.length > 0}
    <div class="mt-8">
      <h1 class="text-3xl font-bold mb-4">
        Strategic Objectives for Goal {goal?.goal_no}
      </h1>
      {#if goal}
        <p class="mb-4"><strong>Goal Name:</strong> {goal.name}</p>
        <p class="mb-4"><strong>Lead:</strong> {goal.lead}</p>
      {:else}
        <p>Goal details not found.</p>
      {/if}
      <a href="/plans/strategicPlans" class="btn btn-primary text-white mt-4">
        Add More Strategic Objectives
      </a>
      <button on:click={exportToPDF} class="btn btn-secondary text-white mt-4">
        Export to PDF
      </button>
      <table class="table table-zebra w-full mt-5">
        <thead>
          <tr>
            <th>Strategic Objectives</th>
            <th>Strategic Initiatives</th>
            <th>KPI</th>
            <th>Persons Involved</th>
            <th>Target</th>
            <th>Evaluation Measures</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {#each objectives as objective}
            <tr>
              {#if editingObjective?.id === objective.id}
                <td>
                  <textarea
                    bind:value={updatedObjective.name}
                    class="textarea textarea-bordered w-full"
                  ></textarea>
                </td>
                <td>
                  <textarea
                    bind:value={updatedObjective.strategic_initiatives}
                    class="textarea textarea-bordered w-full"
                  ></textarea>
                </td>
                <td>
                  <textarea
                    bind:value={updatedObjective.kpi}
                    class="textarea textarea-bordered w-full"
                  ></textarea>
                </td>
                <td>
                  <textarea
                    bind:value={updatedObjective.persons_involved}
                    class="textarea textarea-bordered w-full"
                  ></textarea>
                </td>
                <td>
                  <textarea
                    bind:value={updatedObjective.target}
                    class="textarea textarea-bordered w-full"
                  ></textarea>
                </td>
                <td>
                  <textarea
                    bind:value={updatedObjective.eval_measures}
                    class="textarea textarea-bordered w-full"
                  ></textarea>
                </td>
                <td>
                  <button on:click={updateObjective} class="btn btn-primary">
                    Save
                  </button>
                  <button
                    on:click={() => (editingObjective = null)}
                    class="btn btn-secondary"
                  >
                    Cancel
                  </button>
                </td>
              {:else}
                <td>{objective.name}</td>
                <td>{objective.strategic_initiatives}</td>
                <td>{objective.kpi}</td>
                <td>{objective.persons_involved}</td>
                <td>{objective.target}</td>
                <td>{objective.eval_measures}</td>
                <td>
                  <button
                    on:click={() => handleObjectiveClick(objective.id)}
                    class="btn btn-primary text-white"
                  >
                    View
                  </button>
                  <button
                    on:click={() => {
                      editingObjective = objective;
                      updatedObjective = { ...objective };
                    }}
                    class="btn btn-secondary text-white"
                  >
                    Edit
                  </button>
                </td>
              {/if}
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  {:else}
    <div class="mt-8">
      <p>No objectives found for this goal.</p>
      <a href="/plans/strategicPlans" class="btn btn-primary text-white mt-4">
        Add Strategic Objectives for this Goal
      </a>
    </div>
  {/if}
</div>

<style>
  .textarea {
    resize: none;
    overflow: hidden;
  }
</style>
