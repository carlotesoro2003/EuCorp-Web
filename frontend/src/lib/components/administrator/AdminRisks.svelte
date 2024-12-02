<script lang="ts">
  import { supabase } from "$lib/supabaseClient";
  import { onMount } from "svelte";

  interface Risk {
    id: string;
    rrn: string;
    risk_statement: string;
    classification: number | null;
    actions: string;
    key_persons: string;
    budget: number;
    profile_id: string;
  }
  
  interface Classification {
    id: number;
    name: string;
  }

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

  interface RiskAssessment {
    id: number;
    lr: number | null;
    s: number | null;
    rcr: number | null;
    rmr: number | null;
    risk_id: string;
  }

  let risks: Risk[] = [];
  let classification: Classification[] = [];
  let likelihoodRating: LikelihoodRating[] = [];
  let severity: Severity[] = [];
  let riskControlRating: RiskControlRating[] = [];
  let riskMonitoringRating: RiskMonitoringRating[] = [];
  let riskAssessment: RiskAssessment[] = [];
  let isLoading = true;
  let loadingRiskAssessments = true;
  let successMessage: string | null = null;
  let errorMessage: string | null = null;

  const fetchRisks = async () => {
    isLoading = true;
    try {
      const { data, error } = await supabase
        .from("risks")
        .select("*")
        .order("rrn", { ascending: true });

      if (error) throw error;

      risks = data.sort((a, b) => {
        const getNumericPart = (rrn: string) => {
          const match = rrn.match(/(\d+)$/);
          return match ? parseInt(match[0], 10) : 0;
        };
        return getNumericPart(a.rrn) - getNumericPart(b.rrn);
      });
    } catch (error) {
      console.error("Error fetching risks:", error);
      errorMessage = "Failed to fetch risks.";
    } finally {
      isLoading = false;
    }
  };

  const fetchClassification = async () => {
    try {
      const { data, error } = await supabase.from("classification").select("*");
      if (error) throw error;
      classification = data;
    } catch (error) {
      console.error("Error fetching classification:", error);
      errorMessage = "Failed to fetch classification.";
    }
  };

  const fetchRiskAssessment = async () => {
    loadingRiskAssessments = true;
    try {
      const { data, error } = await supabase.from("risk_assessment").select("*");
      if (error) throw error;
      riskAssessment = data;
    } catch (error) {
      console.error("Error fetching risk assessment:", error);
      errorMessage = "Failed to fetch risk assessment.";
    } finally {
      loadingRiskAssessments = false;
    }
  };

  const fetchLikelihoodRating = async () => {
    const { data, error } = await supabase
      .from("likelihood_rating")
      .select("*");
    if (!error) likelihoodRating = data;
  };

  const fetchSeverity = async () => {
    const { data, error } = await supabase.from("severity").select("*");
    if (!error) severity = data;
  };

  const fetchRiskControlRating = async () => {
    const { data, error } = await supabase
      .from("risk_control_rating")
      .select("*");
    if (!error) riskControlRating = data;
  };

  const fetchRiskMonitoringRating = async () => {
    const { data, error } = await supabase
      .from("risk_monitoring_rating")
      .select("*");
    if (!error) riskMonitoringRating = data;
  };

  // Fetch all data on mount
  onMount(() => {
    Promise.all([
      fetchRisks(),
      fetchClassification(),
      fetchLikelihoodRating(),
      fetchSeverity(),
      fetchRiskControlRating(),
      fetchRiskMonitoringRating(),
      fetchRiskAssessment(),
    ]).catch((error) => {
      console.error("Error fetching data:", error);
      errorMessage = "Failed to fetch some data.";
    });
  });

  // Helper functions to retrieve names from IDs with fallbacks
  const getLikelihoodRatingName = (id: number | null) =>
    likelihoodRating.find((item) => item.id === id)?.name || "Not Available";

  const getSeverityName = (id: number | null) =>
    severity.find((item) => item.id === id)?.name || "Not Available";

  const getRiskControlRatingName = (id: number | null) =>
    riskControlRating.find((item) => item.id === id)?.name || "Not Available";

  const getRiskMonitoringRatingStatus = (id: number | null) =>
    riskMonitoringRating.find((item) => item.id === id)?.status || "Not Available";

  const getRiskAssessmentForRisk = (riskId: string) =>
    riskAssessment.filter((assessment) => assessment.risk_id === riskId);
</script>

<div class="container mx-auto my-6">
  {#if isLoading}
    <div class="text-center text-xl">
      <span class="loading loading-spinner loading-md"></span>
    </div>
  {:else}
    {#if errorMessage}
      <div class="alert alert-error">{errorMessage}</div>
    {/if}

    {#if successMessage}
      <div class="alert alert-success">{successMessage}</div>
    {/if}

    <div class="overflow-x-auto">
      <table class="table w-full table-zebra">
        <thead>
          <tr>
            <th>RRN</th>
            <th>Risk Statement</th>
            <th>Classification</th>
            <th>Actions</th>
            <th>Key Persons</th>
            <th>Budget</th>
            <th>Risk Assessments</th>
          </tr>
        </thead>
        <tbody>
          {#each risks as risk}
            <tr>
              <td>{risk.rrn}</td>
              <td>{risk.risk_statement}</td>
              <td>
                {classification.find((cls) => cls.id === risk.classification)?.name || "N/A"}
              </td>
              <td>{risk.actions}</td>
              <td>{risk.key_persons}</td>
              <td>${risk.budget}</td>
              <td>
                {#if loadingRiskAssessments}
                  Loading...
                {:else}
                  {#each getRiskAssessmentForRisk(risk.id) as assessment}
                    <div>
                      <strong>Likelihood:</strong> {getLikelihoodRatingName(assessment.lr)}
                      <br />
                      <strong>Severity:</strong> {getSeverityName(assessment.s)}
                      <br />
                      <strong>Control Rating:</strong> {getRiskControlRatingName(assessment.rcr)}
                      <br />
                      <strong>Monitoring Rating:</strong>
                      {getRiskMonitoringRatingStatus(assessment.rmr)}
                    </div>
                  {/each}
                  {#if getRiskAssessmentForRisk(risk.id).length === 0}
                    No assessment data available.
                  {/if}
                {/if}
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  {/if}
</div>
