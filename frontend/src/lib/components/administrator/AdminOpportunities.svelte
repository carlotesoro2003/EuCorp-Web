<script lang="ts">
    import { onMount } from 'svelte';
    import { supabase } from '$lib/supabaseClient';
    import jsPDF from 'jspdf';
    import autoTable from 'jspdf-autotable';


    interface Opportunity {
        id: number;
        opt_statement: string;
        planned_actions: string;
        kpi: string;
        key_persons: string;
        target_output: string;
        budget: number;
        profile_id: string;
        is_approved: boolean;
        department_name: string;
    }

    let opportunities: Opportunity[] = [];
    let isLoading = false;
    let isSaving = false;
    let isDeleting = false;
    let isApproving = false;
    let profileId: string | null = null;
    let errorMessage: string | null = null;
    let editingOpportunity: Opportunity | null = null;

    const fetchUserProfile = async (): Promise<void> => {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();

        if (sessionError) {
            console.error('Error fetching session:', sessionError);
            errorMessage = "Session could not be retrieved.";
            setTimeout(() => errorMessage = null, 2000);
            return;
        }

        if (session) {
            const { data, error } = await supabase
                .from('profiles')
                .select('id')
                .eq('id', session.user.id)
                .single();
            if (error) {
                console.error('Error fetching profile:', error);
                errorMessage = "Failed to fetch profile information.";
                setTimeout(() => errorMessage = null, 2000);
            } else {
                profileId = data.id;
                fetchOpportunities();
            }
        }
    };

    const fetchOpportunities = async () => {
        if (!profileId) return;

        isLoading = true;
        const { data, error } = await supabase
            .from('opportunities')
            .select(`
                *,
                profiles (
                    department_id,
                    departments (name)
                )
            `);

        if (error) {
            console.error('Error fetching opportunities:', error);
            errorMessage = "Failed to load opportunities.";
            setTimeout(() => errorMessage = null, 2000);
        } else {
            opportunities = data.map((opportunity: any) => ({
                ...opportunity,
                department_name: opportunity.profiles?.departments?.name || 'N/A',
            }));
        }
        isLoading = false;
    };

    const editOpportunity = (opportunity: Opportunity) => {
        editingOpportunity = { ...opportunity };
    };

    const saveEditedOpportunity = async () => {
        if (!editingOpportunity) return;

        isSaving = true;
        const { error } = await supabase
            .from('opportunities')
            .update({
                opt_statement: editingOpportunity.opt_statement,
                planned_actions: editingOpportunity.planned_actions,
                kpi: editingOpportunity.kpi,
                key_persons: editingOpportunity.key_persons,
                target_output: editingOpportunity.target_output,
                budget: editingOpportunity.budget,
            })
            .eq('id', editingOpportunity.id);

        if (error) {
            console.error('Error updating opportunity:', error);
            errorMessage = "Failed to update opportunity.";
            setTimeout(() => errorMessage = null, 2000);
        } else {
            fetchOpportunities();
            editingOpportunity = null;
        }
        isSaving = false;
    };

    const deleteOpportunity = async (id: number) => {
        isDeleting = true;
        const { error } = await supabase
            .from('opportunities')
            .delete()
            .eq('id', id);

        if (error) {
            console.error('Error deleting opportunity:', error);
            errorMessage = "Failed to delete opportunity.";
            setTimeout(() => errorMessage = null, 2000);
        } else {
            fetchOpportunities();
        }
        isDeleting = false;
    };

    const approveOpportunity = async (opportunity: Opportunity) => {
        isApproving = true;

        try {
            const { error: updateError } = await supabase
                .from('opportunities')
                .update({ is_approved: true })
                .eq('id', opportunity.id);

            if (updateError) {
                console.error('Error updating opportunity:', updateError);
                errorMessage = "Failed to approve opportunity.";
                setTimeout(() => (errorMessage = null), 2000);
                isApproving = false;
                return;
            }

            const { error: insertError } = await supabase
                .from('opt_monitoring')
                .insert({
                    opt_id: opportunity.id,
                    profile_id: opportunity.profile_id,
                    is_accomplished: false,
                });

            if (insertError) {
                console.error('Error inserting into opt_monitoring:', insertError);
                errorMessage = "Failed to add opportunity to monitoring.";
                setTimeout(() => (errorMessage = null), 2000);
            }

            fetchOpportunities();
        } catch (error) {
            console.error('Unexpected error:', error);
            errorMessage = "An unexpected error occurred.";
            setTimeout(() => (errorMessage = null), 2000);
        } finally {
            isApproving = false;
        }
    };

    const exportToPDF = () => {
    // Initialize jsPDF with landscape orientation
    const doc = new jsPDF('landscape');
    const tableColumnHeaders = [
        "Opportunity Statement",
        "Planned Actions",
        "KPI",
        "Key Persons",
        "Target Output",
        "Budget",
        "Department",
    ];
    const tableRows = opportunities.map((opportunity) => [
        opportunity.opt_statement,
        opportunity.planned_actions,
        opportunity.kpi,
        opportunity.key_persons,
        opportunity.target_output,
        opportunity.budget.toString(),
        opportunity.department_name,
    ]);

    // Set the title and add it to the PDF
    doc.text("Opportunities Report", 14, 10);

    // Use autoTable to add the table in landscape format
    autoTable(doc, {
        head: [tableColumnHeaders],
        body: tableRows,
        startY: 20, // Start table below the title
    });

    // Save the PDF file
    doc.save("Opportunities_Report.pdf");
};


    onMount(() => {
        fetchUserProfile();
    });
