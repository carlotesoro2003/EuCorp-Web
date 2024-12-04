<script lang="ts">
    import { supabase } from "$lib/supabaseClient";
    import { onMount } from "svelte";
    import jsPDF from "jspdf";
    import autoTable from "jspdf-autotable";
  
    interface PlanMonitoring {
      id: number;
      action_plan_id: number;
      evaluation: string;
      statement: string;
      is_accomplished: boolean;
      time_completed: string | null;
      actions_taken: string;
      kpi: string;
    }
  
    let planMonitoring: PlanMonitoring[] = [];
    let filteredPlans: PlanMonitoring[] = [];
    let filterType: "all" | "achieved" | "not_achieved" = "all";
    let isLoading = true;
  
    // Fetch the plan monitoring data
    const fetchPlanMonitoring = async () => {
      isLoading = true;
  
      try {
        const { data, error } = await supabase
          .from("plan_monitoring")
          .select(`
            id,
            action_plan_id,
            evaluation,
            statement,
            is_accomplished,
            time_completed,
            action_plans (actions_taken, kpi)
          `);
  
        if (error) {
          console.error("Error fetching plan monitoring:", error);
          return;
        }
  
        planMonitoring = data.map((plan: any) => ({
          id: plan.id,
          action_plan_id: plan.action_plan_id,
          evaluation: plan.evaluation,
          statement: plan.statement,
          is_accomplished: plan.is_accomplished,
          time_completed: plan.time_completed,
          actions_taken: plan.action_plans?.actions_taken || "No Actions Taken",
          kpi: plan.action_plans?.kpi || "No KPI",
        }));
  
        applyFilter();
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        isLoading = false;
      }
    };
  
    // Apply the filter based on the filterType
    const applyFilter = () => {
      if (filterType === "all") {
        filteredPlans = planMonitoring;
      } else if (filterType === "achieved") {
        filteredPlans = planMonitoring.filter(plan => plan.is_accomplished);
      } else if (filterType === "not_achieved") {
        filteredPlans = planMonitoring.filter(plan => !plan.is_accomplished);
      }
    };
  
    // Export to PDF using jsPDF and AutoTable
    const exportToPDF = () => {
      const doc = new jsPDF("landscape");
      const title = `Plan Monitoring Report`;
  
      doc.setFontSize(12);
      doc.text(title, 14, 15);
  
      const columns = [
        "Actions Taken",
        "KPI",
        "Evaluation",
        "Statement",
        "Status",
        "Time Completed",
      ];
  
      const rows = filteredPlans.map(plan => [
        plan.actions_taken,
        plan.kpi,
        plan.evaluation,
        plan.statement,
        plan.is_accomplished ? "Achieved" : "Not Achieved",
        plan.time_completed ? new Date(plan.time_completed).toLocaleString() : "N/A",
      ]);
  
      autoTable(doc, {
        head: [columns],
        body: rows,
        startY: 25,
        theme: "grid",
        styles: { fontSize: 10 },
        headStyles: { fillColor: [41, 128, 185] }, // Blue color for header
      });
  
      doc.save("PlanMonitoring.pdf");
    };
  
    // Fetch data on component mount
    onMount(async () => {
      await fetchPlanMonitoring();
    });
  </script>
  
  <!-- HTML Structure -->
  <div class="min-h-screen p-8 bg-base-300">
    <h1 class="text-3xl font-bold mb-6">Plans Monitoring</h1>
  
    <!-- Filter Buttons -->
    <div class="flex space-x-4 mb-4">
      <button
        class="btn btn-primary"
        on:click={() => {
          filterType = "all";
          applyFilter();
        }}
      >
        Show All
      </button>
      <button
        class="btn btn-success"
        on:click={() => {
          filterType = "achieved";
          applyFilter();
        }}
      >
        Show Achieved
      </button>
      <button
        class="btn btn-error"
        on:click={() => {
          filterType = "not_achieved";
          applyFilter();
        }}
      >
        Show Not Achieved
      </button>
      <button class="btn btn-secondary ml-auto" on:click={exportToPDF}>
        Export to PDF
      </button>
    </div>
  
    <!-- Table -->
    {#if isLoading}
      <div class="text-center text-xl">
        <span class="loading loading-spinner loading-md"></span> Loading...
      </div>
    {:else if filteredPlans.length > 0}
      <div class="overflow-x-auto shadow-lg rounded-lg">
        <table class="table-auto w-full text-left text-sm border-collapse">
          <thead class="uppercase text-xs">
            <tr>
              <th class="px-4 py-3">Actions Taken</th>
              <th class="px-4 py-3">KPI</th>
              <th class="px-4 py-3">Evaluation</th>
              <th class="px-4 py-3">Statement</th>
              <th class="px-4 py-3">Status</th>
              <th class="px-4 py-3">Time Completed</th>
            </tr>
          </thead>
          <tbody>
            {#each filteredPlans as plan}
              <tr class="hover border-b">
                <td class="px-4 py-3">{plan.actions_taken}</td>
                <td class="px-4 py-3">{plan.kpi}</td>
                <td class="px-4 py-3">{plan.evaluation || "Pending Evaluation"}</td>
                <td class="px-4 py-3">{plan.statement || "Pending Statement"}</td>
                <td class="px-4 py-3">
                  {plan.is_accomplished ? "Achieved" : "Not Achieved"}
                </td>
                <td class="px-4 py-3">
                  {plan.time_completed
                    ? new Date(plan.time_completed).toLocaleString()
                    : "N/A"}
                </td>
              </tr>
            {/each}
          </tbody>
        </table>
      </div>
    {:else}
      <div>No plans found for this filter.</div>
    {/if}
  </div>
  
  <style>
    .btn {
      padding: 8px 12px;
      border-radius: 8px;
      cursor: pointer;
    }
  </style>
  