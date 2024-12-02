<script lang="ts">
    import { supabase } from "$lib/supabaseClient";
    import { onMount } from "svelte";

    interface Leads {
        id: number;
        name: string;
    }

    let leads: Leads[] = [];
    let isLoading = false;
    let isSaving = false;
    let errorMessage: string | null = null;
    let successMessage: string | null = null;

    // Variables for dialog and form fields
    let showDialog = false;
    let isEditing = false;
    let formLead: Leads = { id: 0, name: "" };

    // Fetch all leads
    const fetchLeads = async () => {
        isLoading = true;
        const { data, error } = await supabase
            .from("leads")
            .select("*");

        if (error) {
            console.error("Error fetching leads:", error);
            errorMessage = "Failed to fetch leads.";
        } else {
            leads = data;
            errorMessage = null;
        }

        isLoading = false;
    };

    // Create or update lead
    const saveLead = async () => {
        isSaving = true;
        const { data, error } = isEditing
            ? await supabase.from("leads").update({ name: formLead.name }).eq("id", formLead.id)
            : await supabase.from("leads").insert([{ name: formLead.name }]);

        if (error) {
            console.error("Error saving lead:", error);
            errorMessage = "Failed to save lead.";
        } else {
            successMessage = isEditing ? "Lead updated successfully!" : "Lead added successfully!";
            errorMessage = null;
            await fetchLeads();
            closeDialog();
        }
        isSaving = false;
    };

    // Delete lead
    const deleteLead = async (id: number) => {
        isSaving = true;
        const { error } = await supabase.from("leads").delete().eq("id", id);

        if (error) {
            console.error("Error deleting lead:", error);
            errorMessage = "Failed to delete lead.";
        } else {
            successMessage = "Lead deleted successfully!";
            errorMessage = null;
            await fetchLeads();
        }
        isSaving = false;
    };

    // Open dialog for creating a new lead
    const openDialogForNewLead = () => {
        formLead = { id: 0, name: "" };
        isEditing = false;
        showDialog = true;
    };

    // Open dialog for editing an existing lead
    const openDialogForEdit = (lead: Leads) => {
        formLead = { ...lead };
        isEditing = true;
        showDialog = true;
    };

    // Close dialog
    const closeDialog = () => {
        formLead = { id: 0, name: "" };
        isEditing = false;
        showDialog = false;
    };

    // Initialize leads on mount
    onMount(() => {
        fetchLeads();
    });
</script>

<div class="container mx-auto px-6">
    <h2 class="text-2xl  font-bold mb-6">Leads</h2>

    
    <!-- Add Lead Button -->
    <button on:click={openDialogForNewLead} class="mt-4 mb-4  btn bg-indigo-600 hover:bg-indigo-700 text-white">Add Lead</button>
    

    <!-- Success and Error Alerts -->
    {#if successMessage}
        <div class="alert alert-success shadow-lg mb-4">{successMessage}</div>
    {/if}
    {#if errorMessage}
        <div class="alert alert-error shadow-lg mb-4">{errorMessage}</div>
    {/if}

    <!-- Table with Loading Spinner and No Data Message -->
    {#if isLoading}
        <button class="btn loading">Loading...</button>
    {:else if leads.length === 0}
        <div class="">No leads found.</div>
    {:else} 
        <div class="overflow-x-auto rounded-lg shadow-lg">
            <table class="table w-full bg-base-100 text-left">
                <thead>
                    <tr class="bg-gray-800 ">
                        <th class="px-6 py-3">Name</th>
                        <th class="px-6 py-3">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {#each leads as lead}
                        <tr class="hover:bg-gray-700">
                            <td class="px-6 py-4">{lead.name}</td>
                            <td class="px-6 py-4 flex gap-2">
                                <button 
                                    on:click={() => openDialogForEdit(lead)} 
                                    class="btn btn-sm bg-blue-600 hover:bg-blue-700 text-white font-medium"
                                >
                                    Edit
                                </button>
                                <button 
                                    on:click={() => deleteLead(lead.id)} 
                                    class="btn btn-sm bg-red-600 hover:bg-red-700 text-white font-medium"
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    {/each}
                </tbody>
            </table>
        </div>
    {/if}


    <!-- Dialog for Adding and Editing Leads -->
    {#if showDialog}
        <div class="modal modal-open">
            <div class="modal-box bg-base-200">
                <h3 class="font-bold text-lg">{isEditing ? "Edit Lead" : "Add Lead"}</h3>
                <div class="py-4">
                    <label for="lead-name" class="label text-white">Name</label>
                    <input 
                        id="lead-name" 
                        type="text" 
                        bind:value={formLead.name} 
                        class="input input-bordered w-full" 
                    />
                </div>
                <div class="modal-action">
                    <button 
                        on:click={closeDialog} 
                        class="btn btn-secondary"
                    >
                        Cancel
                    </button>
                    <button 
                        on:click={saveLead} 
                        class="btn btn-success" 
                        disabled={isSaving}
                    >
                        {#if isSaving}
                            <span class="loading loading-spinner">Saving...</span>
                        {:else}
                            {isEditing ? "Update" : "Save"}
                        {/if}
                    </button>
                </div>
            </div>
        </div>
    {/if}
</div>

