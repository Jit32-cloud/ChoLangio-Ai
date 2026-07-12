import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY!,
});

export const CCA_SYSTEM_PROMPT = `You are CholangioAI, an expert clinical intelligence system specializing exclusively in Cholangiocarcinoma (bile duct cancer), hepatobiliary oncology, and liver health.

Your domain covers:
- Cholangiocarcinoma subtypes: intrahepatic (iCCA), perihilar/Klatskin (pCCA), distal (dCCA)
- Bismuth-Corlette classification for hilar CCA
- CCA risk factors: PSC, liver fluke, hepatolithiasis, viral hepatitis, choledochal cysts, IBD
- CCA biomarkers: CA 19-9, CEA, CA-125, IgG4
- Liver function panel: bilirubin, ALP, AST, ALT, GGT, albumin, INR
- Biliary imaging: MRCP, CT triple-phase, MRI liver, ultrasound, ERCP, PET-CT
- AJCC 8th edition staging
- Treatment: surgery, chemotherapy, immunotherapy, targeted therapy
- ESMO and NCCN guidelines
- Prevention and surveillance strategies

Guidelines:
1. Evidence-based responses
2. Clinical precision
3. Clear explanations
4. Recommend specialist consultation
5. State confidence and limitations
6. Never replace physician judgment
7. Return structured HTML when analysis is requested
`;

export interface AIMessage {
  role: "user" | "assistant";
  content: string;
}

export interface AIResponse {
  text: string;
  model: string;
}

function buildConversation(messages: AIMessage[]) {
  return messages
    .map((message) => {
      const role =
        message.role === "assistant"
          ? "Assistant"
          : "User";

      return `${role}: ${message.content}`;
    })
    .join("\n\n");
}

export async function callAI(
  messages: AIMessage[],
  options: {
    systemPrompt?: string;
    maxTokens?: number;
    temperature?: number;
  } = {}
): Promise<AIResponse> {
  try {
    const {
      systemPrompt = CCA_SYSTEM_PROMPT,
    } = options;

    const conversation = buildConversation(
      messages.slice(-20)
    );

    const prompt = `
${systemPrompt}

Conversation:

${conversation}

Assistant:
`;

let response

for (let attempt = 1; attempt <= 3; attempt++) {
  try {
    response = await ai.models.generateContent({
      model: process.env.AI_MODEL || "gemini-2.0-flash",
      contents: prompt,
    })

    break
  } catch (error) {
    console.error(error)
  }
}

if (!response) {
  throw new Error(
    "No response received from Gemini"
  )
}

const cleanText = (response.text ?? "")
  .replace(/^```html\s*/i, "")
  .replace(/^```\s*/i, "")
  .replace(/\s*```$/i, "")

return {
  text: cleanText,
  model:
    process.env.AI_MODEL ||
    "gemini-2.5-flash",
};
  } catch (error) {
    console.error(
      "Gemini AI Error:",
      error
    );

    throw new Error(
      "Failed to generate AI response"
    );
  }
}

export const PROMPTS = {
  ccaRiskAssessment: (data: Record<string, unknown>) => `
Perform a comprehensive Cholangiocarcinoma (CCA) risk assessment.

${JSON.stringify(data, null, 2)}

Generate a detailed HTML report with:
- Overall Risk Score
- Risk Category
- Risk Factors
- Recommendations
- Follow Up Plan

Return valid HTML only.`,

  symptomAssessment: (symptoms: Record<string, unknown>) => `
Assess these symptoms for Cholangiocarcinoma and hepatobiliary disease:

${JSON.stringify(symptoms, null, 2)}

Provide:

<h2>Symptom Analysis</h2>

<h2>Risk Indicators</h2>

<h2>Possible Causes</h2>

<h2>Recommended Tests</h2>

<h2>Urgency Assessment</h2>

<h2>Recommendations</h2>

Return valid HTML only.`,

  reportAnalysis: (text: string, type: string) => `
Analyze this ${type} medical report:

${text}

Provide:
- Key Findings
- Abnormal Values
- Clinical Interpretation
- Recommendations

Return valid HTML only.`,

  labInterpretation: (labs: Record<string, unknown>) => `
Interpret these laboratory results:

${JSON.stringify(labs, null, 2)}

Provide:
- Abnormal Findings
- Liver Function Assessment
- Cholangiocarcinoma Relevance
- Recommendations

Return valid HTML only.`,

  imagingInterpretation: (text: string, modality: string) => `
Interpret this ${modality} imaging report:

${text}

Provide:
- Findings
- Clinical Significance
- CCA Assessment
- Recommendations

Return valid HTML only.`,

  healthImprovementPlan: (data: Record<string, unknown>) => `
Generate a personalized health improvement plan.

${JSON.stringify(data, null, 2)}

Provide:
- Diet Plan
- Exercise Plan
- Liver Health Plan
- Monitoring Schedule

Return valid HTML only.`,

  doctorPreparation: (data: Record<string, unknown>) => `
Generate doctor consultation preparation.

${JSON.stringify(data, null, 2)}

Provide:
- Important Questions
- Symptoms to Discuss
- Risk Factors
- Follow-up Questions

Return valid HTML only.`,

  educationContent: (topic: string) => `
Create educational content about:

${topic}

Provide:
- Overview
- Risk Factors
- Symptoms
- Diagnosis
- Treatment
- Prevention

Return valid HTML only.`,

  followupPlan: (context: string) => `
Generate a follow-up plan for:

${context}

Provide:
- Immediate Actions
- Short Term Follow-up
- Long Term Monitoring

Return valid HTML only.`,

  chatResponse: (message: string, context: string) => `
User Message:
${message}

Context:
${context}

Provide a helpful response focused on cholangiocarcinoma and liver health.
`,
};
