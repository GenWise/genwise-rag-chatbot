import { spreadsheetData } from '../data/sourceData';
import type { StudentRecord, ProgramSummary } from '../types';
import { parseCSVLine, normalizeSchoolName, extractYear, extractMonth } from './utils';

export class DataProcessor {
  private parsedData: Map<string, StudentRecord[]> = new Map();
  private programSummaries: Map<string, ProgramSummary> = new Map();

  constructor() {
    this.processRawData();
  }

  private processRawData(): void {
    const sections = this.extractCSVSections();
    
    for (const [filename, csvContent] of sections) {
      const records = this.parseCSVContent(csvContent);
      this.parsedData.set(filename, records);
      
      // Create program summary
      const summary = this.createProgramSummary(filename, records);
      this.programSummaries.set(filename, summary);
    }
  }

  private extractCSVSections(): Map<string, string> {
    const sections = new Map<string, string>();
    const lines = spreadsheetData.split('\n');
    
    let currentFile = '';
    let currentContent: string[] = [];
    let inSection = false;
    
    for (const line of lines) {
      if (line.startsWith('--- START OF FILE:')) {
        currentFile = line.match(/START OF FILE: (.+) ---/)?.[1] || '';
        currentContent = [];
        inSection = true;
      } else if (line.startsWith('--- END OF FILE:')) {
        if (currentFile && currentContent.length > 0) {
          sections.set(currentFile, currentContent.join('\n'));
        }
        inSection = false;
      } else if (inSection && line.trim()) {
        currentContent.push(line);
      }
    }
    
    return sections;
  }

  private parseCSVContent(csvContent: string): StudentRecord[] {
    const lines = csvContent.split('\n').filter(line => line.trim());
    if (lines.length < 2) return [];
    
    const headers = parseCSVLine(lines[0]);
    const records: StudentRecord[] = [];
    
    for (let i = 1; i < lines.length; i++) {
      const values = parseCSVLine(lines[i]);
      const record: any = {};
      
      headers.forEach((header, index) => {
        const normalizedHeader = header.toLowerCase().replace(/\s+/g, '_');
        record[normalizedHeader] = values[index] || '';
      });
      
      // Only add records with student names
      if (record.student_name && record.student_name.trim()) {
        records.push(record as StudentRecord);
      }
    }
    
    return records;
  }

  private createProgramSummary(filename: string, records: StudentRecord[]): ProgramSummary {
    const year = extractYear(filename) || '2025';
    const month = extractMonth(filename) || 'may';
    
    const tracks = new Set<string>();
    const courses = new Set<string>();
    const instructors = new Set<string>();
    const teachingAssistants = new Set<string>();
    const schools = new Set<string>();
    const cities = new Set<string>();
    const rcs = new Set<string>();
    
    records.forEach(record => {
      if (record.track_chosen) tracks.add(record.track_chosen);
      if (record.course_1) courses.add(record.course_1);
      if (record.course_2) courses.add(record.course_2);
      if (record.course_3) courses.add(record.course_3);
      if (record.instructor_1) instructors.add(record.instructor_1);
      if (record.instructor_2) instructors.add(record.instructor_2);
      if (record.instructor_3) instructors.add(record.instructor_3);
      if (record.teaching_assistant) teachingAssistants.add(record.teaching_assistant);
      if (record.school_name) schools.add(record.school_name);
      if (record.city) cities.add(record.city);
      if (record.rc_name) rcs.add(record.rc_name);
    });
    
    return {
      program: filename,
      year,
      month,
      total_students: records.length,
      tracks: Array.from(tracks).filter(Boolean),
      courses: Array.from(courses).filter(Boolean),
      instructors: Array.from(instructors).filter(Boolean),
      teaching_assistants: Array.from(teachingAssistants).filter(Boolean),
      schools: Array.from(schools).filter(Boolean),
      cities: Array.from(cities).filter(Boolean),
      rcs: Array.from(rcs).filter(Boolean),
    };
  }

