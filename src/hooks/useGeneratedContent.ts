import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface GeneratedContent {
  id: string;
  module: string;
  content_type: string;
  content: unknown;
  source_ids: string[];
  last_generated_at: string;
  created_at: string;
}

export function useGeneratedContent(module: string, contentType: string) {
  return useQuery({
    queryKey: ["generated-content", module, contentType],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("generated_content")
        .select("*")
        .eq("module", module)
        .eq("content_type", contentType)
        .maybeSingle();

      if (error) throw error;
      return data as GeneratedContent | null;
    },
  });
}

export function useModuleContent(module: string) {
  return useQuery({
    queryKey: ["generated-content", module],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("generated_content")
        .select("*")
        .eq("module", module);

      if (error) throw error;
      
      // Convert array to object keyed by content_type
      const contentMap: Record<string, unknown> = {};
      (data || []).forEach((item: GeneratedContent) => {
        contentMap[item.content_type] = item.content;
      });
      
      return contentMap;
    },
  });
}

export function useGenerateReport() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (module: string) => {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/generate-report`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify({ module }),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Generation failed");
      }

      return response.json();
    },
    onSuccess: (_, module) => {
      queryClient.invalidateQueries({ queryKey: ["generated-content", module] });
      toast.success(`${module} content generated successfully`);
    },
    onError: (error: Error) => {
      console.error("Error generating report:", error);
      toast.error(error.message || "Failed to generate report");
    },
  });
}

export function useGenerateAllReports() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const modules = [
        "dashboard",
        "engineering",
        "patents",
        "markets",
        "pilots",
        "standards",
        "architectures",
        "risks",
        "foresight",
      ];

      const results = [];
      for (const module of modules) {
        const response = await fetch(
          `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/generate-report`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
            },
            body: JSON.stringify({ module }),
          }
        );

        if (!response.ok) {
          const error = await response.json();
          console.error(`Failed to generate ${module}:`, error);
        } else {
          results.push(await response.json());
        }
      }

      return results;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["generated-content"] });
      toast.success("All reports generated successfully");
    },
    onError: (error: Error) => {
      console.error("Error generating reports:", error);
      toast.error(error.message || "Failed to generate reports");
    },
  });
}
