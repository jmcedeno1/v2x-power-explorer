import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ModulePrompt {
  module: string;
  contentTypes: string[];
  systemPrompt: string;
}

const modulePrompts: ModulePrompt[] = [
  {
    module: "dashboard",
    contentTypes: ["metrics", "highlights"],
    systemPrompt: `Generate dashboard content for a V2X research report. Based on the source materials, extract:
1. metrics: An array of 6 key metrics with { id, label, value, unit, trend ('up'|'down'|'stable'), change }
2. highlights: An array of 6-8 key highlights with { id, title, description, icon (one of: Zap, RefreshCw, Truck, Layers, Activity, Shield, Cpu, FileCheck), category ('technology'|'market'|'infrastructure'|'regulation'), impact ('high'|'medium') }

Return valid JSON with { metrics: [...], highlights: [...] }. If no relevant data is available, return empty arrays.`,
  },
  {
    module: "engineering",
    contentTypes: ["highlights", "specs", "evidence"],
    systemPrompt: `Generate engineering module content for V2X power electronics. Extract:
1. highlights: Array of 4 technical metrics { icon (Gauge|Thermometer|Battery|Zap), title, value, subtitle, color }
2. specs: Array of 4 system requirements { label, value, status ('mature'|'developing'|'critical') }
3. evidence: Array of 4 key evidence bullet points as strings

Return valid JSON. If no relevant data, return empty arrays.`,
  },
  {
    module: "patents",
    contentTypes: ["metrics", "gaps", "evidence"],
    systemPrompt: `Generate patents module content. Extract:
1. metrics: Array of 4 IP metrics { label, value, trend }
2. gaps: Array of 3 strategic white space areas { area, description, icon (Cloud|Lock|Cpu) }
3. evidence: Array of 3 IP landscape highlights as strings

Return valid JSON. If no relevant data, return empty arrays.`,
  },
  {
    module: "markets",
    contentTypes: ["metrics", "revenue_streams", "evidence"],
    systemPrompt: `Generate markets module content. Extract:
1. metrics: Array of 8 market indicators { icon, title, value, subtitle, color }
2. revenue_streams: Array of 5 revenue streams { name, share (percentage), description }
3. evidence: Array of 3 market evidence points as strings

Return valid JSON. If no relevant data, return empty arrays.`,
  },
  {
    module: "pilots",
    contentTypes: ["projects", "observations"],
    systemPrompt: `Generate pilots module content. Extract:
1. projects: Array of pilot projects { id, name, type, location, powerLevel, vehicleCount, gridServices (array), bottlenecks (array), maturity ('lab'|'pilot'|'depot'|'grid_critical'), status ('active'|'completed'|'planned') }
2. observations: Array of 3 key observations as strings

Return valid JSON. If no relevant data, return empty arrays.`,
  },
  {
    module: "standards",
    contentTypes: ["standards", "challenges", "evidence"],
    systemPrompt: `Generate standards module content. Extract:
1. standards: Array of key standards { name, year, status ('active'|'developing'), description, features (array) }
2. challenges: Array of grid code challenges { challenge, status ('critical'|'major'|'emerging'|'varies'), region }
3. evidence: Array of 3 institutional highlights as strings

Return valid JSON. If no relevant data, return empty arrays.`,
  },
  {
    module: "architectures",
    contentTypes: ["architectures", "components", "evidence"],
    systemPrompt: `Generate architectures module content. Extract:
1. architectures: Array of 3 architecture options { name, power, pros (array), cons (array), maturity ('Mature'|'Emerging'|'Pilot'), useCase }
2. components: Array of 4 system components { name, function, icon (Cpu|Zap|Battery|Building2) }
3. evidence: Array of 3 architecture highlights as strings

Return valid JSON. If no relevant data, return empty arrays.`,
  },
  {
    module: "risks",
    contentTypes: ["categories", "threats", "concerns"],
    systemPrompt: `Generate risks module content. Extract:
1. categories: Array of 4 risk categories { name, icon (Zap|Lock|Scale|Users), risks: [{ risk, severity ('critical'|'high'|'medium') }], color }
2. threats: Array of 5 system-level threats { threat, likelihood ('low'|'medium'|'high'), impact ('high'|'critical') }
3. concerns: Array of 4 critical concerns as strings

Return valid JSON. If no relevant data, return empty arrays.`,
  },
  {
    module: "foresight",
    contentTypes: ["priorities", "signals", "investments", "conclusions"],
    systemPrompt: `Generate foresight module content. Extract:
1. priorities: Array of 4 strategic priorities { priority, description, urgency ('immediate'|'near-term') }
2. signals: Array of 6 future signals { signal, impact ('Accelerator'|'Decelerator') }
3. investments: Array of 6 investment focus areas { area, focus, timeline }
4. conclusions: Array of 4 key conclusions as strings

Return valid JSON. If no relevant data, return empty arrays.`,
  },
];

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { module } = await req.json();
    
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // Get all processed sources
    const { data: sources, error: sourcesError } = await supabase
      .from("data_sources")
      .select("id, title, category, content_summary")
      .eq("is_processed", true);

    if (sourcesError) {
      throw new Error("Failed to fetch sources");
    }

    if (!sources || sources.length === 0) {
      // No sources, return empty content
      const moduleConfig = modulePrompts.find(m => m.module === module);
      if (!moduleConfig) {
        return new Response(JSON.stringify({ error: "Invalid module" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      // Save empty content for each content type
      for (const contentType of moduleConfig.contentTypes) {
        await supabase
          .from("generated_content")
          .upsert({
            module,
            content_type: contentType,
            content: contentType === "metrics" || contentType === "highlights" ? [] : {},
            source_ids: [],
            last_generated_at: new Date().toISOString(),
          }, { onConflict: "module,content_type" });
      }

      return new Response(JSON.stringify({ success: true, message: "No sources available" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Build combined context from source summaries
    const combinedContext = sources
      .map(s => `[${s.category.toUpperCase()}] ${s.title}\n${s.content_summary || "No summary available"}`)
      .join("\n\n---\n\n");

    const moduleConfig = modulePrompts.find(m => m.module === module);
    if (!moduleConfig) {
      return new Response(JSON.stringify({ error: "Invalid module" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Generate content using AI with tool calling for structured output
    const aiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: moduleConfig.systemPrompt },
          { role: "user", content: `Based on these source materials, generate the ${module} module content:\n\n${combinedContext.substring(0, 30000)}` },
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "save_module_content",
              description: "Save the generated module content",
              parameters: {
                type: "object",
                properties: moduleConfig.contentTypes.reduce((acc, type) => {
                  acc[type] = { type: "array", items: { type: "object" } };
                  return acc;
                }, {} as Record<string, unknown>),
                required: moduleConfig.contentTypes,
              },
            },
          },
        ],
        tool_choice: { type: "function", function: { name: "save_module_content" } },
      }),
    });

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      console.error("AI gateway error:", aiResponse.status, errorText);
      
      if (aiResponse.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded" }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (aiResponse.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted" }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      throw new Error("AI generation failed");
    }

    const aiData = await aiResponse.json();
    let generatedContent: Record<string, unknown> = {};

    // Extract content from tool call
    const toolCall = aiData.choices?.[0]?.message?.tool_calls?.[0];
    if (toolCall?.function?.arguments) {
      try {
        generatedContent = JSON.parse(toolCall.function.arguments);
      } catch {
        console.error("Failed to parse tool call arguments");
      }
    }

    // If tool calling didn't work, try parsing from content
    if (Object.keys(generatedContent).length === 0) {
      const content = aiData.choices?.[0]?.message?.content || "";
      try {
        // Try to extract JSON from response
        const jsonMatch = content.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          generatedContent = JSON.parse(jsonMatch[0]);
        }
      } catch {
        console.error("Failed to parse content as JSON");
      }
    }

    const sourceIds = sources.map(s => s.id);

    // Save each content type
    for (const contentType of moduleConfig.contentTypes) {
      const contentData = generatedContent[contentType] || [];
      await supabase
        .from("generated_content")
        .upsert({
          module,
          content_type: contentType,
          content: contentData,
          source_ids: sourceIds,
          last_generated_at: new Date().toISOString(),
        }, { onConflict: "module,content_type" });
    }

    return new Response(JSON.stringify({ success: true, content: generatedContent }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error generating report:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
