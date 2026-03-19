/** Supabase DB 테이블 타입 정의 */

export interface Database {
  public: {
    Tables: {
      scenarios: {
        Row: {
          id: string;
          title: string;
          status: 'draft' | 'revision' | 'production' | 'complete';
          law_basis: string | null;
          effective_date: string | null;
          video_duration: number | null;
          script_content: string | null;
          scene_data: SceneData[] | null;
          pdf_path: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          status?: 'draft' | 'revision' | 'production' | 'complete';
          law_basis?: string | null;
          effective_date?: string | null;
          video_duration?: number | null;
          script_content?: string | null;
          scene_data?: SceneData[] | null;
          pdf_path?: string | null;
        };
        Update: {
          id?: string;
          title?: string;
          status?: 'draft' | 'revision' | 'production' | 'complete';
          law_basis?: string | null;
          effective_date?: string | null;
          video_duration?: number | null;
          script_content?: string | null;
          scene_data?: SceneData[] | null;
          pdf_path?: string | null;
        };
        Relationships: [];
      };
      trees: {
        Row: {
          id: string;
          slug: string;
          name: string;
          description: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          slug: string;
          name: string;
          description?: string | null;
        };
        Update: {
          id?: string;
          slug?: string;
          name?: string;
          description?: string | null;
        };
        Relationships: [];
      };
      tree_nodes: {
        Row: {
          id: string;
          tree_id: string;
          parent_id: string | null;
          label: string;
          sort_order: number;
          scenario_id: string | null;
          depth: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          tree_id: string;
          parent_id?: string | null;
          label: string;
          sort_order?: number;
          scenario_id?: string | null;
          depth?: number;
        };
        Update: {
          id?: string;
          tree_id?: string;
          parent_id?: string | null;
          label?: string;
          sort_order?: number;
          scenario_id?: string | null;
          depth?: number;
        };
        Relationships: [
          {
            foreignKeyName: 'tree_nodes_tree_id_fkey';
            columns: ['tree_id'];
            isOneToOne: false;
            referencedRelation: 'trees';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'tree_nodes_scenario_id_fkey';
            columns: ['scenario_id'];
            isOneToOne: false;
            referencedRelation: 'scenarios';
            referencedColumns: ['id'];
          }
        ];
      };
      scenario_revisions: {
        Row: {
          id: string;
          scenario_id: string;
          field: string;
          old_value: string | null;
          new_value: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          scenario_id: string;
          field: string;
          old_value?: string | null;
          new_value?: string | null;
        };
        Update: {
          id?: string;
          scenario_id?: string;
          field?: string;
          old_value?: string | null;
          new_value?: string | null;
        };
        Relationships: [];
      };
      storyboards: {
        Row: {
          id: string;
          scenario_id: string;
          uploader_name: string;
          file_path: string;
          file_type: 'image' | 'pdf';
          description: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          scenario_id: string;
          uploader_name: string;
          file_path: string;
          file_type: 'image' | 'pdf';
          description?: string | null;
        };
        Update: {
          id?: string;
          scenario_id?: string;
          uploader_name?: string;
          file_path?: string;
          file_type?: 'image' | 'pdf';
          description?: string | null;
        };
        Relationships: [];
      };
    };
    Views: {};
    Functions: {};
  };
}

/** 장면 데이터 JSON 구조 */
export interface SceneData {
  scene_number: number;
  title: string;
  visual: string;
  narration: string;
  text_overlay?: string;
  duration?: number;
}
