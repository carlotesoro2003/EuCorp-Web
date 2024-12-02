<script lang="ts">
  import { onMount } from 'svelte';
  import { supabase } from '$lib/supabaseClient';
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';

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

  let editingObjective: StrategicObjective | null = null; // Track the objective being edited
  let updatedObjective: StrategicObjective = {} as StrategicObjective; // Track updates

  const fetchGoalDetails = async (): Promise<void> => {
    if (goalId === null) return;
    isLoading = true;

    try {
      // Fetch goal details
      const { data: goalData, error: goalError } = await supabase
        .from('strategic_goals')
        .select('id, name, goal_no, lead_id')
        .eq('id', goalId)
        .single();

      if (goalError || !goalData) {
        throw new Error('Failed to fetch goal details');
      }

      goal = {
        id: goalData.id,
        name: goalData.name,
        goal_no: goalData.goal_no,
        lead: '', // Placeholder for lead name
      };

      // Fetch lead name using the lead_id from the strategic_goals table
      if (goalData.lead_id) {
        const { data: leadData, error: leadError } = await supabase
          .from('leads')
          .select('name')
          .eq('id', goalData.lead_id)
          .single();

        if (leadError) {
          console.error('Error fetching lead name:', leadError);
        } else if (leadData) {
          goal.lead = leadData.name; // Assign the lead name
        }
      }

      // Fetch objectives for this goal
      const { data: objectiveData, error: objectiveError } = await supabase
        .from('strategic_objectives')
        .select('*')
        .eq('strategic_goal_id', goalId);

      if (objectiveError) {
        throw new Error('Failed to fetch objectives');
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
        .from('strategic_objectives')
        .update(updatedObjective)
        .eq('id', editingObjective.id);

      if (error) {
        console.error('Error updating objective:', error);
      } else {
        // Re-fetch objectives on success
        fetchGoalDetails();
        editingObjective = null; // Close the edit form
      }
    }
  };

  const handleObjectiveClick = (objectiveId: number) => {
    if (goalId !== null) {
      goto(`/plans/${goalId}/${objectiveId}`); // Navigate to the individual objective page
    }
  };

  onMount(() => {
    // Retrieve the goal ID from the URL
    $: goalId = $page.params.id ? parseInt($page.params.id) : null;

    // Fetch goal details and objectives once the ID is set
    fetchGoalDetails();
  });
</script>

<div class="container mx-auto p-4">
  <!-- Loading Spinner -->
  {#if isLoading}
    <span class="loading loading-spinner text-primary">Loading...</span>
  {/if}

  <!-- Displaying Objectives -->
  {#if !isLoading && objectives.length > 0}
    <div class="mt-8">
      <h1 class="text-3xl font-bold mb-4">Strategic Objectives for Goal {goal?.goal_no}</h1>
      {#if goal}
        <p class="mb-4"><strong>Goal Name: </strong> {goal.name}</p>
        <p class="mb-4"><strong>Lead: </strong> {goal.lead}</p>
      {:else}
        <p>Goal details not found.</p>
      {/if}
      <a href="/plans/strategicPlans" class="btn btn-primary text-white mt-4">Add More Strategic Objectives</a>
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
                <!-- Editable Row -->
                <td>
                  <textarea
                    bind:value={updatedObjective.name}
                    class="textarea textarea-bordered w-full"
                    on:input={(e) => {
                      const target = e.target as HTMLTextAreaElement;
                      if (target) {
                        target.style.height = `${target.scrollHeight}px`;
                      }
                    }}
                    rows="1"
                  ></textarea>
                </td>
                <td>
                  <textarea
                    bind:value={updatedObjective.strategic_initiatives}
                    class="textarea textarea-bordered w-full"
                    on:input={(e) => {
                      const target = e.target as HTMLTextAreaElement;
                      if (target) {
                        target.style.height = `${target.scrollHeight}px`;
                      }
                    }}
                    rows="1"
                  ></textarea>
                </td>
                <td>
                  <textarea
                    bind:value={updatedObjective.kpi}
                    class="textarea textarea-bordered w-full"
                    on:input={(e) => {
                      const target = e.target as HTMLTextAreaElement;
                      if (target) {
                        target.style.height = `${target.scrollHeight}px`;
                      }
                    }}
                    rows="1"
                  ></textarea>
                </td>
                <td>
                  <textarea
                    bind:value={updatedObjective.persons_involved}
                    class="textarea textarea-bordered w-full"
                    on:input={(e) => {
                      const target = e.target as HTMLTextAreaElement;
                      if (target) {
                        target.style.height = `${target.scrollHeight}px`;
                      }
                    }}
                    rows="1"
                  ></textarea>
                </td>
                <td>
                  <textarea
                    bind:value={updatedObjective.target}
                    class="textarea textarea-bordered w-full"
                    on:input={(e) => {
                      const target = e.target as HTMLTextAreaElement;
                      if (target) {
                        target.style.height = `${target.scrollHeight}px`;
                      }
                    }}
                    rows="1"
                  ></textarea>
                </td>
                <td>
                  <textarea
                    bind:value={updatedObjective.eval_measures}
                    class="textarea textarea-bordered w-full"
                    on:input={(e) => {
                      const target = e.target as HTMLTextAreaElement;
                      if (target) {
                        target.style.height = `${target.scrollHeight}px`;
                      }
                    }}
                    rows="1"
                  ></textarea>
                </td>
                <td>
                  <button on:click={updateObjective} class="btn btn-primary">Save</button>
                  <button on:click={() => editingObjective = null} class="btn btn-secondary">Cancel</button>
                </td>
              {:else}
                <!-- Non-Editable Row -->
                <td>{objective.name}</td>
                <td>{objective.strategic_initiatives}</td>
                <td>{objective.kpi}</td>
                <td>{objective.persons_involved}</td>
                <td>{objective.target}</td>
                <td>{objective.eval_measures}</td>
                <td>
                  <button on:click={() => handleObjectiveClick(objective.id)} class="btn btn-primary text-white">View</button>
                  <button on:click={() => { editingObjective = objective; updatedObjective = { ...objective }; }} class="btn btn-secondary text-white">Edit</button>
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
      <a href="/plans/strategicPlans" class="btn btn-primary text-white mt-4">Add Strategic Objectives for this Goal</a>
    </div>
  {/if}
</div>

<style>
  .textarea {
    resize: none;
    overflow: hidden;
  }
</style>
