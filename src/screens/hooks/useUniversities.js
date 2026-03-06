import {
  fetchUniversities,
  searchUniversities,
  fetchUniversitiesByCountry,
} from '../../services/api/universitiesApi';
export const useUniversities = (country = null) => {
  const [universities, setUniversities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadUniversities = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = country
        ? await fetchUniversitiesByCountry(country)
        : await fetchUniversities();
      setUniversities(data);
    } catch (err) {
      console.error('Failed to load universities:', err);
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [country]);

  const search = useCallback(async (query) => {
    if (!query) return universities;
    return await searchUniversities(query);
  }, [universities]);

  useEffect(() => {
    loadUniversities();
  }, [loadUniversities]);

  return { universities, loading, error, reload: loadUniversities, search };
};