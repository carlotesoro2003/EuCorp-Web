<script lang="ts">
    import { onMount } from 'svelte';
    import { supabase } from '$lib/supabaseClient';
    import { page } from '$app/stores';
  
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
  
    let actionPlans: ActionPlan[] = [];
    let objective: StrategicObjective | null = null;
    let objective_id: number | null = null;
    let isLoading = true;
  
    // Fetch action plans and objective name on page load
    onMount(async () => {
      const { params } = $page;
      objective_id = parseInt(params.id);
  
      if (objective_id) {
        try {
          const { data: plansData, error: plansError } = await supabase
            .from('action_plans')
            .select('*')
            .eq('objective_id', objective_id);
  
          if (plansError) {
            console.error('Error fetching action plans:', plansError);
          } else {
            actionPlans = plansData;
          }
  
          const { data: objectiveData, error: objectiveError } = await supabase
            .from('strategic_objectives')
            .select('id, name')
            .eq('id', objective_id)
            .single();
  
          if (objectiveError) {
            console.error('Error fetching objective:', objectiveError);
          } else {
            objective = objectiveData;
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
  
  <div class="min-h-screen bg-base-300 p-8">
    <h1 class="text-2xl font-bold mb-4">Action Plans</h1>
  
    <!-- Objective Information -->
    <div class="mb-4">
      {#if objective}
        <p class="">Objective Name: {objective.name}</p>
      {:else if isLoading}
        <h2 class="text-xl font-bold">Loading Objective...</h2>
      {:else}
        <h2 class="text-xl font-bold">Objective not found.</h2>
      {/if}
    </div>
  
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
  </style>
  