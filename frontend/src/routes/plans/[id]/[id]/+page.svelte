<script lang="ts">
  import { onMount } from 'svelte';
  import { supabase } from '$lib/supabaseClient';
  import { page } from '$app/stores';
  import jsPDF from 'jspdf';
  import autoTable from 'jspdf-autotable'; // Import autotable

  interface ActionPlan {
    id: number;
    actions_taken: string;
    kpi: string;
    target_output: string;
    key_person_responsible: string;
    created_at: string;
    objective_id: number;
  }

  interface StrategicObjective {
    id: number;
    name: string;
  }

  interface StrategicGoal {
    id: number;
    name: string;
  }

  let actionPlans: ActionPlan[] = [];
  let objective: StrategicObjective | null = null;
  let strategicGoal: StrategicGoal | null = null;
  let objective_id: number | null = null;
  let isLoading = true;

  // Fetch data on page load
  onMount(async () => {
    const { params } = $page;
    objective_id = parseInt(params.id);

    if (objective_id) {
      try {
        // Fetch action plans
        const { data: plansData, error: plansError } = await supabase
          .from('action_plans')
          .select('*')
          .eq('objective_id', objective_id);

        if (plansError) {
          console.error('Error fetching action plans:', plansError);
        } else {
          actionPlans = plansData;
        }

        // Fetch objective
        const { data: objectiveData, error: objectiveError } = await supabase
          .from('strategic_objectives')
          .select('id, name, strategic_goal_id')
          .eq('id', objective_id)
          .single();

        if (objectiveError) {
          console.error('Error fetching objective:', objectiveError);
        } else {
          objective = objectiveData;

          // Fetch strategic goal
          const { data: goalData, error: goalError } = await supabase
            .from('strategic_goals')
            .select('id, name')
            .eq('id', objectiveData.strategic_goal_id)
            .single();

          if (goalError) {
            console.error('Error fetching strategic goal:', goalError);
          } else {
            strategicGoal = goalData;
          }
        }
      } catch (error) {
        console.error('Error:', error);
      } finally {
        isLoading = false;
      }
    } else {
      console.error('Objective ID is missing.');
      isLoading = false;
    }
  });

  // Export to PDF using jsPDF and AutoTable
  const exportToPDF = () => {
    const doc = new jsPDF('landscape');
    const title = `Action Plans for Objective: ${objective?.name || 'N/A'}`;
    const goalName = strategicGoal ? `Strategic Goal: ${strategicGoal.name}` : 'No Strategic Goal Assigned';

    // Add title
    doc.setFontSize(10);
    doc.text(title, 14, 15);
    doc.text(goalName, 14, 25);

    // Define table data
    const columns = ['Actions Taken', 'KPI', 'Target Output', 'Key Person Responsible'];
    const rows = actionPlans.map((plan) => [
      plan.actions_taken,
      plan.kpi,
      plan.target_output,
      plan.key_person_responsible,
    ]);

    // Add AutoTable
    autoTable(doc, {
      head: [columns],
      body: rows,
      startY: 35,
      theme: 'grid',
      styles: { fontSize: 10 },
      headStyles: { fillColor: [41, 128, 185] }, // Blue color for header
    });

    doc.save('ActionPlans.pdf');
  };

  // Delete a specific action plan by ID
  const deleteActionPlan = async (id: number) => {
    try {
      const { error } = await supabase.from('action_plans').delete().eq('id', id);

      if (error) {
        console.error('Error deleting action plan:', error);
      } else {
        actionPlans = actionPlans.filter((plan) => plan.id !== id);
      }
    } catch (error) {
      console.error('Error deleting action plan:', error);
    }
  };
</script>

<!-- HTML Structure -->
<div class="min-h-screen bg-base-300 p-8">
  <h1 class="text-2xl font-bold mb-4">Action Plans</h1>

  <!-- Objective and Goal Information -->
  <div class="mb-4">
    {#if objective}
      <p><strong>Objective Name:</strong> {objective.name}</p>
      {#if strategicGoal}
        <p><strong>Strategic Goal:</strong> {strategicGoal.name}</p>
      {/if}
    {:else if isLoading}
      <h2 class="text-xl font-bold">Loading Objective...</h2>
    {:else}
      <h2 class="text-xl font-bold">Objective not found.</h2>
    {/if}
  </div>

  <!-- Export to PDF -->
  <button class="btn btn-secondary mb-4" on:click={exportToPDF}>
    Export to PDF
  </button>

  <!-- Table for Action Plans -->
  {#if isLoading}
    <div>Loading action plans...</div>
  {:else if actionPlans.length > 0}
    <div class="overflow-x-auto">
      <table class="table table-zebra w-full shadow-lg rounded-lg">
        <thead>
          <tr>
            <th>Actions Taken</th>
            <th>KPI</th>
            <th>Target Output</th>
            <th>Key Person Responsible</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {#each actionPlans as plan}
            <tr>
              <td>{plan.actions_taken}</td>
              <td>{plan.kpi}</td>
              <td>{plan.target_output}</td>
              <td>{plan.key_person_responsible}</td>
              <td class="flex space-x-2">
                <button class="btn btn-sm btn-success text-white">Approve Plan</button>
                <button
                  class="btn btn-sm btn-error text-white"
                  on:click={() => deleteActionPlan(plan.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  {:else}
    <div>No action plans found for this objective.</div>
  {/if}
</div>

<style>
  .table {
    border-spacing: 0;
    border-collapse: separate;
    width: 100%;
  }
  .btn {
    padding: 8px 16px;
    border-radius: 6px;
    cursor: pointer;
  }
  .btn-error {
    background-color: #ef4444;
  }
  .btn-success {
    background-color: #10b981;
  }
  .btn-secondary {
    background-color: #3b82f6;
  }
</style>
