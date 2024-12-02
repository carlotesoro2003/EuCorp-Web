<script lang="ts">
  import "tailwindcss/tailwind.css";
  import { onMount } from 'svelte';
  import { supabase } from '$lib/supabaseClient';
  import { goto } from "$app/navigation";

  interface StrategicGoal {
      id: number;
      goal_no: number;
      name: string;
      description: string;
      kpi: string;
      lead_id: number | null;
  }

  interface Lead {
      id: number;
      name: string;
  }

  let isEditing = false; // NEW: Track if editing or creating
  let goal_no = 0;
  let name = '';
  let description = '';
  let kpi = '';
  let lead_id: number | null = null;
  let strategicGoals: StrategicGoal[] = [];
  let leads: Lead[] = [];
  let isDialogOpen = false;
  let isLoading = false;
  let alertMessage: string | null = null;
  let alertType: 'success' | 'error' | null = null;

  const fetchLeads = async (): Promise<void> => {
      isLoading = true;
      const { data, error } = await supabase.from('leads').select('id, name');
      isLoading = false;
      if (error) {
          showAlert('Error fetching leads', 'error');
      } else {
          leads = data as Lead[];
      }
  };

  const fetchStrategicGoals = async (): Promise<void> => {
      isLoading = true;
      const { data, error } = await supabase
          .from('strategic_goals')
          .select('*')
          .order('goal_no', { ascending: true });
      isLoading = false;
      if (error) {
          showAlert('Error fetching strategic goals', 'error');
      } else {
          strategicGoals = data as StrategicGoal[];
          goal_no = strategicGoals.length > 0
              ? Math.max(...strategicGoals.map((goal) => goal.goal_no)) + 1
              : 1;
      }
  };

  const createStrategicGoal = async (): Promise<void> => {
      isLoading = true;
      const { error } = await supabase.from('strategic_goals').insert([{
          goal_no,
          name,
          description,
          kpi,
          lead_id,
      }]);
      isLoading = false;
      if (error) {
          showAlert('Error creating goal', 'error');
      } else {
          showAlert('Goal created successfully', 'success');
          toggleDialog();
          fetchStrategicGoals();
      }
  };

  const updateStrategicGoal = async (): Promise<void> => {
      isLoading = true;
      const { error } = await supabase
          .from('strategic_goals')
          .update({ name, description, kpi, lead_id })
          .match({ goal_no });
      isLoading = false;
      if (error) {
          showAlert('Error updating goal', 'error');
      } else {
          showAlert('Goal updated successfully', 'success');
          toggleDialog();
          fetchStrategicGoals();
      }
  };

  const deleteStrategicGoal = async (id: number): Promise<void> => {
      isLoading = true;
      const { error } = await supabase.from('strategic_goals').delete().match({ id });
      if (error) {
          showAlert('Error deleting goal', 'error');
      } else {
          // Reorder remaining goals
          const { data: remainingGoals, error: reorderError } = await supabase
              .from('strategic_goals')
              .select('*')
              .order('goal_no', { ascending: true });
          if (reorderError) {
              showAlert('Error reordering goals', 'error');
          } else {
              for (let i = 0; i < remainingGoals.length; i++) {
                  await supabase
                      .from('strategic_goals')
                      .update({ goal_no: i + 1 })
                      .match({ id: remainingGoals[i].id });
              }
              showAlert('Goal deleted and reordered successfully', 'success');
              fetchStrategicGoals();
          }
      }
      isLoading = false;
  };

  const showAlert = (message: string, type: 'success' | 'error') => {
      alertMessage = message;
      alertType = type;
      setTimeout(() => {
          alertMessage = null;
      }, 3000);
  };

  const openCreateDialog = () => {
      isEditing = false; // NEW: Not editing, creating a new goal
      goal_no = strategicGoals.length > 0
          ? Math.max(...strategicGoals.map((goal) => goal.goal_no)) + 1
          : 1;
      name = '';
      description = '';
      kpi = '';
      lead_id = null;
      isDialogOpen = true;
  };

  const openEditDialog = (goal: StrategicGoal) => {
      isEditing = true; // NEW: Editing an existing goal
      goal_no = goal.goal_no;
      name = goal.name;
      description = goal.description;
      kpi = goal.kpi;
      lead_id = goal.lead_id;
      isDialogOpen = true;
  };

  const toggleDialog = () => {
      isDialogOpen = !isDialogOpen;
  };

  const getLeadNameById = (leadId: number | null): string => {
      const lead = leads.find((l) => l.id === leadId);
      return lead ? lead.name : 'No Lead Assigned';
  };

  const viewObjectives = (goalId: number) => {
      goto(`/plans/${goalId}`);
  };

  onMount(() => {
      fetchLeads();
      fetchStrategicGoals();
  });
