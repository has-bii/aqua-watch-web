export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      alerts: {
        Row: {
          acknowledged_at: string | null
          alert_timestamp: string
          anomaly_id: number | null
          aquarium_id: string
          id: number
          is_acknowledged: boolean
          message: string
          severity: Database["public"]["Enums"]["severity"]
          title: string
        }
        Insert: {
          acknowledged_at?: string | null
          alert_timestamp: string
          anomaly_id?: number | null
          aquarium_id: string
          id?: number
          is_acknowledged?: boolean
          message: string
          severity: Database["public"]["Enums"]["severity"]
          title: string
        }
        Update: {
          acknowledged_at?: string | null
          alert_timestamp?: string
          anomaly_id?: number | null
          aquarium_id?: string
          id?: number
          is_acknowledged?: boolean
          message?: string
          severity?: Database["public"]["Enums"]["severity"]
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "alerts_anomaly_id_fkey"
            columns: ["anomaly_id"]
            isOneToOne: false
            referencedRelation: "anomalies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "alerts_aquarium_id_fkey"
            columns: ["aquarium_id"]
            isOneToOne: false
            referencedRelation: "aquarium"
            referencedColumns: ["id"]
          },
        ]
      }
      anomalies: {
        Row: {
          actual_value: number
          anomaly_score: number
          aquarium_id: string
          created_at: string
          detected_at: string
          expected_value: number
          id: number
          is_resolved: boolean
          notes: string | null
          resolved_at: string | null
          sensor_name: Database["public"]["Enums"]["sensor_type"]
          severity: Database["public"]["Enums"]["severity"]
        }
        Insert: {
          actual_value: number
          anomaly_score: number
          aquarium_id: string
          created_at?: string
          detected_at: string
          expected_value: number
          id?: number
          is_resolved?: boolean
          notes?: string | null
          resolved_at?: string | null
          sensor_name: Database["public"]["Enums"]["sensor_type"]
          severity: Database["public"]["Enums"]["severity"]
        }
        Update: {
          actual_value?: number
          anomaly_score?: number
          aquarium_id?: string
          created_at?: string
          detected_at?: string
          expected_value?: number
          id?: number
          is_resolved?: boolean
          notes?: string | null
          resolved_at?: string | null
          sensor_name?: Database["public"]["Enums"]["sensor_type"]
          severity?: Database["public"]["Enums"]["severity"]
        }
        Relationships: [
          {
            foreignKeyName: "anomalies_aquarium_id_fkey"
            columns: ["aquarium_id"]
            isOneToOne: false
            referencedRelation: "aquarium"
            referencedColumns: ["id"]
          },
        ]
      }
      aquarium: {
        Row: {
          created_at: string
          desc: string | null
          id: string
          is_online: boolean
          last_online_at: string | null
          name: string
          online_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          desc?: string | null
          id?: string
          is_online?: boolean
          last_online_at?: string | null
          name: string
          online_at?: string | null
          user_id?: string
        }
        Update: {
          created_at?: string
          desc?: string | null
          id?: string
          is_online?: boolean
          last_online_at?: string | null
          name?: string
          online_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      aquarium_settings: {
        Row: {
          aquarium_id: string
          enable_sync: boolean
          id: string
          latitude: number | null
          longitude: number | null
          max_ph: number
          max_temperature: number
          min_do: number
          min_ph: number
          min_temperature: number
          prediction_parameters: string[] | null
          silent_until: string | null
          train_model_day_count: number
          train_ph_model_days: number
          train_temp_model_days: number
        }
        Insert: {
          aquarium_id: string
          enable_sync?: boolean
          id?: string
          latitude?: number | null
          longitude?: number | null
          max_ph?: number
          max_temperature?: number
          min_do?: number
          min_ph?: number
          min_temperature?: number
          prediction_parameters?: string[] | null
          silent_until?: string | null
          train_model_day_count?: number
          train_ph_model_days?: number
          train_temp_model_days?: number
        }
        Update: {
          aquarium_id?: string
          enable_sync?: boolean
          id?: string
          latitude?: number | null
          longitude?: number | null
          max_ph?: number
          max_temperature?: number
          min_do?: number
          min_ph?: number
          min_temperature?: number
          prediction_parameters?: string[] | null
          silent_until?: string | null
          train_model_day_count?: number
          train_ph_model_days?: number
          train_temp_model_days?: number
        }
        Relationships: [
          {
            foreignKeyName: "aquarium_settings_aquarium_id_fkey"
            columns: ["aquarium_id"]
            isOneToOne: true
            referencedRelation: "aquarium"
            referencedColumns: ["id"]
          },
        ]
      }
      feeding_times: {
        Row: {
          aquarium_id: string
          created_at: string
          fed_at: string
          id: number
        }
        Insert: {
          aquarium_id: string
          created_at?: string
          fed_at: string
          id?: number
        }
        Update: {
          aquarium_id?: string
          created_at?: string
          fed_at?: string
          id?: number
        }
        Relationships: [
          {
            foreignKeyName: "feeding_times_aquarium_id_fkey"
            columns: ["aquarium_id"]
            isOneToOne: false
            referencedRelation: "aquarium"
            referencedColumns: ["id"]
          },
        ]
      }
      logs: {
        Row: {
          activity_type: string
          aquarium_id: string | null
          created_at: string
          error_message: string
          id: number
          status: string
        }
        Insert: {
          activity_type: string
          aquarium_id?: string | null
          created_at?: string
          error_message: string
          id?: number
          status: string
        }
        Update: {
          activity_type?: string
          aquarium_id?: string | null
          created_at?: string
          error_message?: string
          id?: number
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "logs_aquarium_id_fkey"
            columns: ["aquarium_id"]
            isOneToOne: false
            referencedRelation: "aquarium"
            referencedColumns: ["id"]
          },
        ]
      }
      measurements: {
        Row: {
          created_at: string
          do: number | null
          env_id: string
          flow_rate: number | null
          id: number
          ph: number | null
          room_temperature: number | null
          turbidity: number | null
          water_temperature: number | null
        }
        Insert: {
          created_at?: string
          do?: number | null
          env_id: string
          flow_rate?: number | null
          id?: number
          ph?: number | null
          room_temperature?: number | null
          turbidity?: number | null
          water_temperature?: number | null
        }
        Update: {
          created_at?: string
          do?: number | null
          env_id?: string
          flow_rate?: number | null
          id?: number
          ph?: number | null
          room_temperature?: number | null
          turbidity?: number | null
          water_temperature?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "dataset_env_id_fkey"
            columns: ["env_id"]
            isOneToOne: false
            referencedRelation: "aquarium"
            referencedColumns: ["id"]
          },
        ]
      }
      ml_logs: {
        Row: {
          activity_type: string
          aquarium_id: string | null
          created_at: string
          error_message: string
          id: number
          metadata: Json | null
          processing_time_seconds: number | null
          status: string
        }
        Insert: {
          activity_type: string
          aquarium_id?: string | null
          created_at?: string
          error_message: string
          id?: number
          metadata?: Json | null
          processing_time_seconds?: number | null
          status: string
        }
        Update: {
          activity_type?: string
          aquarium_id?: string | null
          created_at?: string
          error_message?: string
          id?: number
          metadata?: Json | null
          processing_time_seconds?: number | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "logs_duplicate_aquarium_id_fkey"
            columns: ["aquarium_id"]
            isOneToOne: false
            referencedRelation: "aquarium"
            referencedColumns: ["id"]
          },
        ]
      }
      predictions: {
        Row: {
          actual_value: number | null
          aquarium_id: string
          confidence_lower: number
          confidence_upper: number
          created_at: string
          id: number
          model_version: string
          predicted_value: number
          prediction_error: number | null
          std_error: number
          target_parameter: Database["public"]["Enums"]["sensor_type"]
          target_time: string
        }
        Insert: {
          actual_value?: number | null
          aquarium_id: string
          confidence_lower: number
          confidence_upper: number
          created_at?: string
          id?: number
          model_version: string
          predicted_value: number
          prediction_error?: number | null
          std_error: number
          target_parameter: Database["public"]["Enums"]["sensor_type"]
          target_time: string
        }
        Update: {
          actual_value?: number | null
          aquarium_id?: string
          confidence_lower?: number
          confidence_upper?: number
          created_at?: string
          id?: number
          model_version?: string
          predicted_value?: number
          prediction_error?: number | null
          std_error?: number
          target_parameter?: Database["public"]["Enums"]["sensor_type"]
          target_time?: string
        }
        Relationships: [
          {
            foreignKeyName: "predictions_aquarium_id_fkey"
            columns: ["aquarium_id"]
            isOneToOne: false
            referencedRelation: "aquarium"
            referencedColumns: ["id"]
          },
        ]
      }
      water_changing_times: {
        Row: {
          aquarium_id: string
          change_reason: Database["public"]["Enums"]["water_change_reason"]
          changed_at: string
          id: number
          notes: string | null
          percentage_changed: number
          volume_changed_liters: number
          water_temperature_added: number
        }
        Insert: {
          aquarium_id: string
          change_reason: Database["public"]["Enums"]["water_change_reason"]
          changed_at: string
          id?: number
          notes?: string | null
          percentage_changed: number
          volume_changed_liters: number
          water_temperature_added: number
        }
        Update: {
          aquarium_id?: string
          change_reason?: Database["public"]["Enums"]["water_change_reason"]
          changed_at?: string
          id?: number
          notes?: string | null
          percentage_changed?: number
          volume_changed_liters?: number
          water_temperature_added?: number
        }
        Relationships: [
          {
            foreignKeyName: "water_changing_times_aquarium_id_fkey"
            columns: ["aquarium_id"]
            isOneToOne: false
            referencedRelation: "aquarium"
            referencedColumns: ["id"]
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
      sensor_type: "ph" | "do" | "water_temperature"
      severity: "low" | "medium" | "high" | "critical"
      water_change_reason: "scheduled" | "emergency" | "maintenance"
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
    Enums: {
      ENV_TYPE: ["aquarium", "pond"],
      sensor_type: ["ph", "do", "water_temperature"],
      severity: ["low", "medium", "high", "critical"],
      water_change_reason: ["scheduled", "emergency", "maintenance"],
    },
  },
} as const
