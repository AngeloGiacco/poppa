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
      concept_events: {
        Row: {
          id: string
          user_id: string
          session_id: string | null
          language_code: string
          event_type: string
          concept_type: string
          concept_id: string | null
          concept_identifier: string
          context: Json
          occurred_at: string
          session_timestamp_seconds: number | null
        }
        Insert: {
          id?: string
          user_id: string
          session_id?: string | null
          language_code: string
          event_type: string
          concept_type: string
          concept_id?: string | null
          concept_identifier: string
          context?: Json
          occurred_at?: string
          session_timestamp_seconds?: number | null
        }
        Update: {
          id?: string
          user_id?: string
          session_id?: string | null
          language_code?: string
          event_type?: string
          concept_type?: string
          concept_id?: string | null
          concept_identifier?: string
          context?: Json
          occurred_at?: string
          session_timestamp_seconds?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "concept_events_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "concept_events_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "lesson_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      conversation_transcripts: {
        Row: {
          id: number
          user_id: string
          conversation_id: string
          target_language: string | null
          transcript: Json | null
          created_at: string
        }
        Insert: {
          id?: number
          user_id: string
          conversation_id: string
          target_language?: string | null
          transcript?: Json | null
          created_at?: string
        }
        Update: {
          id?: number
          user_id?: string
          conversation_id?: string
          target_language?: string | null
          transcript?: Json | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "conversation_transcripts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      languages: {
        Row: {
          code: string
          created_at: string
          id: number
          name: string
        }
        Insert: {
          code: string
          created_at?: string
          id?: number
          name: string
        }
        Update: {
          code?: string
          created_at?: string
          id?: number
          name?: string
        }
        Relationships: []
      }
      grammar_memory: {
        Row: {
          id: string
          user_id: string
          language_code: string
          concept_name: string
          concept_display: string
          category: string | null
          difficulty_tier: number
          prerequisites: string[]
          unlocks: string[]
          explanation: string | null
          example_sentences: Json
          mastery_level: number
          easiness_factor: number
          interval_days: number
          repetitions: number
          next_review_at: string | null
          last_reviewed_at: string | null
          times_practiced: number
          times_correct: number
          times_struggled: number
          error_patterns: Json
          first_introduced_at: string
          introduced_in_session: string | null
          curriculum_lesson_id: number | null
          concept_embedding: number[] | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          language_code: string
          concept_name: string
          concept_display: string
          category?: string | null
          difficulty_tier?: number
          prerequisites?: string[]
          unlocks?: string[]
          explanation?: string | null
          example_sentences?: Json
          mastery_level?: number
          easiness_factor?: number
          interval_days?: number
          repetitions?: number
          next_review_at?: string | null
          last_reviewed_at?: string | null
          times_practiced?: number
          times_correct?: number
          times_struggled?: number
          error_patterns?: Json
          first_introduced_at?: string
          introduced_in_session?: string | null
          curriculum_lesson_id?: number | null
          concept_embedding?: number[] | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          language_code?: string
          concept_name?: string
          concept_display?: string
          category?: string | null
          difficulty_tier?: number
          prerequisites?: string[]
          unlocks?: string[]
          explanation?: string | null
          example_sentences?: Json
          mastery_level?: number
          easiness_factor?: number
          interval_days?: number
          repetitions?: number
          next_review_at?: string | null
          last_reviewed_at?: string | null
          times_practiced?: number
          times_correct?: number
          times_struggled?: number
          error_patterns?: Json
          first_introduced_at?: string
          introduced_in_session?: string | null
          curriculum_lesson_id?: number | null
          concept_embedding?: number[] | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "grammar_memory_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      language_progress: {
        Row: {
          id: string
          user_id: string
          language_code: string
          proficiency_level: string
          proficiency_score: number
          current_lesson_id: number | null
          completed_lesson_ids: number[]
          total_session_count: number
          total_practice_minutes: number
          current_streak_days: number
          longest_streak_days: number
          last_practice_at: string | null
          vocabulary_learned_count: number
          vocabulary_mastered_count: number
          grammar_learned_count: number
          grammar_mastered_count: number
          progress_summary: string | null
          summary_updated_at: string | null
          recommended_focus: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          language_code: string
          proficiency_level?: string
          proficiency_score?: number
          current_lesson_id?: number | null
          completed_lesson_ids?: number[]
          total_session_count?: number
          total_practice_minutes?: number
          current_streak_days?: number
          longest_streak_days?: number
          last_practice_at?: string | null
          vocabulary_learned_count?: number
          vocabulary_mastered_count?: number
          grammar_learned_count?: number
          grammar_mastered_count?: number
          progress_summary?: string | null
          summary_updated_at?: string | null
          recommended_focus?: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          language_code?: string
          proficiency_level?: string
          proficiency_score?: number
          current_lesson_id?: number | null
          completed_lesson_ids?: number[]
          total_session_count?: number
          total_practice_minutes?: number
          current_streak_days?: number
          longest_streak_days?: number
          last_practice_at?: string | null
          vocabulary_learned_count?: number
          vocabulary_mastered_count?: number
          grammar_learned_count?: number
          grammar_mastered_count?: number
          progress_summary?: string | null
          summary_updated_at?: string | null
          recommended_focus?: Json
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "language_progress_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      learner_profile: {
        Row: {
          id: string
          user_id: string
          learning_style: Json
          interests: string[]
          session_preferences: Json
          cross_language_notes: string | null
          learner_summary: string | null
          summary_updated_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          learning_style?: Json
          interests?: string[]
          session_preferences?: Json
          cross_language_notes?: string | null
          learner_summary?: string | null
          summary_updated_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          learning_style?: Json
          interests?: string[]
          session_preferences?: Json
          cross_language_notes?: string | null
          learner_summary?: string | null
          summary_updated_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "learner_profile_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      lesson: {
        Row: {
          created_at: string
          id: number
          subject: number | null
          transcript: string | null
          user: string | null
        }
        Insert: {
          created_at?: string
          id?: number
          subject?: number | null
          transcript?: string | null
          user?: string | null
        }
        Update: {
          created_at?: string
          id?: number
          subject?: number | null
          transcript?: string | null
          user?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "lesson_subject_fkey"
            columns: ["subject"]
            isOneToOne: false
            referencedRelation: "languages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lesson_user_fkey"
            columns: ["user"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      lesson_sessions: {
        Row: {
          id: string
          user_id: string
          language_code: string
          started_at: string
          ended_at: string | null
          duration_seconds: number | null
          curriculum_lesson_id: number | null
          lesson_title: string | null
          lesson_level: string | null
          session_type: string
          vocabulary_introduced: string[]
          vocabulary_reviewed: string[]
          grammar_introduced: string[]
          grammar_reviewed: string[]
          custom_topic: string | null
          performance_metrics: Json
          conversation_id: string | null
          transcript_summary: string | null
          highlights: Json
          next_session_recommendations: Json
          transcript_embedding: number[] | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          language_code: string
          started_at?: string
          ended_at?: string | null
          duration_seconds?: number | null
          curriculum_lesson_id?: number | null
          lesson_title?: string | null
          lesson_level?: string | null
          session_type?: string
          vocabulary_introduced?: string[]
          vocabulary_reviewed?: string[]
          grammar_introduced?: string[]
          grammar_reviewed?: string[]
          custom_topic?: string | null
          performance_metrics?: Json
          conversation_id?: string | null
          transcript_summary?: string | null
          highlights?: Json
          next_session_recommendations?: Json
          transcript_embedding?: number[] | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          language_code?: string
          started_at?: string
          ended_at?: string | null
          duration_seconds?: number | null
          curriculum_lesson_id?: number | null
          lesson_title?: string | null
          lesson_level?: string | null
          session_type?: string
          vocabulary_introduced?: string[]
          vocabulary_reviewed?: string[]
          grammar_introduced?: string[]
          grammar_reviewed?: string[]
          custom_topic?: string | null
          performance_metrics?: Json
          conversation_id?: string | null
          transcript_summary?: string | null
          highlights?: Json
          next_session_recommendations?: Json
          transcript_embedding?: number[] | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "lesson_sessions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      referrals: {
        Row: {
          id: string
          referrer_id: string
          referred_id: string
          referral_code: string
          status: string
          credits_awarded: number
          created_at: string
          completed_at: string | null
        }
        Insert: {
          id?: string
          referrer_id: string
          referred_id: string
          referral_code: string
          status?: string
          credits_awarded?: number
          created_at?: string
          completed_at?: string | null
        }
        Update: {
          id?: string
          referrer_id?: string
          referred_id?: string
          referral_code?: string
          status?: string
          credits_awarded?: number
          created_at?: string
          completed_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "referrals_referrer_id_fkey"
            columns: ["referrer_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "referrals_referred_id_fkey"
            columns: ["referred_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      subscriptions: {
        Row: {
          id: string
          user_id: string
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
          status: string
          price_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          status: string
          price_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          status?: string
          price_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "subscriptions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      usage: {
        Row: {
          id: string
          user_id: string
          usage_count: number
          usage_limit: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          usage_count?: number
          usage_limit?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          usage_count?: number
          usage_limit?: number
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "usage_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      user_learns: {
        Row: {
          id: string
          language_id: number | null
          user_id: string | null
        }
        Insert: {
          id: string
          language_id?: number | null
          user_id?: string | null
        }
        Update: {
          id?: string
          language_id?: number | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_learns_language_id_fkey"
            columns: ["language_id"]
            isOneToOne: false
            referencedRelation: "languages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_learns_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      user_stats: {
        Row: {
          user_id: string
          total_lessons: number
          total_minutes: number
          current_streak: number
          longest_streak: number
          last_lesson_date: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          user_id: string
          total_lessons?: number
          total_minutes?: number
          current_streak?: number
          longest_streak?: number
          last_lesson_date?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          user_id?: string
          total_lessons?: number
          total_minutes?: number
          current_streak?: number
          longest_streak?: number
          last_lesson_date?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_stats_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      users: {
        Row: {
          created_at: string
          credits: number
          date_of_birth: string | null
          first_name: string | null
          id: string
          last_name: string | null
          native_language: string
          referral_code: string | null
          referred_by: string | null
        }
        Insert: {
          created_at?: string
          credits?: number
          date_of_birth?: string | null
          first_name?: string | null
          id: string
          last_name?: string | null
          native_language?: string
          referral_code?: string | null
          referred_by?: string | null
        }
        Update: {
          created_at?: string
          credits?: number
          date_of_birth?: string | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          native_language?: string
          referral_code?: string | null
          referred_by?: string | null
        }
        Relationships: []
      }
      vocabulary_memory: {
        Row: {
          id: string
          user_id: string
          language_code: string
          term: string
          translation: string
          phonetic: string | null
          part_of_speech: string | null
          category: string | null
          example_sentences: Json
          mastery_level: number
          easiness_factor: number
          interval_days: number
          repetitions: number
          next_review_at: string | null
          last_reviewed_at: string | null
          times_seen: number
          times_correct: number
          times_incorrect: number
          common_errors: string[]
          first_introduced_at: string
          introduced_in_session: string | null
          curriculum_lesson_id: number | null
          context_embedding: number[] | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          language_code: string
          term: string
          translation: string
          phonetic?: string | null
          part_of_speech?: string | null
          category?: string | null
          example_sentences?: Json
          mastery_level?: number
          easiness_factor?: number
          interval_days?: number
          repetitions?: number
          next_review_at?: string | null
          last_reviewed_at?: string | null
          times_seen?: number
          times_correct?: number
          times_incorrect?: number
          common_errors?: string[]
          first_introduced_at?: string
          introduced_in_session?: string | null
          curriculum_lesson_id?: number | null
          context_embedding?: number[] | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          language_code?: string
          term?: string
          translation?: string
          phonetic?: string | null
          part_of_speech?: string | null
          category?: string | null
          example_sentences?: Json
          mastery_level?: number
          easiness_factor?: number
          interval_days?: number
          repetitions?: number
          next_review_at?: string | null
          last_reviewed_at?: string | null
          times_seen?: number
          times_correct?: number
          times_incorrect?: number
          common_errors?: string[]
          first_introduced_at?: string
          introduced_in_session?: string | null
          curriculum_lesson_id?: number | null
          context_embedding?: number[] | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "vocabulary_memory_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      user_achievements: {
        Row: {
          id: string
          user_id: string
          achievement_id: string
          unlocked_at: string
          notified: boolean
        }
        Insert: {
          id?: string
          user_id: string
          achievement_id: string
          unlocked_at?: string
          notified?: boolean
        }
        Update: {
          id?: string
          user_id?: string
          achievement_id?: string
          unlocked_at?: string
          notified?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "user_achievements_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      create_lesson_session: {
        Args: {
          p_user_id: string
          p_language_code: string
          p_session_type?: string
          p_curriculum_lesson_id?: number
          p_lesson_title?: string
          p_lesson_level?: string
          p_custom_topic?: string
        }
        Returns: Database["public"]["Tables"]["lesson_sessions"]["Row"]
      }
      end_lesson_session: {
        Args: {
          p_session_id: string
          p_conversation_id?: string
          p_vocabulary_introduced?: string[]
          p_vocabulary_reviewed?: string[]
          p_grammar_introduced?: string[]
          p_grammar_reviewed?: string[]
          p_performance_metrics?: Json
          p_highlights?: Json
          p_transcript_summary?: string
          p_next_session_recommendations?: Json
        }
        Returns: Database["public"]["Tables"]["lesson_sessions"]["Row"]
      }
      generate_referral_code: {
        Args: {
          p_user_id: string
        }
        Returns: string
      }
      get_concept_events: {
        Args: {
          p_user_id: string
          p_language_code: string
          p_concept_type: string
          p_concept_identifier: string
          p_limit?: number
        }
        Returns: Database["public"]["Tables"]["concept_events"]["Row"][]
      }
      get_grammar_due_for_review: {
        Args: {
          p_user_id: string
          p_language_code: string
          p_limit?: number
        }
        Returns: Database["public"]["Tables"]["grammar_memory"]["Row"][]
      }
      get_memory_context: {
        Args: {
          p_user_id: string
          p_language_code: string
        }
        Returns: {
          progress_data: Json
          mastered_vocab_count: number
          mastered_grammar_count: number
          vocab_due_count: number
          grammar_due_count: number
          struggling_vocab_count: number
          struggling_grammar_count: number
          recent_session_count: number
        }[]
      }
      get_or_create_language_progress: {
        Args: {
          p_user_id: string
          p_language_code: string
        }
        Returns: Database["public"]["Tables"]["language_progress"]["Row"]
      }
      get_struggling_grammar: {
        Args: {
          p_user_id: string
          p_language_code: string
          p_limit?: number
        }
        Returns: Database["public"]["Tables"]["grammar_memory"]["Row"][]
      }
      get_struggling_vocabulary: {
        Args: {
          p_user_id: string
          p_language_code: string
          p_limit?: number
        }
        Returns: Database["public"]["Tables"]["vocabulary_memory"]["Row"][]
      }
      get_vocabulary_due_for_review: {
        Args: {
          p_user_id: string
          p_language_code: string
          p_limit?: number
        }
        Returns: Database["public"]["Tables"]["vocabulary_memory"]["Row"][]
      }
      increment_credits: {
        Args: {
          increment_amount: number
        }
        Returns: number
      }
      increment_user_usage: {
        Args: {
          p_user_id: string
          p_increment_by: number
        }
        Returns: { user_id: string; usage_count: number; usage_limit: number }[]
      }
      match_grammar: {
        Args: {
          query_embedding: number[]
          match_user_id: string
          match_language: string
          match_threshold?: number
          match_count?: number
        }
        Returns: {
          id: string
          concept_name: string
          concept_display: string
          category: string
          mastery_level: number
          similarity: number
        }[]
      }
      match_sessions: {
        Args: {
          query_embedding: number[]
          match_user_id: string
          match_language: string
          match_threshold?: number
          match_count?: number
        }
        Returns: {
          id: string
          started_at: string
          lesson_title: string
          transcript_summary: string
          vocabulary_introduced: string[]
          grammar_introduced: string[]
          similarity: number
        }[]
      }
      match_vocabulary: {
        Args: {
          query_embedding: number[]
          match_user_id: string
          match_language: string
          match_threshold?: number
          match_count?: number
        }
        Returns: {
          id: string
          term: string
          translation: string
          category: string
          mastery_level: number
          similarity: number
        }[]
      }
      process_referral: {
        Args: {
          p_referral_code: string
          p_referred_user_id: string
        }
        Returns: Json
      }
      record_concept_event: {
        Args: {
          p_user_id: string
          p_session_id: string
          p_language_code: string
          p_event_type: string
          p_concept_type: string
          p_concept_identifier: string
          p_concept_id?: string
          p_context?: Json
          p_session_timestamp_seconds?: number
        }
        Returns: Database["public"]["Tables"]["concept_events"]["Row"]
      }
      update_grammar_after_practice: {
        Args: {
          p_user_id: string
          p_language_code: string
          p_concept_name: string
          p_quality: number
        }
        Returns: Database["public"]["Tables"]["grammar_memory"]["Row"]
      }
      update_language_progress_after_session: {
        Args: {
          p_user_id: string
          p_language_code: string
          p_session_duration_seconds: number
          p_vocab_introduced?: number
          p_grammar_introduced?: number
        }
        Returns: Database["public"]["Tables"]["language_progress"]["Row"]
      }
      update_user_streak: {
        Args: {
          p_user_id: string
          p_minutes?: number
        }
        Returns: {
          current_streak: number
          longest_streak: number
          total_lessons: number
          total_minutes: number
        }[]
      }
      update_vocabulary_after_review: {
        Args: {
          p_user_id: string
          p_language_code: string
          p_term: string
          p_quality: number
        }
        Returns: Database["public"]["Tables"]["vocabulary_memory"]["Row"]
      }
      upsert_grammar_memory: {
        Args: {
          p_user_id: string
          p_language_code: string
          p_concept_name: string
          p_concept_display: string
          p_category?: string
          p_explanation?: string
          p_difficulty_tier?: number
          p_prerequisites?: string[]
          p_unlocks?: string[]
          p_session_id?: string
          p_lesson_id?: number
        }
        Returns: Database["public"]["Tables"]["grammar_memory"]["Row"]
      }
      upsert_vocabulary_memory: {
        Args: {
          p_user_id: string
          p_language_code: string
          p_term: string
          p_translation: string
          p_category?: string
          p_part_of_speech?: string
          p_phonetic?: string
          p_session_id?: string
          p_lesson_id?: number
        }
        Returns: Database["public"]["Tables"]["vocabulary_memory"]["Row"]
      }
      check_and_unlock_achievements: {
        Args: {
          p_user_id: string
        }
        Returns: Json
      }
      mark_achievement_notified: {
        Args: {
          p_user_id: string
          p_achievement_id: string
        }
        Returns: boolean
      }
      get_unnotified_achievements: {
        Args: {
          p_user_id: string
        }
        Returns: { achievement_id: string; unlocked_at: string }[]
      }
    }
    Enums: {
      [_ in never]: never
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
