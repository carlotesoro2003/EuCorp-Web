<script lang="ts">
    import { supabase } from "$lib/supabaseClient";
    import { onMount } from "svelte";    

    interface LikelihoodRating {
        id: number;
        name: string;
        symbol: string;
    }

    interface Severity {
        id: number;
        name: string;
        value: number;
    }

    interface RiskControlRating {
        id: number;
        name: string;
        symbol: string;
    }

    interface RiskMonitoringRating {
        id: number;
        status: string;
    }

    let likelihoodRating: LikelihoodRating[] = [];
    let severity: Severity[] = [];
    let riskControlRating: RiskControlRating[] = [];
    let riskMonitoringRating: RiskMonitoringRating[] = [];

    let isLoading = false;
    let errorMessage: string | null = null;
    let selectedDataType: string = "likelihoodRating"; // Tracks the selected data type

    const fetchLikelihoodRating = async () => {
        isLoading = true;
        const { data, error } = await supabase.from('likelihood_rating').select('*');

        if (error) {
            console.error('Error fetching likelihood rating:', error);
            errorMessage = "Failed to fetch likelihood rating.";
        } else {
            likelihoodRating = data;
        }

        isLoading = false;
    };

    const fetchSeverity = async () => {
        isLoading = true;
        const { data, error } = await supabase.from('severity').select('*');

        if (error) {
            console.error('Error fetching severity:', error);
            errorMessage = "Failed to fetch severity.";
        } else {
            severity = data;
        }

        isLoading = false;
    };

    const fetchRiskControlRating = async () => {
        isLoading = true;
        const { data, error } = await supabase.from('risk_control_rating').select('*');

        if (error) {
            console.error('Error fetching risk control rating:', error);
            errorMessage = "Failed to fetch risk control rating.";
        } else {
            riskControlRating = data;
        }

        isLoading = false;
    };

    const fetchRiskMonitoringRating = async () => {
        isLoading = true;
        const { data, error } = await supabase.from('risk_monitoring_rating').select('*');

        if (error) {
            console.error('Error fetching risk monitoring rating:', error);
            errorMessage = "Failed to fetch risk monitoring rating.";
        } else {
            riskMonitoringRating = data;
        }

        isLoading = false;
    };

    onMount(() => {
        fetchLikelihoodRating();
        fetchSeverity();
        fetchRiskControlRating();
        fetchRiskMonitoringRating();
    });
</script>

<div class="min-h-screen bg-base-300 p-8">
    <h1 class="text-3xl font-bold text-white mb-6">Ratings Management</h1>

    <!-- Dropdown Menu -->
    <div class="container mx-auto p-4">
        <label for="dataSelect" class="text-lg font-semibold text-white mr-4">Select Data Type:</label>
        <div class="relative inline-block w-64">
            <select
                id="dataSelect"
                bind:value={selectedDataType}
                class="input input-bordered w-full appearance-none pr-10"
            >
                <option value="likelihoodRating">Likelihood Rating</option>
                <option value="severity">Severity</option>
                <option value="riskControlRating">Risk Control Rating</option>
                <option value="riskMonitoringRating">Risk Monitoring Rating</option>
            </select>
            <!-- Downward Arrow -->
            <div class="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                <svg
                    class="w-5 h-5 text-gray-500"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                </svg>
            </div>
        </div>
    </div>
    

    <!-- Loading Indicator -->
    {#if isLoading}
        <div class="text-white text-center">
            <span class="loading loading-spinner loading-lg"></span> Loading...
        </div>
    {/if}

    <!-- Error Message -->
    {#if errorMessage}
        <p class="text-red-500">{errorMessage}</p>
    {/if}

    <!-- Tables -->
    <div class="overflow-x-auto bg-base-100 shadow-lg rounded-lg">
        <!-- Likelihood Rating Table -->
        {#if selectedDataType === "likelihoodRating"}
        <table class="table w-full">
            <thead>
                <tr class="bg-gray-800 text-white">
                    <th class="px-6 py-4">Name</th>
                    <th class="px-6 py-4">Symbol</th>
                </tr>
            </thead>
            <tbody>
                {#each likelihoodRating as item}
                <tr class="hover:bg-gray-700 border-b border-gray-700">
                    <td class="px-6 py-4">{item.name}</td>
                    <td class="px-6 py-4">{item.symbol}</td>
                </tr>
                {/each}
            </tbody>
        </table>
        {/if}

        <!-- Severity Table -->
        {#if selectedDataType === "severity"}
        <table class="table w-full">
            <thead>
                <tr class="bg-gray-800 text-white">
                    <th class="px-6 py-4">Name</th>
                    <th class="px-6 py-4">Value</th>
                </tr>
            </thead>
            <tbody>
                {#each severity as item}
                <tr class="hover:bg-gray-700 border-b border-gray-700">
                    <td class="px-6 py-4">{item.name}</td>
                    <td class="px-6 py-4">{item.value}</td>
                </tr>
                {/each}
            </tbody>
        </table>
        {/if}

        <!-- Risk Control Rating Table -->
        {#if selectedDataType === "riskControlRating"}
        <table class="table w-full">
            <thead>
                <tr class="bg-gray-800 text-white">
                    <th class="px-6 py-4">Name</th>
                    <th class="px-6 py-4">Symbol</th>
                </tr>
            </thead>
            <tbody>
                {#each riskControlRating as item}
                <tr class="hover:bg-gray-700 border-b border-gray-700">
                    <td class="px-6 py-4">{item.name}</td>
                    <td class="px-6 py-4">{item.symbol}</td>
                </tr>
                {/each}
            </tbody>
        </table>
        {/if}

        <!-- Risk Monitoring Rating Table -->
        {#if selectedDataType === "riskMonitoringRating"}
        <table class="table w-full">
            <thead>
                <tr class="bg-gray-800 text-white">
                    <th class="px-6 py-4">Status</th>
                </tr>
            </thead>
            <tbody>
                {#each riskMonitoringRating as item}
                <tr class="hover:bg-gray-700 border-b border-gray-700">
                    <td class="px-6 py-4">{item.status}</td>
                </tr>
                {/each}
            </tbody>
        </table>
        {/if}
    </div>
</div>
