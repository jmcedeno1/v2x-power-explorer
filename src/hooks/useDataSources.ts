import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface DataSourceDB {
  id: string;
  title: string;
  description: string | null;
  category: string;
  source_type: string;
  url: string | null;
  file_path: string | null;
  file_name: string | null;
  author: string | null;
  source_date: string | null;
  tags: string[];
  content: string | null;
  content_summary: string | null;
  is_processed: boolean;
  created_at: string;
  updated_at: string;
}

export function useDataSources() {
  return useQuery({
    queryKey: ["data-sources"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("data_sources")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as DataSourceDB[];
    },
  });
}

export function useAddDataSource() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (source: Omit<DataSourceDB, "id" | "created_at" | "updated_at" | "is_processed" | "content" | "content_summary">) => {
      const { data, error } = await supabase
        .from("data_sources")
        .insert({
          title: source.title,
          description: source.description,
          category: source.category,
          source_type: source.source_type,
          url: source.url,
          file_path: source.file_path,
          file_name: source.file_name,
          author: source.author,
          source_date: source.source_date,
          tags: source.tags || [],
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["data-sources"] });
      toast.success("Data source added successfully");
    },
    onError: (error) => {
      console.error("Error adding source:", error);
      toast.error("Failed to add data source");
    },
  });
}

export function useDeleteDataSource() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("data_sources")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["data-sources"] });
      toast.success("Data source deleted");
    },
    onError: (error) => {
      console.error("Error deleting source:", error);
      toast.error("Failed to delete data source");
    },
  });
}

export function useProcessSource() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ sourceId, content }: { sourceId: string; content?: string }) => {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/process-source`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify({ sourceId, content }),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Processing failed");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["data-sources"] });
      toast.success("Source processed successfully");
    },
    onError: (error: Error) => {
      console.error("Error processing source:", error);
      toast.error(error.message || "Failed to process source");
    },
  });
}

export function useUploadFile() {
  return useMutation({
    mutationFn: async (file: File) => {
      const fileExt = file.name.split(".").pop();
      const filePath = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("data-sources")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      return { filePath, fileName: file.name };
    },
    onError: (error) => {
      console.error("Error uploading file:", error);
      toast.error("Failed to upload file");
    },
  });
}
