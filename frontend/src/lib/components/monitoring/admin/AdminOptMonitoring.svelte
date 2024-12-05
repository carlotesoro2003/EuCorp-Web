<script lang="ts">
    import { onMount } from "svelte";
    import { supabase } from "$lib/supabaseClient";
    import jsPDF from "jspdf";
  
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
    let filterStatus: string = "All"; 
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
  
    // Export to PDF using jsPDF
    const exportToPDF = () => {
        const doc = new jsPDF("landscape");
        const title = "Opportunities Monitoring Report";
  
        doc.setFontSize(12);
        doc.text(title, 14, 15);
  
        // Table columns and their headers
        const columns = [
            "Opportunity Statement",
            "KPI",
            "Planned Actions",
            "Evaluation",
            "Status",
            "Achieved On"
        ];
  
        // Map filtered opportunities to table rows
        const rows = filteredOpportunities.map(opportunity => [
            opportunity.opt_statement,
            opportunity.kpi,
            opportunity.planned_actions,
            opportunity.evaluation || "Pending",
            opportunity.achieved ? "Achieved" : "Not Achieved",
            opportunity.achieved && opportunity.time_completed
                ? new Date(opportunity.time_completed).toLocaleDateString()
                : "N/A"
        ]);
  
        // Set starting position for table
        let startY = 25;
  
        // Table header
        const headerHeight = 10;
        const columnWidths = [60, 40, 60, 40, 30, 30];
  
        // Draw table header
        doc.setFontSize(10);
        columns.forEach((column, index) => {
            doc.rect(14 + columnWidths.slice(0, index).reduce((a, b) => a + b, 0), startY, columnWidths[index], headerHeight);
            doc.text(column, 14 + columnWidths.slice(0, index).reduce((a, b) => a + b, 0) + 2, startY + 7);
        });
  
        // Draw table rows
        startY += headerHeight;
        rows.forEach(row => {
            row.forEach((cell, index) => {
                doc.rect(14 + columnWidths.slice(0, index).reduce((a, b) => a + b, 0), startY, columnWidths[index], 8);
                doc.text(cell, 14 + columnWidths.slice(0, index).reduce((a, b) => a + b, 0) + 2, startY + 5);
            });
            startY += 8;
        });
  
        // Save the generated PDF
        doc.save("OpportunitiesMonitoring.pdf");
    };
  
    onMount(() => {
        fetchOpportunities();
    });
</script>
  
<div class="min-h-screen p-8">
    <h1 class="text-3xl font-bold mb-6">Opportunities Monitoring (Admin)</h1>
  
    <!-- Filter Buttons -->
    <div class="flex space-x-4 mb-4">
        <button
            class="btn btn-primary"
            on:click={() => handleFilterChange("All")}
        >
            Show All
        </button>
        <button
            class="btn btn-success"
            on:click={() => handleFilterChange("Achieved")}
        >
            Show Achieved
        </button>
        <button
            class="btn btn-error"
            on:click={() => handleFilterChange("Not Achieved")}
        >
            Show Not Achieved
        </button>
        <button class="btn btn-secondary ml-auto" on:click={exportToPDF}>
            Export to PDF
        </button>
    </div>
  
    <!-- Loading and Table View -->
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
                        <th class="px-4 py-3">Opportunity Statement</th>
                        <th class="px-4 py-3">KPI</th>
                        <th class="px-4 py-3">Planned Actions</th>
                        <th class="px-4 py-3">Evaluation</th>
                        <th class="px-4 py-3">Status</th>
                        <th class="px-4 py-3">Achieved On</th>
                    </tr>
                </thead>
                <tbody>
                    {#each filteredOpportunities as { opt_statement, kpi, planned_actions, evaluation, achieved, time_completed }}
                        <tr class="hover">
                            <td class="px-4 py-3">{opt_statement}</td>
                            <td class="px-4 py-3">{kpi}</td>
                            <td class="px-4 py-3">{planned_actions}</td>
                            <td class="px-4 py-3">{evaluation || "Pending"}</td>
                            <td class="px-4 py-3">{achieved ? "Achieved" : "Not Achieved"}</td>
                            <td class="px-4 py-3">
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
    .btn {
        padding: 0.5rem 1rem;
        border-radius: 0.375rem;
    }
</style>
