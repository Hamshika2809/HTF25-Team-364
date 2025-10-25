import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface SymptomRequest {
  symptoms: string;
}

interface Condition {
  name: string;
  confidence: number;
  severity: string;
  remedies: string[];
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const { symptoms }: SymptomRequest = await req.json();

    if (!symptoms || symptoms.trim().length === 0) {
      return new Response(
        JSON.stringify({ error: "Symptoms description is required" }),
        {
          status: 400,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    const conditions = analyzeSymptoms(symptoms.toLowerCase());

    return new Response(
      JSON.stringify({ conditions }),
      {
        status: 200,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: "Failed to analyze symptoms" }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  }
});

function analyzeSymptoms(symptoms: string): Condition[] {
  const conditions: Condition[] = [];

  if (symptoms.includes("headache") || symptoms.includes("head")) {
    if (symptoms.includes("fever") || symptoms.includes("nausea")) {
      conditions.push({
        name: "Migraine",
        confidence: 75,
        severity: "medium",
        remedies: [
          "Rest in a quiet, dark room",
          "Apply cold compress to forehead",
          "Stay hydrated",
          "Avoid bright lights and loud noises",
          "Consider over-the-counter pain relievers",
        ],
      });
    } else {
      conditions.push({
        name: "Tension Headache",
        confidence: 80,
        severity: "low",
        remedies: [
          "Get adequate rest",
          "Practice relaxation techniques",
          "Apply heat or cold to affected area",
          "Maintain good posture",
          "Stay hydrated",
        ],
      });
    }
  }

  if (symptoms.includes("fever") || symptoms.includes("temperature")) {
    if (symptoms.includes("cough") || symptoms.includes("throat")) {
      conditions.push({
        name: "Upper Respiratory Infection",
        confidence: 85,
        severity: "medium",
        remedies: [
          "Get plenty of rest",
          "Drink warm fluids",
          "Use throat lozenges",
          "Gargle with salt water",
          "Use a humidifier",
        ],
      });
    } else {
      conditions.push({
        name: "Viral Infection",
        confidence: 70,
        severity: "medium",
        remedies: [
          "Rest and stay home",
          "Drink plenty of fluids",
          "Monitor temperature regularly",
          "Take fever reducers if needed",
          "Seek medical attention if fever persists",
        ],
      });
    }
  }

  if (symptoms.includes("stomach") || symptoms.includes("nausea") || symptoms.includes("vomit")) {
    conditions.push({
      name: "Gastroenteritis",
      confidence: 78,
      severity: "medium",
      remedies: [
        "Stay hydrated with clear fluids",
        "Eat bland foods (BRAT diet)",
        "Avoid dairy and fatty foods",
        "Get plenty of rest",
        "Consider electrolyte solutions",
      ],
    });
  }

  if (symptoms.includes("throat") || symptoms.includes("sore")) {
    conditions.push({
      name: "Pharyngitis",
      confidence: 82,
      severity: "low",
      remedies: [
        "Gargle with warm salt water",
        "Drink warm liquids",
        "Use throat lozenges",
        "Rest your voice",
        "Use a humidifier",
      ],
    });
  }

  if (symptoms.includes("cough")) {
    conditions.push({
      name: "Bronchitis",
      confidence: 72,
      severity: "medium",
      remedies: [
        "Get plenty of rest",
        "Drink warm fluids",
        "Use a humidifier",
        "Avoid irritants like smoke",
        "Consider honey for cough relief",
      ],
    });
  }

  if (symptoms.includes("tired") || symptoms.includes("fatigue") || symptoms.includes("exhausted")) {
    conditions.push({
      name: "Fatigue Syndrome",
      confidence: 65,
      severity: "low",
      remedies: [
        "Ensure adequate sleep (7-9 hours)",
        "Maintain regular exercise routine",
        "Eat balanced, nutritious meals",
        "Manage stress levels",
        "Consider vitamin supplementation",
      ],
    });
  }

  if (symptoms.includes("dizzy") || symptoms.includes("vertigo")) {
    conditions.push({
      name: "Vertigo",
      confidence: 70,
      severity: "medium",
      remedies: [
        "Sit or lie down immediately",
        "Avoid sudden movements",
        "Stay hydrated",
        "Avoid driving",
        "Practice balance exercises",
      ],
    });
  }

  if (conditions.length === 0) {
    conditions.push({
      name: "General Malaise",
      confidence: 60,
      severity: "low",
      remedies: [
        "Get adequate rest",
        "Stay well hydrated",
        "Eat nutritious meals",
        "Monitor symptoms closely",
        "Consult a doctor if symptoms persist",
      ],
    });
  }

  return conditions.sort((a, b) => b.confidence - a.confidence).slice(0, 4);
}
