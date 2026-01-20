import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { sourceId, filePath } = await req.json();

    if (!sourceId || !filePath) {
      return new Response(
        JSON.stringify({ error: "sourceId and filePath are required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // Download the file from storage
    const { data: fileData, error: downloadError } = await supabase.storage
      .from("data-sources")
      .download(filePath);

    if (downloadError || !fileData) {
      console.error("Download error:", downloadError);
      throw new Error("Failed to download file from storage");
    }

    // Convert blob to base64
    const arrayBuffer = await fileData.arrayBuffer();
    const base64Content = btoa(
      new Uint8Array(arrayBuffer).reduce((data, byte) => data + String.fromCharCode(byte), "")
    );

    // Determine file type from path
    const fileExt = filePath.split(".").pop()?.toLowerCase() || "";
    const mimeTypes: Record<string, string> = {
      pdf: "application/pdf",
      doc: "application/msword",
      docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      txt: "text/plain",
      md: "text/markdown",
      csv: "text/csv",
      xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      pptx: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    };
    const mimeType = mimeTypes[fileExt] || "application/octet-stream";

    // For text files, directly read content
    if (["txt", "md", "csv"].includes(fileExt)) {
      const textContent = new TextDecoder().decode(arrayBuffer);
      
      // Now process with AI to generate summary
      const aiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-3-flash-preview",
          messages: [
            {
              role: "system",
              content: `You are an expert analyst for V2X (Vehicle-to-Everything) bidirectional energy technology. 
Analyze the provided content and generate a concise summary focusing on:
- Key technical specifications and metrics
- Market data and projections
- Pilot project details and results
- Standards and regulatory information
- Engineering insights
- Risk factors and challenges
- Strategic opportunities

Keep the summary under 500 words. Focus on extractable facts, numbers, and insights.`,
            },
            {
              role: "user",
              content: `Analyze this document content:\n\n${textContent.substring(0, 30000)}`,
            },
          ],
        }),
      });

      if (!aiResponse.ok) {
        throw new Error("AI processing failed");
      }

      const aiData = await aiResponse.json();
      const summary = aiData.choices?.[0]?.message?.content || "";

      // Update the source with content and summary
      await supabase
        .from("data_sources")
        .update({
          content: textContent.substring(0, 50000),
          content_summary: summary,
          is_processed: true,
        })
        .eq("id", sourceId);

      return new Response(
        JSON.stringify({ success: true, summary }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // For PDFs and other documents, use AI with vision capabilities to extract text
    const aiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          {
            role: "system",
            content: `You are a document analysis expert specializing in V2X (Vehicle-to-Everything) and bidirectional energy technology.

Your task is to:
1. Extract and summarize all text content from the provided document
2. Focus on key technical details, specifications, metrics, market data, and strategic insights
3. Organize the information in a clear, structured format
4. Keep your summary under 800 words but capture all critical data points

Output format:
First, provide a brief overview (2-3 sentences).
Then list key findings organized by category (Technical, Market, Standards, Risks, Opportunities).
Include any specific numbers, dates, or metrics mentioned.`,
          },
          {
            role: "user",
            content: [
              {
                type: "text",
                text: "Please analyze this document and extract the key information:",
              },
              {
                type: "file",
                file: {
                  filename: filePath.split("/").pop() || "document",
                  file_data: `data:${mimeType};base64,${base64Content}`,
                },
              },
            ],
          },
        ],
      }),
    });

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      console.error("AI extraction error:", aiResponse.status, errorText);

      if (aiResponse.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again later." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (aiResponse.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI credits exhausted. Please add credits." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      throw new Error("Document extraction failed");
    }

    const aiData = await aiResponse.json();
    const extractedContent = aiData.choices?.[0]?.message?.content || "";

    // Update the source with extracted content
    await supabase
      .from("data_sources")
      .update({
        content: extractedContent.substring(0, 50000),
        content_summary: extractedContent,
        is_processed: true,
      })
      .eq("id", sourceId);

    return new Response(
      JSON.stringify({ success: true, summary: extractedContent }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error extracting document:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
