<script lang="ts">
    import { onMount } from "svelte";
    import { supabase } from "$lib/supabaseClient";

    interface Opportunity {
        opt_id: number;
        opt_statement: string;
        kpi: string;
        planned_actions: string;
        evaluation: string | null;
        achieved: boolean;
        time_completed: string | null;
    }

    let opportunities: Opportunity[] = [];
    let filteredOpportunities: Opportunity[] = [];
    let filterStatus: string = "All"; // Filter state: "All", "Achieved", or "Not Achieved"
    let isLoading = true;

    // Fetch all opportunities from the opt_monitoring table
    const fetchOpportunities = async () => {
        isLoading = true;

        const { data, error } = await supabase
            .from("opt_monitoring")
            .select(`
                opt_id,
                opportunities(opt_statement, kpi, planned_actions),
                evaluation,
                is_accomplished,
                time_completed
            `);

        if (error) {
            console.error("Error fetching opportunities:", error);
            return;
        }

        if (data) {
            // Map and structure the fetched data
            opportunities = data.map((item: any) => ({
                opt_id: item.opt_id,
                opt_statement: item.opportunities.opt_statement,
                kpi: item.opportunities.kpi,
                planned_actions: item.opportunities.planned_actions,
                evaluation: item.evaluation,
                achieved: item.is_accomplished,
                time_completed: item.time_completed
            }));

            applyFilter(); // Apply the current filter to update the displayed opportunities
        }

        isLoading = false;
    };

    // Filter opportunities based on the selected status
    const applyFilter = () => {
        if (filterStatus === "Achieved") {
            filteredOpportunities = opportunities.filter((opportunity) => opportunity.achieved);
        } else if (filterStatus === "Not Achieved") {
            filteredOpportunities = opportunities.filter((opportunity) => !opportunity.achieved);
        } else {
            filteredOpportunities = opportunities; // Show all opportunities
        }
    };

    // Update the filter status and apply the filter
    const handleFilterChange = (status: string) => {
        filterStatus = status;
        applyFilter();
    };

    onMount(() => {
        fetchOpportunities();
    });
</script>

<div class="min-h-screen p-8">
    <h1 class="text-3xl font-bold mb-6">Opportunities Monitoring (Admin)</h1>

    <div class="mb-4 flex justify-between items-center">
        <div>
            <label for="filter" class="mr-2 text-lg">Filter by Status:</label>
            <select
                id="filter"
                class="select select-bordered"
                bind:value={filterStatus}
                on:change={() => handleFilterChange(filterStatus)}
            >
                <option value="All">All</option>
                <option value="Achieved">Achieved</option>
                <option value="Not Achieved">Not Achieved</option>
            </select>
        </div>

        <button
            on:click={fetchOpportunities}
            class="btn bg-indigo-500 hover:bg-indigo-600 text-white font-medium"
        >
            Refresh Opportunities
        </button>
    </div>

    {#if isLoading}
        <div class="text-center">
            <span class="loading loading-spinner text-primary"></span>
            <p>Loading opportunities...</p>
        </div>
    {:else}
        <div class="overflow-x-auto shadow-lg rounded-lg">
            <table class="table-auto w-full text-left text-sm">
                <thead>
                    <tr>
                        <th class="px-4 py-3 ">Opportunity Statement</th>
                        <th class="px-4 py-3 ">KPI</th>
                        <th class="px-4 py-3 ">Planned Actions</th>
                        <th class="px-4 py-3 ">Evaluation</th>
                        <th class="px-4 py-3 ">Status</th>
                        <th class="px-4 py-3 ">Achieved On</th>
                    </tr>
                </thead>
                <tbody>
                    {#each filteredOpportunities as { opt_statement, kpi, planned_actions, evaluation, achieved, time_completed }}
                        <tr class="hover">
                            <td class="px-4 py-3 ">{opt_statement}</td>
                            <td class="px-4 py-3 ">{kpi}</td>
                            <td class="px-4 py-3 ">{planned_actions}</td>
                            <td class="px-4 py-3 ">{evaluation || "Pending"}</td>
                            <td class="px-4 py-3 ">
                                {achieved ? "Achieved" : "Not Achieved"}
                            </td>
                            <td class="px-4 py-3 ">
                                {achieved && time_completed ? new Date(time_completed).toLocaleDateString() : "N/A"}
                            </td>
                        </tr>
                    {/each}
                </tbody>
            </table>
        </div>
    {/if}
</div>

<style>
    .select {
        border: 1px solid #d1d5db;
        padding: 0.5rem;
        border-radius: 0.375rem;
    }

    .btn {
        padding: 0.5rem 1rem;
        border-radius: 0.375rem;
    }
</style>
