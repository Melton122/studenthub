// src/services/api/universities.js

// Load local JSON using require() — works in React Native
const localData = require('../../assets/data/universities.json');

const BASE_URL = 'https://universities.hipolabs.com/search';

// Default fallback university
const DEFAULT_FALLBACK = [
  {
    id: 'default-university',
    name: 'Default University',
    shortName: 'DU',
    country: 'Unknown',
    alpha_two_code: 'XX',
    webPages: ['https://example.com'],
    domains: ['example.com'],
    logo: 'https://images.unsplash.com/photo-1562774053-701939374585?w=500',
    description: 'Fallback university used when API and local JSON fail.',
    programs: ['Computer Science', 'Business', 'Law'],
    ranking: 100,
    students: '10k+',
  },
];

let cache = null;

// Enrich university object with additional fields
const enrichUniversity = (uni) => ({
  id: `${uni.name}-${uni.country}`.replace(/\s+/g, '-').toLowerCase(),
  name: uni.name,
  shortName: uni.name.split(' ').map((w) => w[0]).join('').toUpperCase(),
  country: uni.country,
  alpha_two_code: uni.alpha_two_code,
  webPages: uni.web_pages || uni.webPages || [],
  domains: uni.domains || [],
  logo: `https://logo.clearbit.com/${uni.domains?.[0] || 'example.com'}`,
  description:
    uni.description || `${uni.name} is a distinguished institution of higher learning.`,
  programs: uni.programs || ['Computer Science', 'Engineering', 'Business'],
  ranking: uni.ranking || Math.floor(Math.random() * 100) + 1,
  students: uni.students || `${Math.floor(Math.random() * 30) + 10}k+`,
});

// Fetch universities from API first, fallback to local JSON
export const fetchUniversities = async (country = null) => {
  if (cache) return cache;

  try {
    const url = country
      ? `${BASE_URL}?country=${encodeURIComponent(country)}`
      : BASE_URL;
    const response = await fetch(url);
    if (!response.ok) throw new Error('API request failed');

    const data = await response.json();
    if (!data || data.length === 0) throw new Error('Empty API response');

    const enriched = data.slice(0, 200).map(enrichUniversity);
    cache = enriched;
    return enriched;
  } catch (apiError) {
    console.warn('API failed, using local data:', apiError);

    try {
      let localUniversities = localData.slice(0, 200);
      if (country) {
        localUniversities = localUniversities.filter(
          (u) => u.country.toLowerCase() === country.toLowerCase()
        );
      }
      const enriched = localUniversities.length
        ? localUniversities.map(enrichUniversity)
        : DEFAULT_FALLBACK;

      cache = enriched;
      return enriched;
    } catch (localError) {
      console.error('Local data failed, using fallback:', localError);
      return DEFAULT_FALLBACK;
    }
  }
};

export const searchUniversities = async (query) => {
  if (!cache) await fetchUniversities();
  const q = query.toLowerCase();
  const results = cache.filter(
    (uni) => uni.name.toLowerCase().includes(q) || uni.country.toLowerCase().includes(q)
  );
  return results.length ? results : DEFAULT_FALLBACK;
};

export const fetchUniversityById = async (id) => {
  if (!cache) await fetchUniversities();
  return cache.find((uni) => uni.id === id) || DEFAULT_FALLBACK[0];
};

export const fetchUniversitiesByCountry = async (country) => {
  return fetchUniversities(country);
};