// ─────────────────────────────────────────────────────────────────────────────
// services/api/careersApi.js
// South African career data — curated static dataset with helper utilities
// ─────────────────────────────────────────────────────────────────────────────

// ─────────────────────────────────────────────────────────────────────────────
// STATIC CAREERS DATASET
// ─────────────────────────────────────────────────────────────────────────────
const CAREERS = [
  // ── Health Sciences ─────────────────────────────────────────────────────
  {
    id: 1,
    title: 'Medical Doctor (MBChB)',
    category: 'Health Sciences',
    categoryId: 'health',
    aps: 38,
    duration: '6 years',
    salary: 'R600k–R1.5M/yr',
    image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&q=80',
    outlook: 'Critical shortage of doctors in South Africa. Excellent prospects in both public and private sectors.',
    description:
      'Medicine is one of the most prestigious and demanding degrees in SA. Graduates serve communities across all sectors of health care.',
    subjects: ['Mathematics', 'Physical Sciences', 'Life Sciences', 'English Home Language'],
    universities: ['UCT', 'Wits', 'UP', 'UKZN', 'SU', 'UFS', 'WSU'],
  },
  {
    id: 2,
    title: 'Dentistry (BDS)',
    category: 'Health Sciences',
    categoryId: 'health',
    aps: 36,
    duration: '5 years',
    salary: 'R500k–R1.2M/yr',
    image: 'https://images.unsplash.com/photo-1606811971618-4486d14f3f99?w=800&q=80',
    outlook: 'Strong private sector demand. Growing need in rural and underserved areas.',
    description:
      'Dentistry graduates are in high demand across private practice and public oral health services.',
    subjects: ['Mathematics', 'Physical Sciences', 'Life Sciences', 'English Home Language'],
    universities: ['Wits', 'UP', 'UWC', 'UKZN', 'SU'],
  },
  {
    id: 3,
    title: 'Pharmacy (BPharm)',
    category: 'Health Sciences',
    categoryId: 'health',
    aps: 34,
    duration: '4 years',
    salary: 'R350k–R700k/yr',
    image: 'https://images.unsplash.com/photo-1576602976047-174e57a47881?w=800&q=80',
    outlook: 'Retail and hospital pharmacy are growing sectors with consistent demand.',
    description:
      'Pharmacists play a vital role in patient care, dispensing medicines and advising on treatments.',
    subjects: ['Mathematics', 'Physical Sciences', 'Life Sciences'],
    universities: ['NWU', 'UWC', 'Rhodes', 'Wits', 'UP', 'UKZN'],
  },
  {
    id: 4,
    title: 'Nursing Science (BCur)',
    category: 'Health Sciences',
    categoryId: 'health',
    aps: 28,
    duration: '4 years',
    salary: 'R180k–R450k/yr',
    image: 'https://images.unsplash.com/photo-1559757175-5700dde675bc?w=800&q=80',
    outlook: 'Extremely high demand in SA public health system. Major shortages expected.',
    description:
      'Nurses are the backbone of the South African healthcare system and are always in high demand.',
    subjects: ['Life Sciences', 'Mathematics or Maths Literacy', 'English Home Language'],
    universities: ['UP', 'UKZN', 'UFS', 'UL', 'NMU', 'SU'],
  },

  // ── Engineering ─────────────────────────────────────────────────────────
  {
    id: 5,
    title: 'Civil Engineering (BEng)',
    category: 'Engineering',
    categoryId: 'engineering',
    aps: 35,
    duration: '4 years',
    salary: 'R450k–R900k/yr',
    image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&q=80',
    outlook: 'SA infrastructure backlog creates massive long-term demand for civil engineers.',
    description:
      'Civil engineers design and oversee construction of roads, bridges, dams, and buildings across South Africa.',
    subjects: ['Mathematics', 'Physical Sciences', 'English Home Language'],
    universities: ['UCT', 'Wits', 'UP', 'SU', 'UKZN', 'TUT', 'CPUT'],
  },
  {
    id: 6,
    title: 'Electrical Engineering (BEng)',
    category: 'Engineering',
    categoryId: 'engineering',
    aps: 35,
    duration: '4 years',
    salary: 'R480k–R950k/yr',
    image: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=800&q=80',
    outlook: 'Renewable energy boom driving unprecedented demand for electrical engineers in SA.',
    description:
      'Electrical engineers are critical to SA\'s energy sector, from Eskom infrastructure to new solar and wind projects.',
    subjects: ['Mathematics', 'Physical Sciences'],
    universities: ['UCT', 'Wits', 'UP', 'SU', 'UJ', 'UKZN', 'TUT'],
  },
  {
    id: 7,
    title: 'Mechanical Engineering (BEng)',
    category: 'Engineering',
    categoryId: 'engineering',
    aps: 35,
    duration: '4 years',
    salary: 'R460k–R900k/yr',
    image: 'https://images.unsplash.com/photo-1537462715879-360eeb61a0ad?w=800&q=80',
    outlook: 'Manufacturing and mining sectors sustain strong mechanical engineering demand.',
    description:
      'Mechanical engineers work across automotive, mining, manufacturing, and energy sectors.',
    subjects: ['Mathematics', 'Physical Sciences'],
    universities: ['UCT', 'Wits', 'UP', 'SU', 'UJ', 'NMU'],
  },
  {
    id: 8,
    title: 'Mining Engineering (BEng)',
    category: 'Engineering',
    categoryId: 'engineering',
    aps: 34,
    duration: '4 years',
    salary: 'R500k–R1.1M/yr',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',
    outlook: 'SA\'s rich mineral deposits ensure sustained demand. Top-paying engineering field.',
    description:
      'Mining engineers plan and oversee extraction of minerals from South Africa\'s vast natural resources.',
    subjects: ['Mathematics', 'Physical Sciences'],
    universities: ['Wits', 'UP', 'UCT', 'NWU'],
  },

  // ── IT & Technology ──────────────────────────────────────────────────────
  {
    id: 9,
    title: 'Computer Science (BSc)',
    category: 'IT & Tech',
    categoryId: 'it',
    aps: 32,
    duration: '3 years',
    salary: 'R380k–R850k/yr',
    image: 'https://images.unsplash.com/photo-1517180102446-f3ece451e9d8?w=800&q=80',
    outlook: 'Tech sector in SA is booming. Remote work opens global opportunities for SA developers.',
    description:
      'Computer scientists are among the most sought-after graduates in SA\'s growing digital economy.',
    subjects: ['Mathematics', 'English Home Language'],
    universities: ['UCT', 'Wits', 'UP', 'SU', 'Rhodes', 'UJ'],
  },
  {
    id: 10,
    title: 'Software Engineering (BEng)',
    category: 'IT & Tech',
    categoryId: 'it',
    aps: 34,
    duration: '4 years',
    salary: 'R420k–R950k/yr',
    image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&q=80',
    outlook: 'Highest-growth tech career in SA. Strong demand from fintech, healthtech, and e-commerce.',
    description:
      'Software engineers build the digital products and platforms powering modern South African businesses.',
    subjects: ['Mathematics', 'Physical Sciences'],
    universities: ['UP', 'SU', 'Wits', 'UJ', 'TUT'],
  },
  {
    id: 11,
    title: 'Information Technology (BSc IT)',
    category: 'IT & Tech',
    categoryId: 'it',
    aps: 28,
    duration: '3 years',
    salary: 'R280k–R650k/yr',
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=80',
    outlook: 'Every industry needs IT professionals. Versatile career with wide sector applicability.',
    description:
      'IT graduates work in networking, system administration, cybersecurity, and support roles.',
    subjects: ['Mathematics', 'English Home Language'],
    universities: ['UP', 'TUT', 'CPUT', 'UJ', 'NWU', 'NMU'],
  },
  {
    id: 12,
    title: 'Cybersecurity (BSc)',
    category: 'IT & Tech',
    categoryId: 'it',
    aps: 30,
    duration: '3 years',
    salary: 'R400k–R900k/yr',
    image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&q=80',
    outlook: 'One of the fastest growing fields globally. SA banks and government urgently need security professionals.',
    description:
      'Cybersecurity specialists protect organisations from digital threats, breaches, and attacks.',
    subjects: ['Mathematics', 'English Home Language'],
    universities: ['UP', 'UCT', 'Wits', 'UJ'],
  },

  // ── Commerce ────────────────────────────────────────────────────────────
  {
    id: 13,
    title: 'Chartered Accountancy (BCom + CTA)',
    category: 'Commerce',
    categoryId: 'commerce',
    aps: 34,
    duration: '5–6 years',
    salary: 'R500k–R1.2M/yr',
    image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&q=80',
    outlook: 'CA(SA) is the gold standard finance qualification. Extremely high earning potential.',
    description:
      'Chartered Accountants are the backbone of South African finance, auditing, and corporate governance.',
    subjects: ['Mathematics', 'Accounting', 'English Home Language'],
    universities: ['UCT', 'Wits', 'UP', 'SU', 'UFS', 'UKZN'],
  },
  {
    id: 14,
    title: 'Finance (BCom)',
    category: 'Commerce',
    categoryId: 'commerce',
    aps: 30,
    duration: '3 years',
    salary: 'R280k–R700k/yr',
    image: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&q=80',
    outlook: 'JSE, banking sector, and investment firms create strong demand for finance graduates.',
    description:
      'Finance graduates work in banking, asset management, and corporate treasury across South Africa.',
    subjects: ['Mathematics', 'Accounting', 'Economics'],
    universities: ['UCT', 'Wits', 'UP', 'SU', 'UJ', 'NMU'],
  },
  {
    id: 15,
    title: 'Marketing Management (BCom)',
    category: 'Commerce',
    categoryId: 'commerce',
    aps: 28,
    duration: '3 years',
    salary: 'R200k–R550k/yr',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80',
    outlook: 'Digital marketing is exploding. Brands across SA are hunting for skilled marketers.',
    description:
      'Marketing graduates drive brand strategy, digital campaigns, and customer engagement for organisations.',
    subjects: ['English Home Language', 'Business Studies', 'Mathematics'],
    universities: ['CPUT', 'UJ', 'UP', 'TUT', 'NWU', 'NMU'],
  },

  // ── Law ─────────────────────────────────────────────────────────────────
  {
    id: 16,
    title: 'Law (LLB)',
    category: 'Law',
    categoryId: 'law',
    aps: 34,
    duration: '4 years',
    salary: 'R350k–R1.5M/yr',
    image: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=800&q=80',
    outlook: 'Commercial law and human rights law are booming. Top firms offer exceptional packages.',
    description:
      'Lawyers serve as advocates, attorneys, and legal advisors across SA\'s diverse legal landscape.',
    subjects: ['English Home Language', 'History', 'Mathematics or Maths Literacy'],
    universities: ['UCT', 'Wits', 'UP', 'SU', 'UFS', 'UKZN', 'NWU', 'Rhodes'],
  },

  // ── Education ───────────────────────────────────────────────────────────
  {
    id: 17,
    title: 'Teaching (BEd)',
    category: 'Education',
    categoryId: 'education',
    aps: 26,
    duration: '4 years',
    salary: 'R180k–R420k/yr',
    image: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800&q=80',
    outlook: 'STEM teachers are critically scarce in SA. Bursaries widely available.',
    description:
      'Teachers shape the next generation of South Africans. SACE registration required to teach.',
    subjects: ['English Home Language', 'Any 2 major subjects'],
    universities: ['UP', 'SU', 'UCT', 'UFS', 'UKZN', 'NWU', 'UJ'],
  },

  // ── Pure Sciences ───────────────────────────────────────────────────────
  {
    id: 18,
    title: 'Actuarial Science (BSc)',
    category: 'Pure Sciences',
    categoryId: 'science',
    aps: 38,
    duration: '3–4 years',
    salary: 'R500k–R1.3M/yr',
    image: 'https://images.unsplash.com/photo-1543286386-713bdd548da4?w=800&q=80',
    outlook: 'Actuaries are among the highest-paid professionals in SA. Severe shortage of qualifiers.',
    description:
      'Actuaries use maths and statistics to assess risk for insurance, banking, and pension funds.',
    subjects: ['Mathematics', 'Physical Sciences or Accounting'],
    universities: ['UCT', 'Wits', 'UP', 'SU', 'UFS'],
  },
  {
    id: 19,
    title: 'Data Science (BSc)',
    category: 'Pure Sciences',
    categoryId: 'science',
    aps: 32,
    duration: '3 years',
    salary: 'R420k–R900k/yr',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80',
    outlook: 'Data science is the most in-demand skill in SA\'s tech economy. Remote-friendly.',
    description:
      'Data scientists extract insights from large datasets to drive business decisions and AI products.',
    subjects: ['Mathematics', 'Physical Sciences'],
    universities: ['UCT', 'Wits', 'UP', 'SU', 'UJ'],
  },

  // ── Creative Arts ───────────────────────────────────────────────────────
  {
    id: 20,
    title: 'Architecture (BArch)',
    category: 'Creative Arts',
    categoryId: 'arts',
    aps: 32,
    duration: '5 years',
    salary: 'R300k–R700k/yr',
    image: 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=800&q=80',
    outlook: 'Urban development and housing projects fuel steady demand for architects in SA.',
    description:
      'Architects design buildings and spaces that shape South Africa\'s cities and communities.',
    subjects: ['Mathematics', 'English Home Language', 'Physical Sciences or Art'],
    universities: ['UCT', 'Wits', 'UP', 'UJ', 'NMU'],
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// PRIVATE HELPERS
// ─────────────────────────────────────────────────────────────────────────────

let _cache = null;

// ─────────────────────────────────────────────────────────────────────────────
// PUBLIC API
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Fetch all careers.
 * @returns {Promise<Career[]>}
 */
export const fetchCareers = async () => {
  // Simulate async for API-readiness (swap body with real fetch when backend exists)
  if (_cache) return _cache;
  await Promise.resolve(); // keeps callers consistently async
  _cache = CAREERS;
  return _cache;
};

/**
 * Fetch a single career by ID.
 * @param {number} id
 * @returns {Promise<Career|null>}
 */
export const fetchCareerById = async (id) => {
  const all = await fetchCareers();
  return all.find(c => c.id === id) ?? null;
};

/**
 * Fetch careers filtered by category ID.
 * @param {string} categoryId  e.g. "health", "engineering", "it"
 * @returns {Promise<Career[]>}
 */
export const fetchCareersByCategory = async (categoryId) => {
  const all = await fetchCareers();
  if (!categoryId || categoryId === 'all') return all;
  return all.filter(c => c.categoryId === categoryId);
};

/**
 * Search careers by title, category, subject, or university.
 * @param {string} query
 * @returns {Promise<Career[]>}
 */
export const searchCareers = async (query = '') => {
  const all = await fetchCareers();
  if (!query.trim()) return all;
  const q = query.toLowerCase();
  return all.filter(
    c =>
      c.title.toLowerCase().includes(q) ||
      c.category.toLowerCase().includes(q) ||
      c.subjects.some(s => s.toLowerCase().includes(q)) ||
      c.universities.some(u => u.toLowerCase().includes(q))
  );
};

/**
 * Fetch careers that match a given APS score.
 * Returns careers the student qualifies for (career.aps <= studentAps).
 * @param {number} studentAps
 * @returns {Promise<Career[]>}
 */
export const fetchCareersByAPS = async (studentAps) => {
  const all = await fetchCareers();
  return all
    .filter(c => c.aps <= studentAps)
    .sort((a, b) => b.aps - a.aps); // highest required APS first
};

/**
 * Get all distinct career categories from the dataset.
 * @returns {Promise<string[]>}
 */
export const fetchCareerCategories = async () => {
  const all = await fetchCareers();
  return [...new Set(all.map(c => c.category))].sort();
};

/**
 * Invalidate the in-memory cache.
 */
export const clearCareersCache = () => {
  _cache = null;
};