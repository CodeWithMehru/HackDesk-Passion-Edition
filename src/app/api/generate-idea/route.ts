import { NextResponse } from "next/server";
import { createClient } from '@supabase/supabase-js';
import { GoogleGenerativeAI } from "@google/generative-ai";

type ThemeIdeaRow = {
  id?: string;
  theme_name: string;
  theme_meaning: string;
  idea_title: string;
  description: string;
  tech_stack: string;
  is_taken: boolean;
};

// Supabase Client Setup
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// 1. Get Idea from existing Supabase Pool
async function claimOneIdea() {
  const { data, error } = await supabase
    .from("Theme_Ideas")
    .select("*")
    .eq("is_taken", false)
    .limit(1);

  if (error) {
    console.error("Supabase select error:", error);
    throw error;
  }

  if (!data || data.length === 0) {
    return null; // Pool is empty
  }

  const idea = data[0];

  const { error: updateError } = await supabase
    .from("Theme_Ideas")
    .update({ is_taken: true })
    .eq("id", idea.id);

  if (updateError) {
    console.error("Supabase update error:", updateError);
    throw updateError;
  }

  return { ...idea, is_taken: true } as ThemeIdeaRow;
}

// 2. Google AI Smart Fallback Generator (NEW)
async function generateLiveIdeaWithGoogleAI() {
  const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_KEY || "");
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const prompt = `You are an expert hackathon mentor. Generate ONE unique, beginner-friendly software project idea.
  Return EXACTLY a raw JSON object (without markdown blocks like \`\`\`json) containing these exact keys:
  "theme_name": "Short category (e.g., Productivity)",
  "theme_meaning": "One sentence explaining the category",
  "idea_title": "Catchy project name",
  "description": "Two sentences explaining what to build",
  "tech_stack": "Comma separated technologies (e.g., Next.js, Tailwind, Supabase)"`;

  const result = await model.generateContent(prompt);
  let responseText = result.response.text();
  
  // Clean JSON response
  responseText = responseText.replace(/```json/g, "").replace(/```/g, "").trim();
  const aiData = JSON.parse(responseText);

  const newIdea = {
    theme_name: aiData.theme_name,
    theme_meaning: aiData.theme_meaning,
    idea_title: aiData.idea_title,
    description: aiData.description,
    tech_stack: aiData.tech_stack,
    is_taken: true // Direct assigned to student
  };

  // Save the AI generated idea to Supabase tracking
  const { data, error } = await supabase
    .from("Theme_Ideas")
    .insert([newIdea])
    .select()
    .single();

  if (error) {
    console.error("Failed to save AI idea to Supabase:", error);
    throw error;
  }

  return data as ThemeIdeaRow;
}

// Main API Route
export async function POST() {
  try {
    // Step 1: Try database first
    let idea = await claimOneIdea();

    // Step 2: If pool empty, trigger Google AI LIVE!
    if (!idea) {
      try {
        console.log("Pool empty! Falling back to Google AI...");
        idea = await generateLiveIdeaWithGoogleAI();
      } catch (aiError) {
        console.error("Google AI failed:", aiError);
        return NextResponse.json(
          { error: "POOL_EMPTY", message: "Ideas pool empty and AI generation failed." }, 
          { status: 200 }
        );
      }
    }

    return NextResponse.json({ idea });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Server error" },
      { status: 500 }
    );
  }
}