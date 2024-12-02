<script lang="ts">
    import "tailwindcss/tailwind.css";
    import { onMount } from 'svelte';
    import { supabase } from '$lib/supabaseClient';
    import { writable, get } from 'svelte/store';
    import axios from 'axios';

    interface MonitoringOpportunity {
        opt_id: number;
        opt_statement: string; 
        kpi: string;
        planned_actions: string;
        time_completed: string | null;
        evaluation: string;
        statement: string | null;
    }

    let opportunities: MonitoringOpportunity[] = [];
    let profileId: string | null = null;

    let goals = writable<{ 
        id: number; 
        statement: string; 
        goal: string; 
        evaluation: string; 
        achieved: string | null; 
        isLoading: boolean; 
        timeCompleted: string | null; 
        aiStatement: string | null;
    }[]>([]);

    const backendUrl = 'http://localhost:3000/evaluate-goal';
    let showDialog = false;
    let dialogStatement = '';

    function openDialog(statement: string) {
        dialogStatement = statement;
        showDialog = true;
    }

    // Fetch user profile to get profile_id
    const fetchUserProfile = async () => {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error || !session) {
            console.error('Error fetching session:', error);
            return;
        }

        const { user } = session;
        const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('id')
            .eq('id', user.id)
            .single();

        if (profileError || !profileData) {
            console.error('Error fetching profile:', profileError);
            return;
        }

        profileId = profileData.id;
    };

    // Fetch opportunities for the logged-in user
    const fetchOpportunities = async () => {
        if (!profileId) return;

        const { data, error } = await supabase
            .from('opt_monitoring')
            .select(`
                opt_id,
                time_completed,
                evaluation,
                statement,
                opportunities (opt_statement, kpi, planned_actions)
            `)
            .eq('profile_id', profileId);

        if (error) {
            console.error(error);
        } else {
            opportunities = data.map((monitoringItem: any) => ({
                opt_id: monitoringItem.opt_id,
                opt_statement: monitoringItem.opportunities.opt_statement,
                kpi: monitoringItem.opportunities.kpi,
                planned_actions: monitoringItem.opportunities.planned_actions,
                time_completed: monitoringItem.time_completed,
                evaluation: monitoringItem.evaluation || '',
                statement: monitoringItem.statement || null,
            }));

            const mappedOpportunities = opportunities.map(opportunity => ({
                id: opportunity.opt_id,
                statement: opportunity.opt_statement,
                goal: opportunity.kpi,
                evaluation: opportunity.evaluation || '',
                achieved: opportunity.time_completed ? "Achieved" : null,
                isLoading: false,
                timeCompleted: opportunity.time_completed,
                aiStatement: opportunity.statement || null,
            }));

            goals.set(mappedOpportunities);
        }
    };

    // Evaluate a single goal
    async function evaluateGoal(id: number, goal: string, evaluation: string) {
        try {
            const response = await axios.post(backendUrl, { target: goal, evaluation });
            const aiEvaluation = response.data.aiEvaluation;

            const negativeKeywords = ["not achieved", "unsuccessful", "failed", "incomplete", "fell short", "below target", "did not meet", "not"];
            const isAchieved = !negativeKeywords.some(neg => aiEvaluation.toLowerCase().includes(neg));

            const timeCompleted = isAchieved ? new Date().toISOString() : null;

            const { error } = await supabase
                .from('opt_monitoring')
                .update({
                    time_completed: timeCompleted,
                    evaluation,
                    statement: aiEvaluation,
                    is_accomplished: isAchieved,
                })
                .eq('opt_id', id);

            if (error) {
                console.error("Error updating opt_monitoring:", error);
            } else {
                goals.update(currentGoals =>
                    currentGoals.map(g =>
                        g.id === id
                            ? {
                                ...g,
                                achieved: isAchieved ? "Achieved" : "Not Achieved",
                                isLoading: false,
                                timeCompleted,
                                aiStatement: aiEvaluation,
                            }
                            : g
                    )
                );
            }
        } catch (error) {
            console.error("Error evaluating goal:", error);
        }
    }

    async function evaluateAllGoals() {
        const allGoals = get(goals);
        for (const goal of allGoals) {
            if (goal.goal && goal.evaluation) {
                await evaluateGoal(goal.id, goal.goal, goal.evaluation);
            }
        }
    }

    function handleInput(id: number, field: 'evaluation', value: string) {
        goals.update(currentGoals =>
            currentGoals.map(g => g.id === id ? { ...g, [field]: value } : g)
        );
    }

    onMount(async () => {
        await fetchUserProfile();
        await fetchOpportunities();
    });
</script>

<!-- Page Layout -->
<div class="min-h-screen p-8">
    <h1 class="text-3xl font-bold mb-6">Mid-Year Monitoring</h1>
    <button on:click={evaluateAllGoals} class="btn bg-indigo-500 hover:bg-indigo-600 text-white font-medium mb-6">
        Evaluate All Opportunities
    </button>

    <div class="overflow-x-auto shadow-lg rounded-lg">
        <table class="table-auto w-full text-left text-sm border-collapse">
            <thead class="uppercase text-xs">
                <tr>
                    <th class="px-4 py-3">Opportunity Statement</th>
                    <th class="px-4 py-3">Target (KPI)</th>
                    <th class="px-4 py-3">Evaluation</th>
                    <th class="px-4 py-3">Achieved</th>
                    <th class="px-4 py-3">Actions</th>
                </tr>
            </thead>
            <tbody>
                {#each $goals as { id, statement, goal, evaluation, achieved, isLoading, timeCompleted, aiStatement }}
                    <tr class="hover border-b">
                        <td class="px-4 py-3">{statement}</td>
                        <td class="px-4 py-3">{goal}</td>
                        <td class="px-4 py-3">
                            <textarea
                                class="w-full border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring focus:ring-indigo-200"
                                placeholder="Enter your evaluation"
                                value={evaluation}
                                on:input={(e) => handleInput(id, 'evaluation', (e.target as HTMLInputElement).value)}
                                disabled={achieved === "Achieved"}
                            ></textarea>
                        </td>
                        <td class="px-4 py-3">
                            {#if isLoading}
                                <span class="loading loading-spinner text-primary"></span>
                            {:else if achieved === "Achieved"}
                                Achieved on {timeCompleted ? new Date(timeCompleted).toLocaleDateString() : 'N/A'}
                            {:else if achieved === "Not Achieved"}
                                Not Achieved
                            {:else}
                                Pending
                            {/if}
                        </td>
                        <td class="px-4 py-3">
                            <button
                                on:click={() => evaluateGoal(id, goal, evaluation)}
                                class="btn btn-success btn-sm"
                                disabled={!evaluation}
                            >
                                Evaluate
                            </button>
                            {#if aiStatement}
                                <button
                                    on:click={() => openDialog(aiStatement)}
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

    {#if showDialog}
        <div class="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50">
            <div class="bg-white p-6 rounded-lg shadow-lg w-96">
                <h2 class="text-lg font-bold mb-4">AI Evaluation Statement</h2>
                <p class="mb-4">{dialogStatement}</p>
                <button on:click={() => (showDialog = false)} class="btn bg-indigo-500 hover:bg-indigo-600 text-white w-full">
                    Close
                </button>
            </div>
        </div>
    {/if}
</div>
