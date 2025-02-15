export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      dataset: {
        Row: {
          created_at: string
          env_id: string
          id: number
          temp: number
        }
        Insert: {
          created_at?: string
          env_id: string
          id?: number
          temp: number
        }
        Update: {
          created_at?: string
          env_id?: string
          id?: number
          temp?: number
        }
        Relationships: [
          {
            foreignKeyName: "dataset_env_id_fkey"
            columns: ["env_id"]
            isOneToOne: false
            referencedRelation: "environment"
            referencedColumns: ["id"]
          },
        ]
      }
      ecosystems: {
        Row: {
          created_at: string
          desc: string | null
          id: string
          name: string
          slug: string
          user_id: string
        }
        Insert: {
          created_at?: string
          desc?: string | null
          id?: string
          name: string
          slug: string
          user_id?: string
        }
        Update: {
          created_at?: string
          desc?: string | null
          id?: string
          name?: string
          slug?: string
          user_id?: string
        }
        Relationships: []
      }
      environment: {
        Row: {
          created_at: string
          desc: string | null
          ecosystem_slug: string | null
          env_type: Database["public"]["Enums"]["ENV_TYPE"]
          id: string
          interval: number
          is_receive_email: boolean
          is_receive_wa: boolean
          name: string
          notify_for: Database["public"]["Enums"]["notify_for"]
          temp_max: number | null
          temp_method: Database["public"]["Enums"]["temp_method"]
          temp_min: number | null
          user_id: string
        }
        Insert: {
          created_at?: string
          desc?: string | null
          ecosystem_slug?: string | null
          env_type?: Database["public"]["Enums"]["ENV_TYPE"]
          id?: string
          interval?: number
          is_receive_email?: boolean
          is_receive_wa?: boolean
          name: string
          notify_for?: Database["public"]["Enums"]["notify_for"]
          temp_max?: number | null
          temp_method?: Database["public"]["Enums"]["temp_method"]
          temp_min?: number | null
          user_id?: string
        }
        Update: {
          created_at?: string
          desc?: string | null
          ecosystem_slug?: string | null
          env_type?: Database["public"]["Enums"]["ENV_TYPE"]
          id?: string
          interval?: number
          is_receive_email?: boolean
          is_receive_wa?: boolean
          name?: string
          notify_for?: Database["public"]["Enums"]["notify_for"]
          temp_max?: number | null
          temp_method?: Database["public"]["Enums"]["temp_method"]
          temp_min?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "environment_ecosystem_slug_fkey"
            columns: ["ecosystem_slug"]
            isOneToOne: false
            referencedRelation: "ecosystems"
            referencedColumns: ["slug"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      ENV_TYPE: "aquarium" | "pond"
      notify_for: "nothing" | "anomalies"
      temp_method: "auto" | "manual"
      Testing: "testing_1" | "testing_2"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
