export async function evaluateGoal(target: string, evaluation: string): Promise<string> {
    try {
        const response = await fetch("http://localhost:5173/evaluate-goal", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ target, evaluation }),
        });

        if (!response.ok) {
            console.error("Failed to evaluate goal. Status:", response.status);
            throw new Error("Failed to evaluate goal.");
        }

        const data = await response.json();
        console.log("Response from evaluate-goal:", data); // Log response data
        return data.aiEvaluation;
    } catch (error) {
        console.error("Error in evaluateGoal API service:", error);
        throw error;
    }
}
