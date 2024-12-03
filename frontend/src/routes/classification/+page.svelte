<script lang="ts">
    import "tailwindcss/tailwind.css";
    import { supabase } from "$lib/supabaseClient";
    import { onMount } from "svelte";

    interface Classification {
        id: number | null;
        name: string;
    }

    let classifications: Classification[] = [];
    let currentClassification: Classification = { id: null, name: "" };
    let showDialog = false;
    let isEditing = false;
    let alertMessage = "";
    let alertType = "success";
    let showAlert = false;
    let isSaving = false;
    let isDeleting = false;

    const fetchClassifications = async () => {
        const { data, error } = await supabase.from("classification").select("id, name");
        if (error) {
            showAlertMessage("Error fetching classifications.", "error");
        } else {
            classifications = data || [];
        }
    };

    const showAlertMessage = (message: string, type: string = "success") => {
        alertMessage = message;
        alertType = type;
        showAlert = true;
        setTimeout(() => (showAlert = false), 3000);
    };

    const openDialog = (classification: Classification = { id: null, name: "" }) => {
        currentClassification = { ...classification };
        isEditing = classification.id !== null;
        showDialog = true;
    };

    const closeDialog = () => {
        showDialog = false;
        currentClassification = { id: null, name: "" };
    };

    const saveClassification = async () => {
        isSaving = true;

        if (isEditing && currentClassification.id !== null) {
            const { error } = await supabase
                .from("classification")
                .update({ name: currentClassification.name })
                .eq("id", currentClassification.id);

            if (error) {
                showAlertMessage("Error updating classification.", "error");
            } else {
                showAlertMessage("Classification updated successfully.");
                await fetchClassifications();
                closeDialog();
            }
        } else {
            const { error } = await supabase
                .from("classification")
                .insert({ name: currentClassification.name });

            if (error) {
                showAlertMessage("Error adding classification.", "error");
            } else {
                showAlertMessage("Classification added successfully.");
                await fetchClassifications();
                closeDialog();
            }
        }

        isSaving = false;
    };

    const deleteClassification = async (id: number) => {
        isDeleting = true;

        const { error } = await supabase.from("classification").delete().eq("id", id);

        if (error) {
            showAlertMessage("Error deleting classification.", "error");
        } else {
            showAlertMessage("Classification deleted successfully.");
            await fetchClassifications();
        }

        isDeleting = false;
    };

    onMount(async () => {
        await fetchClassifications();
    });
</script>

<div class="min-h-screen  p-8">
    <h1 class="text-3xl font-bold mb-6">Classifications</h1>

    <!-- Alert -->
    {#if showAlert}
        <div class={`alert ${alertType === 'success' ? 'alert-success' : 'alert-error'} shadow-lg mb-6`}>
            <span>{alertMessage}</span>
        </div>
    {/if}

    <!-- Table -->
    <div class="overflow-x-auto shadow-lg rounded-lg">
        <table class="table w-full">
            <thead>
                <tr class="border">
                    <th class="px-6 py-4">Classification Name</th>
                    <th class="px-6 py-4">Actions</th>
                </tr>
            </thead>
            <tbody>
                {#each classifications as classification}
                    <tr class="hover border border-gray-700">
                        <td class="px-6 py-4">{classification.name}</td>
                        <td class="px-6 py-4 flex gap-4">
                            <button
                                class="btn btn-sm bg-blue-600 hover:bg-blue-700 font-medium"
                                on:click={() => openDialog(classification)}
                            >
                                Edit
                            </button>
                            <button
                                class="btn btn-sm bg-red-600 hover:bg-red-700 font-medium {isDeleting ? 'loading' : ''}"
                                on:click={() => classification.id !== null && deleteClassification(classification.id)}
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

    <!-- Add Classification Button -->
    <div class="mt-6">
        <button class="btn bg-indigo-600 hover:bg-indigo-700 text-white font-medium" on:click={() => openDialog()}>
            Add Classification
        </button>
    </div>

    <!-- Dialog -->
    {#if showDialog}
        <div class="modal modal-open">
            <div class="modal-box bg-base-200">
                <h2 class="font-bold text-xl mb-4">{isEditing ? 'Edit Classification' : 'Add Classification'}</h2>

                <label for="classification-name" class="block mb-2 text-white">Classification Name</label>
                <input
                    id="classification-name"
                    type="text"
                    class="input input-bordered w-full mb-4"
                    bind:value={currentClassification.name}
                />

                <div class="modal-action">
                    <button
                        class="btn btn-success {isSaving ? 'loading' : ''}"
                        on:click={saveClassification}
                        disabled={isSaving}
                    >
                        {#if !isSaving} Save {/if}
                    </button>
                    <button class="btn btn-accent" on:click={closeDialog}>Cancel</button>
                </div>
            </div>
        </div>
    {/if}
</div>