</script>

<div class="container bg-base-300 mx-auto p-4">
  <!-- Alert Message -->
  {#if alertMessage}
      <div class="alert alert-{alertType} mb-4 text-white">
          <span>{alertMessage}</span>
      </div>
  {/if}

  <!-- Dialog Box for Creating or Editing Goals -->
  {#if isDialogOpen}
      <div class="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
          <div class="p-6 rounded-lg shadow-xl w-96 bg-gray-700">
              <h2 class="text-xl font-semibold mb-4 ">{isEditing ? 'Edit' : 'Create'} Strategic Goal</h2>
              <form on:submit|preventDefault={isEditing ? updateStrategicGoal : createStrategicGoal}>
                  <div class="form-control mb-4">
                      <label for="name" class="label">Name</label>
                      <textarea
                          id="name"
                          bind:value={name}
                          placeholder="Enter goal name"
                          class="textarea textarea-bordered w-full "
                          required
                      ></textarea>
                  </div>
                  <div class="form-control mb-4">
                      <label for="description" class="label">Description</label>
                      <textarea
                          id="description"
                          bind:value={description}
                          placeholder="Enter description"
                          class="textarea textarea-bordered w-full "
                          required
                      ></textarea>
                  </div>
                  <div class="form-control mb-4">
                      <label for="kpi" class="label">KPI</label>
                      <textarea
                          id="kpi"
                          bind:value={kpi}
                          placeholder="Enter KPI"
                          class="textarea textarea-bordered w-full "
                          required
                      ></textarea>
                  </div>
                  <div class="form-control mb-4">
                      <label for="lead_id" class="label">Select Lead</label>
                      <select
                          id="lead_id"
                          bind:value={lead_id}
                          class="select select-bordered w-full"
                      >
                          <option value={null} disabled selected>Select a lead</option>
                          {#each leads as lead}
                              <option value={lead.id}>{lead.name}</option>
                          {/each}
                      </select>
                  </div>
                  <button type="submit" class="btn btn-primary w-full ">
                      {isEditing ? 'Update' : 'Create'} Goal
                  </button>
              </form>
              <button
                  class="btn btn-secondary mt-4 w-full "
                  on:click={toggleDialog}
              >
                  Close
              </button>
          </div>
      </div>
  {/if}

  <!-- Strategic Goals Table -->
  <h1 class=" text-3xl font-bold mb-4">Strategic Goals</h1>
  <button class="btn bg-indigo-600 hover:bg-indigo-700 text-white font-medium mb-5 " on:click={openCreateDialog}>Add Strategic Goal</button>
  {#if isLoading}
      <div class="flex justify-center items-center py-6">
          <span class="loading loading-spinner text-primary">Loading...</span>
      </div>
  {/if}
  {#if strategicGoals.length === 0 && !isLoading}
      <div class="text-center py-4  text-lg">No strategic goals found.</div>
  {:else}
      <table class="table table-zebra w-full">
          <thead>
              <tr>
                  <th>Goal No</th>
                  <th>Name</th>
                  <th>Description</th>
                  <th>KPI</th>
                  <th>Lead</th>
                  <th>Actions</th>
              </tr>
          </thead>
          <tbody>
              {#each strategicGoals as goal}
                  <tr>
                      <td>{goal.goal_no}</td>
                      <td>{goal.name}</td>
                      <td>{goal.description}</td>
                      <td>{goal.kpi}</td>
                      <td>{getLeadNameById(goal.lead_id)}</td>
                      <td class="flex justify-center space-x-2">
                          <button class="btn btn-sm bg-teal-500 hover:bg-teal-600 text-white font-medium" on:click={() => viewObjectives(goal.id)}>View</button>
                          <button class="btn btn-sm bg-blue-600 hover:bg-blue-700 text-white font-medium" on:click={() => openEditDialog(goal)}>Edit</button>
                          <button class="btn btn-sm bg-red-600 hover:bg-red-700  text-white font-medium" on:click={() => deleteStrategicGoal(goal.id)}>Delete</button>
                      </td>
                  </tr>
              {/each}
          </tbody>
      </table>
  {/if}
</div>