  public getAllRecords(): StudentRecord[] {
    const allRecords: StudentRecord[] = [];
    for (const records of this.parsedData.values()) {
      allRecords.push(...records);
    }
    return allRecords;
  }

  public getRecordsByProgram(program: string): StudentRecord[] {
    return this.parsedData.get(program) || [];
  }

  public getProgramSummary(program: string): ProgramSummary | undefined {
    return this.programSummaries.get(program);
  }

  public getAllProgramSummaries(): ProgramSummary[] {
    return Array.from(this.programSummaries.values());
  }

  public searchRecords(query: string): StudentRecord[] {
    const normalizedQuery = query.toLowerCase();
    const allRecords = this.getAllRecords();
    
    return allRecords.filter(record => {
      return (
        record.student_name?.toLowerCase().includes(normalizedQuery) ||
        record.school_name?.toLowerCase().includes(normalizedQuery) ||
        record.city?.toLowerCase().includes(normalizedQuery) ||
        record.track_chosen?.toLowerCase().includes(normalizedQuery) ||
        record.course_1?.toLowerCase().includes(normalizedQuery) ||
        record.instructor_1?.toLowerCase().includes(normalizedQuery) ||
        record.rc_name?.toLowerCase().includes(normalizedQuery)
      );
    });
  }

  public generateChunksForEmbedding(): Array<{ id: string; content: string; metadata: any }> {
    const chunks = [];
    
    // Program-level chunks
    for (const [filename, summary] of this.programSummaries) {
      const programContent = this.createProgramChunkContent(summary);
      chunks.push({
        id: `program_${filename}`,
        content: programContent,
        metadata: {
          type: 'program',
          program: filename,
          year: summary.year,
          month: summary.month,
        },
      });
    }
    
    // Student-level chunks
    for (const [filename, records] of this.parsedData) {
      records.forEach((record, index) => {
        const studentContent = this.createStudentChunkContent(record, filename);
        chunks.push({
          id: `student_${filename}_${index}`,
          content: studentContent,
          metadata: {
            type: 'student',
            program: filename,
            student_name: record.student_name,
            school_name: record.school_name,
            normalized_school: normalizeSchoolName(record.school_name || ''),
          },
        });
      });
    }
    
    return chunks;
  }

  private createProgramChunkContent(summary: ProgramSummary): string {
    return `
Program: ${summary.program}
Year: ${summary.year}
Month: ${summary.month}
Total Students: ${summary.total_students}
Tracks: ${summary.tracks.join(', ')}
Courses: ${summary.courses.join(', ')}
Instructors: ${summary.instructors.join(', ')}
Teaching Assistants: ${summary.teaching_assistants.join(', ')}
Schools: ${summary.schools.join(', ')}
Cities: ${summary.cities.join(', ')}
RCs (Residential Counselors): ${summary.rcs.join(', ')}
Residential Counselors: ${summary.rcs.join(', ')}
    `.trim();
  }

  private createStudentChunkContent(record: StudentRecord, program: string): string {
    return `
Program: ${program}
Student: ${record.student_name}
Age: ${record.student_age}
Gender: ${record.student_gender}
School: ${record.school_name}
City: ${record.city}
Grade: ${record.grade_level}
Category: ${record.student_category}
Track: ${record.track_chosen}
Course 1: ${record.course_1} (Instructor: ${record.instructor_1})
Course 2: ${record.course_2} (Instructor: ${record.instructor_2})
Course 3: ${record.course_3} (Instructor: ${record.instructor_3})
Teaching Assistant: ${record.teaching_assistant}
Parent: ${record.parent_name}
RC (Residential Counselor): ${record.rc_name}
Residential Counselor: ${record.rc_name}
T-shirt Size: ${record.tshirt_size}
Food Preferences: ${record.food_preferences}
Convocation: ${record.convocation_attending}
    `.trim();
  }
}

// Singleton instance
export const dataProcessor = new DataProcessor();