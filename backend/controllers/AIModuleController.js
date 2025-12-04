import Doctors from "../models/doctorModel.js";
import axios from "axios";

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

// Function to get doctor specialization from OpenAI API
// Function to get doctor specialization from OpenAI API with retry logic
async function getDoctorSpecialization(symptoms, retries = 20, delay = 2000) {
    try {
        const response = await axios.post(
            "https://api.openai.com/v1/chat/completions",
            {
                model: "gpt-3.5-turbo",
                prompt: `Given the following symptoms: ${symptoms}, recommend the appropriate doctor specialization. Provide only one specialization.`,
                max_tokens: 50,
                temperature: 0.7,
            },
            {
                headers: {
                    "Authorization": `Bearer ${OPENAI_API_KEY}`,
                },
            }
        );

        const specialization = response.data.choices[0].text.trim();
        return specialization;
    } catch (error) {
        if (error.response && error.response.status === 429 && retries > 0) {
            // Retry on rate limit (429)
            console.log(`Rate limit exceeded. Retrying in ${delay / 1000} seconds...`);
            await new Promise(resolve => setTimeout(resolve, delay));
            return getDoctorSpecialization(symptoms, retries - 1, delay * 2); // Exponential backoff
        }

        // Log error and return null
        console.error("Error fetching from OpenAI:", error);
        return null;
    }
}


// API to handle user input and return doctor recommendations
export const recommendDoctor = async (req, res) => {
    const { symptoms } = req.body;

    try {
        // Step 1: Use GPT-3 to determine the doctor specialization
        const specialization = await getDoctorSpecialization(symptoms);

        if (!specialization) {
            return res.status(400).json({ message: "Could not determine specialization." });
        }

        // Step 2: Query the database for doctors with the determined specialization
        const doctors = await Doctors.find({
            specialization: { $regex: specialization, $options: "i" },
        });

        if (doctors.length === 0) {
            return res.status(404).json({ message: "No doctors found for this specialization." });
        }

        // Return the list of doctors
        res.json(doctors);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error fetching doctor recommendations." });
    }
};

