import { useState, useEffect, DependencyList } from 'react';

interface UseCensusDataReturn<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: (...args: any[]) => Promise<T>;
}

export const useCensusData = <T,>(
  fetchFunction: (...args: any[]) => Promise<T>,
  dependencies: DependencyList = []
): UseCensusDataReturn<T> => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async (...args: any[]): Promise<T> => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetchFunction(...args);
      setData(result);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (dependencies.length > 0 && dependencies.every(dep => dep !== null && dep !== undefined)) {
      fetchData(...dependencies);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencies);

  return { data, loading, error, refetch: fetchData };
};

interface StateData {
  NAME: string;
  state: string;
  [key: string]: string;
}

interface UseStatesReturn {
  states: StateData[];
  loading: boolean;
}

export const useStates = (): UseStatesReturn => {
  const [states, setStates] = useState<StateData[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchStates = async () => {
      setLoading(true);
      try {
        const censusApi = (await import('../services/censusApi')).default;
        const data = await censusApi.getStates();
        setStates(data as StateData[]);
      } catch (error) {
        console.error('Error loading states:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStates();
  }, []);

  return { states, loading };
};

interface CountyData {
  NAME: string;
  county: string;
  state: string;
  [key: string]: string;
}

interface UseCountiesReturn {
  counties: CountyData[];
  loading: boolean;
}

export const useCounties = (stateCode: string): UseCountiesReturn => {
  const [counties, setCounties] = useState<CountyData[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (!stateCode) {
      setCounties([]);
      return;
    }

    const fetchCounties = async () => {
      setLoading(true);
      try {
        const censusApi = (await import('../services/censusApi')).default;
        const data = await censusApi.getCounties(stateCode);
        setCounties(data as CountyData[]);
      } catch (error) {
        console.error('Error loading counties:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchCounties();
  }, [stateCode]);

  return { counties, loading };
};