</script>

<div class="container mx-auto p-6">
    <h2 class="text-2xl  font-bold mb-6">My Opportunities</h2>

    <button class="btn btn-accent my-5" on:click={exportToPDF}>
        Export to PDF
    </button>

    {#if errorMessage}
        <div class="text-red-500 mb-4">{errorMessage}</div>
    {/if}

    {#if isLoading}
        <span class="loading loading-spinner loading-sm">Loading...</span>
    {:else if opportunities.length === 0}
        <div class="text-center text-gray-500">No opportunities found.</div>
    {:else}
        <div class="overflow-x-auto">
            <table class="table table-zebra w-full">
                <thead>
                    <tr class="uppercase text-sm">
                        <th class="px-4 py-2 text-left">Opportunity Statement</th>
                        <th class="px-4 py-2 text-left">Planned Actions</th>
                        <th class="px-4 py-2 text-left">KPI</th>
                        <th class="px-4 py-2 text-left">Key Persons</th>
                        <th class="px-4 py-2 text-left">Target Output</th>
                        <th class="px-4 py-2 text-left">Budget</th>
                        <th class="px-4 py-2 text-left">Department</th>
                        <th class="px-4 py-2 text-left">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {#each opportunities as opportunity}
                        <tr class="hover">
                            <td class="px-4 py-2">{opportunity.opt_statement}</td>
                            <td class="px-4 py-2">{opportunity.planned_actions}</td>
                            <td class="px-4 py-2">{opportunity.kpi}</td>
                            <td class="px-4 py-2">{opportunity.key_persons}</td>
                            <td class="px-4 py-2">{opportunity.target_output}</td>
                            <td class="px-4 py-2">{opportunity.budget}</td>
                            <td class="px-4 py-2">{opportunity.department_name}</td>
                            <td class="px-4 py-2 flex gap-2">
                                <button on:click={() => editOpportunity(opportunity)} class="btn bg-blue-600 hover:bg-blue-700 text-white font-medium">Edit</button>
                                <button on:click={() => approveOpportunity(opportunity)}
                                    class="btn text-white {opportunity.is_approved ? 'bg-green-700 cursor-not-allowed' : 'btn-success'}"
                                    disabled={opportunity.is_approved}>
                                    {opportunity.is_approved ? "Approved" : "Approve"}
                                </button>
                                <button on:click={() => deleteOpportunity(opportunity.id)} class="btn bg-red-600 hover:bg-red-700 text-white font-medium">Delete</button>
                            </td>
                        </tr>
                    {/each}
                </tbody>
            </table>
        </div>
    {/if}
</div>
