import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: "50mb" }));

  // API to generate prompt from an image
  app.post("/api/generate-prompt", async (req, res) => {
    try {
      const { imagePart } = req.body; // { inlineData: { data: "base64", mimeType: "image/jpeg" } }
      
      if (!imagePart) {
        return res.status(400).json({ error: "Missing imagePart" });
      }

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: [
          {
            role: "user",
            parts: [
              imagePart,
              { text: "Analyze this image and write a highly detailed, cinematic, and creative text-to-image prompt (like Midjourney or Stable Diffusion style) that could recreate this image or a masterpiece inspired by it. Focus on lighting, mood, subject, medium, camera angles, colors, and art style." }
            ]
          }
        ],
      });

      res.json({ prompt: response.text });
    } catch (error: any) {
      console.error(error);
      res.status(500).json({ error: error.message || "Failed to generate prompt" });
    }
  });

  // API to enhance simple prompts into ultra-detailed ones
  app.post("/api/enhance-prompt", async (req, res) => {
    try {
      const { prompt } = req.body;
      if (!prompt) {
        return res.status(400).json({ error: "Missing prompt" });
      }

      const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY || "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";

      const messages = [
        { role: "system", content: "You are an expert prompt engineer. The user will give you a simple idea, and you must write a highly detailed, cinematic, ultra-specific prompt (optimized for Midjourney or Stable Diffusion) based on their idea. Enhance it with details about lighting, camera angle, medium, mood, colors, and art style. Return ONLY the enhanced prompt text, nothing else." },
        { role: "user", content: prompt }
      ];

      const r = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "http://localhost:3000",
          "X-Title": "MH.dev"
        },
        body: JSON.stringify({
          model: "openai/gpt-4o-mini",
          max_tokens: 1000,
          messages
        })
      });

      if (!r.ok) {
        const errText = await r.text();
        throw new Error(`OpenRouter Error: ${errText}`);
      }

      const data = await r.json();
      if (!data.choices || !data.choices[0]) {
          throw new Error(`OpenRouter Error: Invalid response format ${JSON.stringify(data)}`);
      }
      res.json({ enhancedPrompt: data.choices[0].message.content });
    } catch (error: any) {
      console.error("Enhance error:", error);
      res.status(500).json({ error: error.message || "Failed to enhance prompt" });
    }
  });

  // API to edit image
  app.post("/api/edit-image", async (req, res) => {
    try {
      const { image, prompt } = req.body;
      if (!image || !prompt) {
        return res.status(400).json({ error: "Missing image or prompt" });
      }

      const base64Data = image.split(',')[1];
      const mimeType = image.split(':')[1].split(';')[0];
      
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
          parts: [
            {
              inlineData: {
                data: base64Data,
                mimeType: mimeType,
              },
            },
            {
              text: prompt,
            },
          ],
        },
      });
      
      let imageUrl = null;
      if (response.candidates && response.candidates[0].content.parts) {
        for (const part of response.candidates[0].content.parts) {
          if (part.inlineData) {
            const b64 = part.inlineData.data;
            const t = part.inlineData.mimeType || 'image/png';
            imageUrl = `data:${t};base64,${b64}`;
            break;
          }
        }
      }
      
      if (!imageUrl) {
        throw new Error("No image was returned from the API.");
      }

      res.json({ imageUrl });
    } catch (error: any) {
      console.error("Image edit error:", error);
      res.status(500).json({ error: error.message || "Failed to edit image" });
    }
  });

  // Generic AI Chatbot via OpenRouter
  app.post("/api/chat", async (req, res) => {
    try {
      const { messages } = req.body;
      if (!messages) {
        return res.status(400).json({ error: "Missing messages" });
      }

      const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY || "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";

      const r = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "http://localhost:3000",
          "X-Title": "MH.dev"
        },
        body: JSON.stringify({
          model: "openai/gpt-4o-mini",
          max_tokens: 1000,
          messages
        })
      });

      if (!r.ok) {
        const errText = await r.text();
        throw new Error(`OpenRouter Error: ${errText}`);
      }

      const data = await r.json();
      if (!data.choices || !data.choices[0]) {
          throw new Error(`OpenRouter Error: Invalid response format ${JSON.stringify(data)}`);
      }
      res.json({ reply: data.choices[0].message });
    } catch (error: any) {
      console.error("Chat error:", error);
      res.status(500).json({ error: error.message || "Failed to process chat" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*all', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
