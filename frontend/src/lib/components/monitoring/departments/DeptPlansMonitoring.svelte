<script lang="ts">
  import { supabase } from "$lib/supabaseClient";
  import axios from "axios";
  import { onMount } from "svelte";

  interface ActionPlan {
    id: number;
    actions_taken: string;
    kpi: string;
    objective_id: number;
    strategic_goal_name: string;
    objective_name: string;
    is_accomplished: boolean;
    evaluation: string | null;
    statement: string | null;
    time_completed: string | null;
  }

  let actionPlans: ActionPlan[] = [];
  let profile_id: string | null = null;
  let isLoading = true;
  let showDialog = false;
  let dialogStatement = "";

  const backendUrl = 'http://localhost:3000/evaluate-goal'; // Replace with the actual AI backend URL

  // Fetch the logged-in user's profile
  const fetchUserProfile = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      profile_id = user.id;
    } else {
      console.error("No logged-in user found.");
    }
  };

  // Fetch the user's action plans and related data
  const fetchActionPlans = async () => {
    if (!profile_id) return;

    try {
      const { data, error } = await supabase
        .from("action_plans")
        .select(`
          id,
          actions_taken,
          kpi,
          objective_id,
          strategic_objectives (
            name,
            strategic_goals (name)
          )
        `)
        .eq("profile_id", profile_id);

      if (error) {
        console.error("Error fetching action plans:", error);
        return;
      }

      actionPlans = data.map((plan: any) => ({
        id: plan.id,
        actions_taken: plan.actions_taken,
        kpi: plan.kpi,
        objective_id: plan.objective_id,
        strategic_goal_name: plan.strategic_objectives?.strategic_goals?.name || "No Goal Assigned",
        objective_name: plan.strategic_objectives?.name || "No Objective Assigned",
        is_accomplished: false,
        evaluation: null,
        statement: null,
        time_completed: null,
      }));

      // Fetch related monitoring data for each action plan
      await fetchPlanMonitoringData();
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      isLoading = false;
    }
  };

  // Fetch monitoring data for action plans
  const fetchPlanMonitoringData = async () => {
    try {
      const { data, error } = await supabase
        .from("plan_monitoring")
        .select("action_plan_id, is_accomplished, evaluation, statement, time_completed")
        .in("action_plan_id", actionPlans.map(plan => plan.id));

      if (error) {
        console.error("Error fetching monitoring data:", error);
        return;
      }

      // Map monitoring data back to the action plans
      actionPlans = actionPlans.map(plan => {
        const monitoringData = data.find((monitoring: any) => monitoring.action_plan_id === plan.id);
        return {
          ...plan,
          is_accomplished: monitoringData?.is_accomplished || false,
          evaluation: monitoringData?.evaluation || null,
          statement: monitoringData?.statement || null,
          time_completed: monitoringData?.time_completed || null,
        };
      });

      console.log("Updated Action Plans with Monitoring Data:", actionPlans);
    } catch (error) {
      console.error("Error fetching plan monitoring data:", error);
    }
  };

  const evaluateActionPlan = async (id: number, kpi: string, evaluation: string) => {
    try {
      const response = await axios.post(backendUrl, { target: kpi, evaluation });
      const aiEvaluation = response.data.aiEvaluation;

      const negativeKeywords = ["not achieved", "unsuccessful", "failed", "incomplete", "fell short", "below target", "did not meet", "not"];
      const isAccomplished = !negativeKeywords.some(neg => aiEvaluation.toLowerCase().includes(neg));

      const timeCompleted = isAccomplished ? new Date().toISOString() : null;

      const { error } = await supabase
        .from("plan_monitoring")
        .update({
          evaluation,
          is_accomplished: isAccomplished,
          statement: aiEvaluation,
          time_completed: timeCompleted,
        })
        .eq("action_plan_id", id);

      if (error) {
        console.error("Error updating plan monitoring:", error);
        return;
      }

      actionPlans = actionPlans.map((plan) =>
        plan.id === id
          ? {
              ...plan,
              is_accomplished: isAccomplished,
              evaluation,
              statement: aiEvaluation,
              time_completed: timeCompleted,
            }
          : plan
      );
    } catch (error) {
      console.error("Error evaluating action plan:", error);
    }
  };

  const openDialog = (statement: string) => {
    dialogStatement = statement;
    showDialog = true;
  };

  const autoResize = (event: Event) => {
    const textarea = event.target as HTMLTextAreaElement;
    textarea.style.height = "auto";
    textarea.style.height = `${textarea.scrollHeight}px`;
  };

  onMount(async () => {
    await fetchUserProfile();
    await fetchActionPlans();
  });
</script>

<!-- HTML Structure -->
<div class="min-h-screen p-8 bg-base-300">
  <h1 class="text-3xl font-bold mb-6">Plans Monitoring</h1>

  {#if isLoading}
    <div class="text-center text-xl">
      <span class="loading loading-spinner loading-md"></span>
    </div>
  {:else if actionPlans.length > 0}
    <div class="overflow-x-auto shadow-lg rounded-lg">
      <table class="table-auto w-full text-left text-sm border-collapse">
        <thead class="uppercase text-xs">
          <tr>
            <th class="px-4 py-3">Strategic Goal</th>
            <th class="px-4 py-3">Objective Name</th>
            <th class="px-4 py-3">Actions Taken</th>
            <th class="px-4 py-3">KPI</th>
            <th class="px-4 py-3">Evaluation</th>
            <th class="px-4 py-3">Status</th>
            <th class="px-4 py-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {#each actionPlans as plan}
            <tr class="hover border-b">
              <td class="px-4 py-3">{plan.strategic_goal_name}</td>
              <td class="px-4 py-3">{plan.objective_name}</td>
              <td class="px-4 py-3">{plan.actions_taken}</td>
              <td class="px-4 py-3">{plan.kpi}</td>
              <td class="px-4 py-3">
                <textarea
                  class="border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring focus:ring-indigo-200"
                  placeholder="Enter your evaluation"
                  value={plan.evaluation}
                  on:input={(e) =>
                    plan.evaluation = (e.target as HTMLTextAreaElement).value
                  }
                  style="overflow:hidden; resize:none;"
                  disabled={plan.is_accomplished}
                ></textarea>
              </td>
              <td class="px-4 py-3">
                {#if plan.is_accomplished}
                  Achieved on {plan.time_completed ? new Date(plan.time_completed).toLocaleString() : "N/A"}
                {:else}
                  Not Achieved
                {/if}
              </td>
              <td class="px-4 py-3">
                <button
                  on:click={() => evaluateActionPlan(plan.id, plan.kpi, plan.evaluation || "")}
                  class="btn btn-success btn-sm"
                  disabled={!plan.evaluation || plan.is_accomplished}
                >
                  Evaluate
                </button>
                {#if plan.statement}
                  <button
                    on:click={() => openDialog(plan.statement || "")}
                    class="btn btn-primary btn-sm ml-2"
                  >
                    View Statement
                  </button>
                {/if}
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  {:else}
    <div>No action plans found for this user.</div>
  {/if}

  {#if showDialog}
    <div class="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50">
      <div class="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 class="text-lg font-bold mb-4">Evaluation Statement</h2>
        <p class="mb-4">{dialogStatement}</p>
        <button on:click={() => (showDialog = false)} class="btn bg-indigo-500 hover:bg-indigo-600 text-white w-full">
          Close
        </button>
      </div>
    </div>
  {/if}
</div>

<style>
  .table {
    border-spacing: 0;
    border-collapse: collapse;
    width: 100%;
  }
</style>
