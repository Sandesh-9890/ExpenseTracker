const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const { GoogleGenAI } = require("@google/genai");

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

console.log("Gemini API KEY LOADED:", !!process.env.GEMINI_API_KEY);

// Create Gemini client
const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
});

// Test route
app.get("/", (req, res) => {
    res.send("Gemini AI Server is running!");
});

// Chat route
app.post("/chat", async (req, res) => {

    try {

        const message = req.body.message;

        const transactions = req.body.transactions;


        console.log("User:", message);

        console.log("Transactions:", transactions);


        if (!message) {

            return res.status(400).json({

                success: false,

                reply: "Please enter a message."

            });

        }


        // Convert transactions into readable text

        const transactionData = transactions
            .map((transaction) => {

                return `
Title: ${transaction.title}
Amount: ₹${transaction.amount}
Type: ${transaction.type}
Category: ${transaction.category}
Date: ${transaction.date}
`;

            })
            .join("\n");


        // Create prompt for Gemini

        const prompt = `

You are an AI assistant for an Expense Tracker application.

You have access to the user's transaction data below.

USER TRANSACTIONS:

${transactionData}


USER QUESTION:

${message}


INSTRUCTIONS:

1. Answer the user's question using the transaction data.
2. If the question is about expenses, calculate the answer from the data.
3. If the user asks about income, use income transactions.
4. If the user asks about categories, analyze the categories.
5. If there is no relevant data, clearly say that.
6. Keep the answer simple and easy to understand.
7. Use Indian Rupees (₹) when discussing money.

`;


        // ==========================================
        // SEND TO GEMINI
        // ==========================================

        const response = await ai.models.generateContent({

            model: "gemini-3.6-flash",

            contents: prompt

        });


        const aiReply = response.text;


        console.log("AI:", aiReply);


        return res.status(200).json({

            success: true,

            reply: aiReply

        });


    } catch (error) {

        console.error("GEMINI ERROR:", error);


        return res.status(500).json({

            success: false,

            reply: "Gemini server error: " + error.message

        });

    }

});

// Start server
const PORT = process.env.PORT || 3000;

app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
});