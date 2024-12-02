// goal-evaluation-service.js

// Import dependencies
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Check if API Key exists in .env
const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
    console.error("Error: GEMINI_API_KEY is missing from environment variables.");
    process.exit(1);
}

// Initialize Google Generative AI client with the API key
const genAi = new GoogleGenerativeAI(apiKey);

// Initialize Express app
const app = express();
app.use(cors({
    origin: 'http://localhost:5173',
    methods: ['POST'],
    allowedHeaders: ['Content-Type']
}));
app.use(bodyParser.json()); // Middleware to parse JSON request body

// POST endpoint to evaluate goal
app.post("/evaluate-goal", async (req, res) => {
    console.log("Request body:", req.body); // Log the incoming request body
    const { target, evaluation } = req.body;

    // Validation
    if (!target || !evaluation) {
        return res.status(400).json({ error: "Target and evaluation are required" });
    }

    try {
        // Get the Gemini model
        const model = genAi.getGenerativeModel({ model: "gemini-pro" });

        // Create a prompt for the AI
        const prompt = `The target is: ${target}. Based on the following evaluation: "${evaluation}", determine if the goal has been achieved and explain why.`;

        // Generate response using the AI model
        const result = await model.generateContent(prompt);

        // Extract and send the AI's response
        const aiEvaluation = result.response?.text?.();
        if (!aiEvaluation) {
            throw new Error("No response received from the AI model.");
        }
        res.json({ aiEvaluation });
    } catch (error) {
        console.error("Error with the Google Generative AI API:", error.message);
        res.status(500).json({ error: "Internal Server Error", details: error.message });
    }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Goal Evaluation Service is running on port ${PORT}`);
});
