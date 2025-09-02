/**
 * GenWise Terminology Mapping
 * 
 * This file contains mappings for domain-specific terms, abbreviations, and variations
 * used in GenWise programs. Edit this file to add more mappings as needed.
 * 
 * MAPPING STRATEGY:
 * 1. Focus on unique identifiers (school names, not generic terms)
 * 2. Group schools by network/franchise (JNV, VIBGYOR, etc.)
 * 3. Handle common abbreviations (PSBB, AVM, DPS)
 * 4. Include location variations for multi-branch schools
 * 5. Account for misspellings and case variations
 * 
 * EXAMPLES:
 * - "jnv" maps to all JNV schools across locations
 * - "psbb" maps to full "Padma Seshadri Bala Bhavan" name
 * - "vibgyor" maps to all VIBGYOR campuses
 * 
 * TO ADD NEW MAPPINGS:
 * 1. Identify the unique part of school name
 * 2. List all variations found in data
 * 3. Group by network if applicable
 * 4. Add common abbreviations/misspellings
 */

// Staff and Role Abbreviations
export const staffRoleMapping: Record<string, string> = {
  'rc': 'RC Residential Counselor residential counselor',
  'rcs': 'RCs Residential Counselors residential counselors',
  'residential counselor': 'RC Residential Counselor residential counselor',
  'residential counselors': 'RCs Residential Counselors residential counselors',
  'ta': 'TA Teaching Assistant teaching assistant',
  'tas': 'TAs Teaching Assistants teaching assistants',
  'teaching assistant': 'TA Teaching Assistant teaching assistant',
  'teaching assistants': 'TAs Teaching Assistants teaching assistants',
};

// School Name Variations and Abbreviations
// Focus on unique identifiers and actual school groups/variations from the data
export const schoolNameMapping: Record<string, string> = {
  // JNV Network - Jawahar Navodaya Vidyalaya (School Group)
  'jnv': 'JNV Jawahar Navodaya Vidyalaya JNV Chandrapur JNV Mandya JNV Udupi JNV Bengaluru Urban JNV South Canara JNV - Jawahar Navodaya Vidyalaya JNV - Mandya JNV - Udupi JNV - Pm Shri Jawahar Navodaya Vidyalaya Chandrapur',
  'navodaya': 'Jawahar Navodaya Vidyalaya JNV JNV Chandrapur JNV Mandya JNV Udupi JNV Bengaluru Urban JNV South Canara',
  'jawahar navodaya': 'Jawahar Navodaya Vidyalaya JNV JNV - Jawahar Navodaya Vidyalaya JNV - Pm Shri Jawahar Navodaya Vidyalaya Chandrapur',

  // VIBGYOR Network (School Group)
  'vibgyor': 'VIBGYOR High School VIBGYOR Rise VIBGYOR With GOLDEN BEE Vibgyor High Vibgyor High School VIBGYOR Horamavu Mumbai Vibgyor High',
  
  // Sri Kumaran Network (School Group with variations)
  'sri kumaran': 'Sri Kumaran Public School ICSE Sri Kumaran Children Home CBSE Sri Kumarans Children Home Educational Counsil',
  'kumarans': 'Sri Kumarans Children Home Educational Counsil Sri Kumaran Public School ICSE Sri Kumaran Children Home CBSE',
  'sri kumarans': 'Sri Kumarans Children Home Educational Counsil Sri Kumaran',

  // TVS Network (School Group)
  'tvs': 'TVS ACADEMY TVS Academy',
  'tvs academy': 'TVS Academy TVS ACADEMY',

  // SNS Network (School Group)
  'sns': 'SNS Noida SNS Faridabad',

  // Padma Seshadri (PSBB) - Known by abbreviation
  'psbb': 'Padma Seshadri Bala Bhavan Senior Secondary School PSBB',
  'padma seshadri': 'Padma Seshadri Bala Bhavan Senior Secondary School PSBB',
  'bala bhavan': 'Padma Seshadri Bala Bhavan Senior Secondary School',

  // Greenwood Network (School Group with locations)
  'greenwood': 'Greenwood High International School Greenwood High Bannerghatta',

  // HDFC School Network
  'hdfc school': 'The HDFC School',

  // Delhi Public School Network (DPS)
  'dps': 'DPS Delhi Public School Delhi Public School International Delhi Public School Nacharam',
  'delhi public': 'Delhi Public School DPS Delhi Public School International Delhi Public School Nacharam',

  // Arya Vidya Mandir Network (AVM)
  'arya vidya mandir': 'Arya Vidya Mandir Bandra West Smt. Ramdevi Sobhraj Bajaj Arya Vidya Mandir',
  'avm': 'Arya Vidya Mandir AVM Bandra West',

  // Shri Ram Network
  'shri ram': 'The Shri Ram School The Shishukunj International School',
  'sri ram': 'The Shri Ram School',

  // Single school mappings with unique identifiers
  'inventure': 'Inventure Academy',
  'fravashi': 'Fravashi International Academy',
  'akshar arbol': 'Akshar Arbol International School',
  'manthan': 'Manthan School',
  'vidya valley': 'Vidya Valley',
  'vidyagyan': 'VidyaGyan',
  'sanskriti': 'Sanskriti The Gurukul',
  'orchids': 'ORCHIDS The International School Orchids The International School',
  'euroschool': 'EuroSchool Whitefield',
  'deens academy': 'Deens Academy -Whitefield',
  'presidency school': 'Presidency School',
  'symbiosis': 'Symbiosis',
  'zydus': 'Zydus School for Excellence',
  'gaudium': 'The Gaudium School',
  'samhita': 'The Samhita Academy',
  'heritage school': 'The Heritage School Heritage Xperiential Learning School',
  'aurinko': 'Aurinko Academy',

  // Common misspellings and variations
  'kumaraan': 'Sri Kumaran Sri Kumarans',
  'counsil': 'Council Educational Counsil',
  'bandra west': 'Bandra West',
};

