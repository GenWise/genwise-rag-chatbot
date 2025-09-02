export interface StudentRecord {
  student_id?: string;
  student_name: string;
  student_age?: string;
  student_gender?: string;
  school_name?: string;
  city?: string;
  grade_level?: string;
  student_category?: string;
  program_name?: string;
  track_chosen?: string;
  courses_selected?: string;
  course_1?: string;
  instructor_1?: string;
  course_2?: string;
  instructor_2?: string;
  course_3?: string;
  instructor_3?: string;
  teaching_assistant?: string;
  weeks_attending?: string;
  parent_name?: string;
  parent_phone_primary?: string;
  parent_email?: string;
  rc_name?: string;
  tshirt_size?: string;
  food_preferences?: string;
  convocation_attending?: string;
  additional_details?: string;
  camp_session_id?: string;
}

export interface ProgramSummary {
  program: string;
  year: string;
  month: string;
  total_students: number;
  tracks: string[];
  courses: string[];
  instructors: string[];
  teaching_assistants: string[];
  schools: string[];
  cities: string[];
  rcs: string[];
}

export interface ChatMessage {
  id: string;
  content: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
  loading?: boolean;
}

export interface SearchResult {
  id: string;
  content: string;
  similarity: number;
  metadata: {
    type: 'program' | 'student';
    program?: string;
    student_name?: string;
    school_name?: string;
  };
}

export interface User {
  email: string;
  isAuthenticated: boolean;
}