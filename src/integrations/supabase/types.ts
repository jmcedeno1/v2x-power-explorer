export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      corpus_manifest: {
        Row: {
          doc_type_breakdown: Json | null
          document_uids: string[]
          generated_at: string
          id: string
          section: string
          source_breakdown: Json | null
        }
        Insert: {
          doc_type_breakdown?: Json | null
          document_uids: string[]
          generated_at?: string
          id?: string
          section: string
          source_breakdown?: Json | null
        }
        Update: {
          doc_type_breakdown?: Json | null
          document_uids?: string[]
          generated_at?: string
          id?: string
          section?: string
          source_breakdown?: Json | null
        }
        Relationships: []
      }
      data_sources: {
        Row: {
          author: string | null
          category: string
          content: string | null
          content_summary: string | null
          created_at: string
          description: string | null
          file_name: string | null
          file_path: string | null
          id: string
          is_processed: boolean | null
          source_date: string | null
          source_type: string
          tags: string[] | null
          title: string
          updated_at: string
          url: string | null
        }
        Insert: {
          author?: string | null
          category: string
          content?: string | null
          content_summary?: string | null
          created_at?: string
          description?: string | null
          file_name?: string | null
          file_path?: string | null
          id?: string
          is_processed?: boolean | null
          source_date?: string | null
          source_type: string
          tags?: string[] | null
          title: string
          updated_at?: string
          url?: string | null
        }
        Update: {
          author?: string | null
          category?: string
          content?: string | null
          content_summary?: string | null
          created_at?: string
          description?: string | null
          file_name?: string | null
          file_path?: string | null
          id?: string
          is_processed?: boolean | null
          source_date?: string | null
          source_type?: string
          tags?: string[] | null
          title?: string
          updated_at?: string
          url?: string | null
        }
        Relationships: []
      }
      diffusion_series: {
        Row: {
          created_at: string
          id: string
          series_type: string
          value: number
          year: number
        }
        Insert: {
          created_at?: string
          id?: string
          series_type: string
          value: number
          year: number
        }
        Update: {
          created_at?: string
          id?: string
          series_type?: string
          value?: number
          year?: number
        }
        Relationships: []
      }
      documents: {
        Row: {
          abstract: string | null
          citations: number | null
          countries: string[]
          created_at: string
          date: string | null
          doc_type: string
          doi: string | null
          fetched_at: string
          id: string
          lens_id: string | null
          orgs: string[]
          raw: Json | null
          source: string
          standards_mentions: string[]
          taxonomy_tags: string[]
          title: string
          uid: string
          updated_at: string
          url: string | null
          year: number | null
        }
        Insert: {
          abstract?: string | null
          citations?: number | null
          countries?: string[]
          created_at?: string
          date?: string | null
          doc_type: string
          doi?: string | null
          fetched_at?: string
          id?: string
          lens_id?: string | null
          orgs?: string[]
          raw?: Json | null
          source: string
          standards_mentions?: string[]
          taxonomy_tags?: string[]
          title: string
          uid: string
          updated_at?: string
          url?: string | null
          year?: number | null
        }
        Update: {
          abstract?: string | null
          citations?: number | null
          countries?: string[]
          created_at?: string
          date?: string | null
          doc_type?: string
          doi?: string | null
          fetched_at?: string
          id?: string
          lens_id?: string | null
          orgs?: string[]
          raw?: Json | null
          source?: string
          standards_mentions?: string[]
          taxonomy_tags?: string[]
          title?: string
          uid?: string
          updated_at?: string
          url?: string | null
          year?: number | null
        }
        Relationships: []
      }
      generated_content: {
        Row: {
          content: Json
          content_type: string
          created_at: string
          id: string
          last_generated_at: string
          module: string
          source_ids: string[] | null
        }
        Insert: {
          content?: Json
          content_type: string
          created_at?: string
          id?: string
          last_generated_at?: string
          module: string
          source_ids?: string[] | null
        }
        Update: {
          content?: Json
          content_type?: string
          created_at?: string
          id?: string
          last_generated_at?: string
          module?: string
          source_ids?: string[] | null
        }
        Relationships: []
      }
      generated_sections: {
        Row: {
          content: Json
          content_type: string | null
          evidence_uids: string[]
          generated_at: string
          id: string
          section_name: string
          updated_at: string
        }
        Insert: {
          content?: Json
          content_type?: string | null
          evidence_uids?: string[]
          generated_at?: string
          id?: string
          section_name: string
          updated_at?: string
        }
        Update: {
          content?: Json
          content_type?: string | null
          evidence_uids?: string[]
          generated_at?: string
          id?: string
          section_name?: string
          updated_at?: string
        }
        Relationships: []
      }
      maturity_scores: {
        Row: {
          created_at: string
          evidence_document_count: number
          evidence_uids: string[]
          id: string
          patent_family_count: number
          patent_maturity_level: string | null
          standardization_maturity_level: string | null
          standards_evidence_count: number
          tag_id: string
          tag_name: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          evidence_document_count?: number
          evidence_uids?: string[]
          id?: string
          patent_family_count?: number
          patent_maturity_level?: string | null
          standardization_maturity_level?: string | null
          standards_evidence_count?: number
          tag_id: string
          tag_name?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          evidence_document_count?: number
          evidence_uids?: string[]
          id?: string
          patent_family_count?: number
          patent_maturity_level?: string | null
          standardization_maturity_level?: string | null
          standards_evidence_count?: number
          tag_id?: string
          tag_name?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      organizations: {
        Row: {
          confidence: number | null
          created_at: string
          evidence_uids: string[]
          id: string
          name: string
          patent_families_count: number
          publication_count: number
          role: string | null
          updated_at: string
        }
        Insert: {
          confidence?: number | null
          created_at?: string
          evidence_uids?: string[]
          id?: string
          name: string
          patent_families_count?: number
          publication_count?: number
          role?: string | null
          updated_at?: string
        }
        Update: {
          confidence?: number | null
          created_at?: string
          evidence_uids?: string[]
          id?: string
          name?: string
          patent_families_count?: number
          publication_count?: number
          role?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      pilots: {
        Row: {
          country: string | null
          created_at: string
          description: string | null
          end_date: string | null
          evidence_uid: string
          evidence_uids: string[] | null
          failure_mode_count: number | null
          fleet_size: number | null
          gap_categories: string[] | null
          id: string
          image_url: string | null
          investment_usd: number | null
          latitude: number | null
          location: string | null
          longitude: number | null
          name: string
          partners: string[]
          power_kw: number | null
          start_date: string | null
          status: string | null
          updated_at: string
          v2x_type: string[] | null
        }
        Insert: {
          country?: string | null
          created_at?: string
          description?: string | null
          end_date?: string | null
          evidence_uid: string
          evidence_uids?: string[] | null
          failure_mode_count?: number | null
          fleet_size?: number | null
          gap_categories?: string[] | null
          id?: string
          image_url?: string | null
          investment_usd?: number | null
          latitude?: number | null
          location?: string | null
          longitude?: number | null
          name: string
          partners?: string[]
          power_kw?: number | null
          start_date?: string | null
          status?: string | null
          updated_at?: string
          v2x_type?: string[] | null
        }
        Update: {
          country?: string | null
          created_at?: string
          description?: string | null
          end_date?: string | null
          evidence_uid?: string
          evidence_uids?: string[] | null
          failure_mode_count?: number | null
          fleet_size?: number | null
          gap_categories?: string[] | null
          id?: string
          image_url?: string | null
          investment_usd?: number | null
          latitude?: number | null
          location?: string | null
          longitude?: number | null
          name?: string
          partners?: string[]
          power_kw?: number | null
          start_date?: string | null
          status?: string | null
          updated_at?: string
          v2x_type?: string[] | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          aliases: string[]
          created_at: string
          id: string
          is_active: boolean
          name: string
          queries: Json
          slug: string
          standards_watchlist: string[]
          updated_at: string
        }
        Insert: {
          aliases?: string[]
          created_at?: string
          id?: string
          is_active?: boolean
          name: string
          queries?: Json
          slug: string
          standards_watchlist?: string[]
          updated_at?: string
        }
        Update: {
          aliases?: string[]
          created_at?: string
          id?: string
          is_active?: boolean
          name?: string
          queries?: Json
          slug?: string
          standards_watchlist?: string[]
          updated_at?: string
        }
        Relationships: []
      }
      qa_log: {
        Row: {
          category: string | null
          details: Json | null
          id: string
          level: string | null
          message: string
          section: string | null
          ts: string
        }
        Insert: {
          category?: string | null
          details?: Json | null
          id?: string
          level?: string | null
          message: string
          section?: string | null
          ts?: string
        }
        Update: {
          category?: string | null
          details?: Json | null
          id?: string
          level?: string | null
          message?: string
          section?: string | null
          ts?: string
        }
        Relationships: []
      }
      quantitative_claims: {
        Row: {
          confidence: string
          context: string | null
          created_at: string
          document_uid: string
          id: string
          metric: string
          unit: string
          value: number
        }
        Insert: {
          confidence?: string
          context?: string | null
          created_at?: string
          document_uid: string
          id?: string
          metric: string
          unit: string
          value: number
        }
        Update: {
          confidence?: string
          context?: string | null
          created_at?: string
          document_uid?: string
          id?: string
          metric?: string
          unit?: string
          value?: number
        }
        Relationships: []
      }
      standards_mentions: {
        Row: {
          created_at: string
          document_uid: string
          id: string
          mention_context: string | null
          standard_id: string
          standard_name: string | null
          status: string | null
        }
        Insert: {
          created_at?: string
          document_uid: string
          id?: string
          mention_context?: string | null
          standard_id: string
          standard_name?: string | null
          status?: string | null
        }
        Update: {
          created_at?: string
          document_uid?: string
          id?: string
          mention_context?: string | null
          standard_id?: string
          standard_name?: string | null
          status?: string | null
        }
        Relationships: []
      }
      taxonomy_nodes: {
        Row: {
          aliases: string[]
          created_at: string
          id: string
          name: string
          parent_tag_id: string | null
          profile_slug: string
          tag_id: string
        }
        Insert: {
          aliases?: string[]
          created_at?: string
          id?: string
          name: string
          parent_tag_id?: string | null
          profile_slug: string
          tag_id: string
        }
        Update: {
          aliases?: string[]
          created_at?: string
          id?: string
          name?: string
          parent_tag_id?: string | null
          profile_slug?: string
          tag_id?: string
        }
        Relationships: []
      }
      taxonomy_tags: {
        Row: {
          confidence: number | null
          created_at: string
          document_uid: string
          id: string
          tag_id: string
          tag_name: string | null
        }
        Insert: {
          confidence?: number | null
          created_at?: string
          document_uid: string
          id?: string
          tag_id: string
          tag_name?: string | null
        }
        Update: {
          confidence?: number | null
          created_at?: string
          document_uid?: string
          id?: string
          tag_id?: string
          tag_name?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