// Program and Course Terminology
export const programTerminology: Record<string, string> = {
  'gsp': 'GSP GenWise Summer Program summer program',
  'genwise summer program': 'GSP GenWise Summer Program summer program',
  'summer program': 'GSP GenWise Summer Program summer program',
  'explorers': 'Explorers Track explorer',
  'wizards': 'Wizards Track wizard',
  'ats': 'ATS Aptitude Test Score aptitude test',
  'aptitude test': 'ATS Aptitude Test Score aptitude test',
};

// Student Categories and Scholarship Terms
export const categoryTerminology: Record<string, string> = {
  'full scholarship': 'Full Gold Scholarship sponsored student full scholarship',
  'partial scholarship': 'Partial Gold Scholarship partial scholarship',
  'sponsored': 'sponsored student Full Gold Scholarship Partial Gold Scholarship scholarship',
  'gold scholarship': 'Gold Scholarship Full Gold Scholarship Partial Gold Scholarship',
  'returning': 'Returning Student returning student repeat student',
  'ats student': 'ATS Student ATS 2024 aptitude test student',
};

// City and Location Variations
export const locationMapping: Record<string, string> = {
  'bangalore': 'Bangalore Bengaluru Karnataka',
  'bengaluru': 'Bangalore Bengaluru Karnataka',
  'ahmedabad': 'Ahmedabad Gujarat',
  'mumbai': 'Mumbai Maharashtra Bombay',
  'delhi': 'Delhi New Delhi NCR',
  'chennai': 'Chennai Tamil Nadu Madras',
  'hyderabad': 'Hyderabad Telangana',
  'pune': 'Pune Maharashtra',
  'kolkata': 'Kolkata West Bengal Calcutta',
};

// Combine all mappings for easy access
export const allTerminologyMappings = {
  ...staffRoleMapping,
  ...schoolNameMapping,
  ...programTerminology,
  ...categoryTerminology,
  ...locationMapping,
};

/**
 * Get expanded terms for a given query
 * @param query - The original query string
 * @returns Expanded query with all relevant variations
 */
export function expandQueryTerms(query: string): string {
  let processedQuery = query.toLowerCase();

  Object.entries(allTerminologyMappings).forEach(([key, expansion]) => {
    if (processedQuery.includes(key)) {
      processedQuery += ` ${expansion}`;
    }
  });

  return processedQuery;
}

/**
 * Add new terminology mapping
 * Use this function to programmatically add new mappings
 */
export function addTerminologyMapping(category: 'staff' | 'school' | 'program' | 'category' | 'location', key: string, expansion: string) {
  const targetMapping = {
    staff: staffRoleMapping,
    school: schoolNameMapping,
    program: programTerminology,
    category: categoryTerminology,
    location: locationMapping,
  }[category];

  if (targetMapping) {
    targetMapping[key] = expansion;
    // Also update the combined mapping
    allTerminologyMappings[key] = expansion;
  }
}