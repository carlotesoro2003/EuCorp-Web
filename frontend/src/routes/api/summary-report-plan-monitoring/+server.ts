import { GoogleGenerativeAI } from '@google/generative-ai';
import { json } from '@sveltejs/kit';

// Load environment variable for API key
const API_KEY = process.env.VITE_GEMINI_API_KEY || '';

// Initialize the Google Generative AI client
const client = new GoogleGenerativeAI(API_KEY);

export const POST = async ({ request }: { request: Request }) => {
    try {
        const { plans } = await request.json();

        if (!plans || !Array.isArray(plans) || plans.length === 0) {
            return json(
                { error: 'Plans data is required and must be a non-empty array.' },
                { status: 400 }
            );
        }

        const formattedPlans = plans
            .map(
                (plan) =>
                    `Action Taken: ${plan.actions_taken}, KPI: ${plan.kpi}, Status: ${
                        plan.is_accomplished ? 'Achieved' : 'Not Achieved'
                    }, Evaluation: ${plan.evaluation || 'Pending'}.`
            )
            .join('\n');

        const prompt = `You are an expert analyst. Based on the following action plan data, write a detailed, comprehensive summary report. Evaluate the effectiveness of each action plan and provide insights into their overall performance:
        \n${formattedPlans}
        Write your response as a cohesive and professional narrative for stakeholders. Make it brief and not to long.
        `;

        // Generate the summary report using the AI model
        const model = client.getGenerativeModel({ model: 'gemini-pro' });
        const response = await model.generateContent(prompt);

        const summaryReport = response.response?.text?.();
        if(!summaryReport) {
            throw new Error('No response received from the AI model.');
        }

        return json({ summaryReport });
    } catch (error: any) {
        console.error('[ERROR] Error generating summary report:', error);
        return json(
            { error: 'Internal Server Error', details: error.message || String(error) },
            { status: 500 }
        );
    }
};
