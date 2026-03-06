// ────────────────────────────────────────────────────────────────
// services/api/saUniversitiesStatic.js
// Curated South African universities — pre-populated with logos & images
// ────────────────────────────────────────────────────────────────

const SA_UNIVERSITIES = [
  {
    id: 1,
    name: 'University of Cape Town',
    shortName: 'UCT',
    location: 'Cape Town, Western Cape',
    province: 'Western Cape',
    type: 'Public',
    ranking: 1,
    students: '29k+',
    website: 'https://www.uct.ac.za',
    logo: 'https://logo.clearbit.com/uct.ac.za',
    image: 'https://images.unsplash.com/photo-1580537659466-0a9bfa916a54?w=800&q=80',
    about:
      'UCT is the oldest university in South Africa and consistently ranked as the top university on the African continent.',
    programs: [
      'Medicine', 'Law', 'Engineering', 'Commerce', 'Humanities',
      'Science', 'Health Sciences', 'Architecture',
    ],
  },
  {
    id: 2,
    name: 'University of the Witwatersrand',
    shortName: 'Wits',
    location: 'Johannesburg, Gauteng',
    province: 'Gauteng',
    type: 'Public',
    ranking: 2,
    students: '40k+',
    website: 'https://www.wits.ac.za',
    logo: 'https://logo.clearbit.com/wits.ac.za',
    image: 'https://images.unsplash.com/photo-1562774053-701939374585?w=800&q=80',
    about:
      'Wits is a leading African research university with a strong reputation in mining engineering, medicine, and the arts.',
    programs: [
      'Medicine', 'Engineering', 'Law', 'Commerce', 'Science',
      'Humanities', 'Education', 'Architecture',
    ],
  },
  {
    id: 3,
    name: 'Stellenbosch University',
    shortName: 'SU',
    location: 'Stellenbosch, Western Cape',
    province: 'Western Cape',
    type: 'Public',
    ranking: 3,
    students: '32k+',
    website: 'https://www.sun.ac.za',
    logo: 'https://logo.clearbit.com/sun.ac.za',
    image: 'https://images.unsplash.com/photo-1607237138185-eedd9c632b0b?w=800&q=80',
    about:
      'Stellenbosch is renowned for its research output, wine studies, and strong Afrikaans cultural identity in the Cape Winelands.',
    programs: [
      'AgriSciences', 'Engineering', 'Medicine', 'Law', 'Commerce',
      'Science', 'Arts & Social Sciences', 'Education', 'Theology',
    ],
  },
  {
    id: 4,
    name: 'University of Pretoria',
    shortName: 'UP',
    location: 'Pretoria, Gauteng',
    province: 'Gauteng',
    type: 'Public',
    ranking: 4,
    students: '55k+',
    website: 'https://www.up.ac.za',
    logo: 'https://logo.clearbit.com/up.ac.za',
    image: 'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=800&q=80',
    about:
      'UP is one of South Africa\'s largest universities and is particularly strong in veterinary science, law, and engineering.',
    programs: [
      'Veterinary Science', 'Law', 'Engineering', 'IT', 'Commerce',
      'Health Sciences', 'Natural Sciences', 'Education', 'Humanities',
    ],
  },
  {
    id: 5,
    name: 'University of KwaZulu-Natal',
    shortName: 'UKZN',
    location: 'Durban, KwaZulu-Natal',
    province: 'KwaZulu-Natal',
    type: 'Public',
    ranking: 5,
    students: '48k+',
    website: 'https://www.ukzn.ac.za',
    logo: 'https://logo.clearbit.com/ukzn.ac.za',
    image: 'https://images.unsplash.com/photo-1571260899304-425eee4c7efc?w=800&q=80',
    about:
      'UKZN spans five campuses and is known for its research in health sciences and its diverse, multilingual community.',
    programs: [
      'Health Sciences', 'Engineering', 'Humanities', 'Commerce',
      'Law', 'Science & Agriculture', 'Education',
    ],
  },
  // ───────────── Additional universities ─────────────
  {
    id: 6,
    name: 'Rhodes University',
    shortName: 'RU',
    location: 'Makhanda, Eastern Cape',
    province: 'Eastern Cape',
    type: 'Public',
    ranking: 6,
    students: '8k+',
    website: 'https://www.ru.ac.za',
    logo: 'https://logo.clearbit.com/ru.ac.za',
    image: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&q=80',
    about:
      'Rhodes is a boutique research university celebrated for journalism, media studies, and its vibrant campus culture.',
    programs: [
      'Journalism', 'Law', 'Commerce', 'Pharmacy', 'Science',
      'Humanities', 'Education', 'Fine Arts',
    ],
  },
  {
    id: 7,
    name: 'University of Johannesburg',
    shortName: 'UJ',
    location: 'Johannesburg, Gauteng',
    province: 'Gauteng',
    type: 'Public',
    ranking: 7,
    students: '50k+',
    website: 'https://www.uj.ac.za',
    logo: 'https://logo.clearbit.com/uj.ac.za',
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80',
    about:
      'UJ is a multi-campus urban university with a strong focus on technology, design, and applied sciences.',
    programs: [
      'Engineering & Built Environment', 'IT', 'Business', 'Art, Design & Architecture',
      'Health Sciences', 'Law', 'Science', 'Education', 'Humanities',
    ],
  },
  // … add remaining universities similarly
];

export default SA_UNIVERSITIES;