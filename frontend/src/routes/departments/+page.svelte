<script lang="ts">
    import "tailwindcss/tailwind.css";
    import { onMount } from 'svelte';
    import { supabase } from '$lib/supabaseClient';
  
    let departments: Array<{ id: number; name: string; full_name: string }> = [];
    let showDialog = false;
    let isEditing = false;
  
    let currentDepartment: { id: number | null; name: string; full_name: string } = { id: null, name: '', full_name: '' };
    let alertMessage = '';
    let alertType = 'success';
    let showAlert = false;
    let isSaving = false;
    let isDeleting = false;
  
    onMount(async () => {
      await fetchDepartments();
    });
  
    const fetchDepartments = async () => {
      const { data, error } = await supabase.from('departments').select('id, name, full_name');
      if (error) {
        showAlertMessage('Error fetching departments', 'error');
      } else {
        departments = data;
      }
    };
  
    const showAlertMessage = (message: string, type: string = 'success') => {
      alertMessage = message;
      alertType = type;
      showAlert = true;
      setTimeout(() => (showAlert = false), 3000);
    };
  
    const openDialog = (department: { id: number | null; name: string; full_name: string } = { id: null, name: '', full_name: '' }) => {
      currentDepartment = { ...department };
      isEditing = department.id !== null;
      showDialog = true;
    };
  
    const closeDialog = () => {
      showDialog = false;
      currentDepartment = { id: null, name: '', full_name: '' };
    };
  
    const saveDepartment = async () => {
      isSaving = true;
      if (isEditing && currentDepartment.id !== null) {
        const { error } = await supabase.from('departments').update({
          name: currentDepartment.name,
          full_name: currentDepartment.full_name,
        }).eq('id', currentDepartment.id);
  
        if (error) {
          showAlertMessage('Error updating department', 'error');
        } else {
          showAlertMessage('Department updated successfully');
          await fetchDepartments();
          closeDialog();
        }
      } else {
        const { error } = await supabase.from('departments').insert({
          name: currentDepartment.name,
          full_name: currentDepartment.full_name,
        });
  
        if (error) {
          showAlertMessage('Error adding department', 'error');
        } else {
          showAlertMessage('Department added successfully');
          await fetchDepartments();
          closeDialog();
        }
      }
      isSaving = false;
    };
  
    const deleteDepartment = async (id: number) => {
      isDeleting = true;
      const { error } = await supabase.from('departments').delete().eq('id', id);
  
      if (error) {
        showAlertMessage('Error deleting department', 'error');
      } else {
        showAlertMessage('Department deleted successfully');
        await fetchDepartments();
      }
      isDeleting = false;
    };
  </script>
  
  <div class="min-h-screen bg-base-300 p-8">
    <h1 class="text-3xl font-bold mb-6">Department List</h1>
  
    <!-- Alert -->
    {#if showAlert}
      <div class={`alert ${alertType === 'success' ? 'alert-success' : 'alert-error'} shadow-lg mb-6`}>
        <span>{alertMessage}</span>
      </div>
    {/if}
  
    <!-- Table -->
    <div class="overflow-x-auto bg-base-100 shadow-lg rounded-lg">
      <table class="table w-full">
        <thead>
          <tr>
            <th class="px-6 py-4">Department Name</th>
            <th class="px-6 py-4">Full Name</th>
            <th class="px-6 py-4">Actions</th>
          </tr>
        </thead>
        <tbody>
          {#each departments as department}
            <tr class="hover border-b border-gray-700">
              <td class="px-6 py-4 ">{department.name}</td>
              <td class="px-6 py-4 ">{department.full_name}</td>
              <td class="px-6 py-4 flex gap-4">
                <button
                  class="btn btn-sm bg-blue-600 hover:bg-blue-700  font-medium"
                  on:click={() => openDialog(department)}
                >
                  Edit
                </button>
                <button
                  class="btn  btn-sm bg-red-600 hover:bg-red-700  font-medium {isDeleting ? 'loading' : ''}"
                  on:click={() => deleteDepartment(department.id)}
                  disabled={isDeleting}
                >
                  {#if !isDeleting} Delete {/if}
                </button>
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  
    <!-- Add Department Button -->
    <div class="mt-6">
      <button class="btn bg-indigo-600 hover:bg-indigo-700 text-white font-medium" on:click={() => openDialog()}>Add Department</button>
    </div>
  
    <!-- Dialog -->
    {#if showDialog}
      <div class="modal modal-open">
        <div class="modal-box bg-base-200">
          <h2 class="font-bold text-xl mb-4">{isEditing ? 'Edit Department' : 'Add Department'}</h2>
  
          <label for="department-name" class="block mb-2 text-white">Department Name</label>
          <input
            id="department-name"
            type="text"
            class="input input-bordered w-full mb-4"
            bind:value={currentDepartment.name}
          />
  
          <label for="full-name" class="block mb-2 text-white">Full Name</label>
          <input
            id="full-name"
            type="text"
            class="input input-bordered w-full mb-4"
            bind:value={currentDepartment.full_name}
          />
  
          <div class="modal-action">
            <button
              class="btn btn-success {isSaving ? 'loading' : ''}"
              on:click={saveDepartment}
              disabled={isSaving}
            >
              {#if !isSaving} Save {/if}
            </button>
            <button class="btn" on:click={closeDialog}>Cancel</button>
          </div>
        </div>
      </div>
    {/if}
  </div>
  