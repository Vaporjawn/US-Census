import axios, { AxiosInstance, AxiosError } from 'axios';
import cacheService from './cacheService';

const BASE_URL = 'https://api.census.gov/data';

interface CensusResponse {
  headers: string[];
  data: Record<string, string>[];
  raw: string[][];
}

interface Geography {
  [key: string]: string;
}

class CensusAPI {
  private client: AxiosInstance;
  private readonly CACHE_TTL = 60 * 60 * 1000; // 1 hour cache

  constructor() {
    this.client = axios.create({
      baseURL: BASE_URL,
      timeout: 30000,
    });

    // Clean up expired cache on initialization
    cacheService.clearExpired();
  }

  /**
   * Build query parameters for Census API
   */
  buildParams(
    variables: string | string[],
    geography: Geography,
    time: string | null = null,
    additionalParams: Record<string, any> = {}
  ): Record<string, any> {
    const params: Record<string, any> = {
      get: Array.isArray(variables) ? variables.join(',') : variables,
      ...geography,
      ...additionalParams,
    };

    if (time) {
      params.time = time;
    }

    return params;
  }

  /**
   * Generic fetch method for any Census dataset with caching
   */
  async fetchData(
    endpoint: string,
    variables: string | string[],
    geography: Geography,
    time: string | null = null,
    additionalParams: Record<string, any> = {},
    useCache: boolean = true
  ): Promise<CensusResponse> {
    const params = this.buildParams(variables, geography, time, additionalParams);
    const cacheKey = cacheService.generateKey(endpoint, params);

    // Check cache first
    if (useCache) {
      const cached = cacheService.get<CensusResponse>(cacheKey);
      if (cached) {
        console.log('Cache hit:', endpoint);
        return cached;
      }
    }

    try {
      console.log('Fetching from API:', endpoint);
      const response = await this.client.get(endpoint, { params });

      // Census API returns array of arrays, first row is headers
      const [headers, ...rows] = response.data as string[][];

      const result: CensusResponse = {
        headers,
        data: rows.map((row: string[]) => {
          const obj: Record<string, string> = {};
          headers.forEach((header: string, index: number) => {
            obj[header] = row[index];
          });
          return obj;
        }),
        raw: response.data as string[][],
      };

      // Cache the result
      if (useCache) {
        cacheService.set(cacheKey, result, { ttl: this.CACHE_TTL });
      }

      return result;
    } catch (error) {
      console.error('Census API Error:', error);
      throw this.handleError(error as AxiosError);
    }
  }

  /**
   * ACS 5-Year Data
   */
  async getACS5Year(
    year: string,
    variables: string | string[],
    geography: Geography,
    additionalParams: Record<string, any> = {}
  ): Promise<CensusResponse> {
    return this.fetchData(
      `/${year}/acs/acs5`,
      variables,
      geography,
      null,
      additionalParams
    );
  }

  /**
   * ACS 1-Year Data
   */
  async getACS1Year(
    year: string,
    variables: string | string[],
    geography: Geography,
    additionalParams: Record<string, any> = {}
  ): Promise<CensusResponse> {
    return this.fetchData(
      `/${year}/acs/acs1`,
      variables,
      geography,
      null,
      additionalParams
    );
  }

  /**
   * ACS 5-Year Data Profiles
   */
  async getACS5Profile(
    year: string,
    variables: string | string[],
    geography: Geography,
    additionalParams: Record<string, any> = {}
  ): Promise<CensusResponse> {
    return this.fetchData(
      `/${year}/acs/acs5/profile`,
      variables,
      geography,
      null,
      additionalParams
    );
  }

  /**
   * Decennial Census 2020 - DHC
   */
  async getDecennial2020DHC(
    variables: string | string[],
    geography: Geography,
    additionalParams: Record<string, any> = {}
  ): Promise<CensusResponse> {
    return this.fetchData(
      '/2020/dec/dhc',
      variables,
      geography,
      null,
      additionalParams
    );
  }

  /**
   * Decennial Census 2020 - DP (Demographic Profiles)
   */
  async getDecennial2020DP(
    variables: string | string[],
    geography: Geography,
    additionalParams: Record<string, any> = {}
  ): Promise<CensusResponse> {
    return this.fetchData(
      '/2020/dec/dp',
      variables,
      geography,
      null,
      additionalParams
    );
  }

  /**
   * SAIPE - Small Area Income and Poverty Estimates (Time Series)
   */
  async getSAIPE(
    year: string,
    variables: string | string[],
    geography: Geography,
    additionalParams: Record<string, any> = {}
  ): Promise<CensusResponse> {
    return this.fetchData(
      '/timeseries/poverty/saipe',
      variables,
      geography,
      year,
      additionalParams
    );
  }

  /**
   * SAHIE - Small Area Health Insurance Estimates (Time Series)
   */
  async getSAHIE(
    year: string,
    variables: string | string[],
    geography: Geography,
    additionalParams: Record<string, any> = {}
  ): Promise<CensusResponse> {
    return this.fetchData(
      '/timeseries/healthins/sahie',
      variables,
      geography,
      year,
      additionalParams
    );
  }

  /**
   * County Business Patterns
   */
  async getCBP(
    year: string,
    variables: string | string[],
    geography: Geography,
    additionalParams: Record<string, any> = {}
  ): Promise<CensusResponse> {
    return this.fetchData(
      `/${year}/cbp`,
      variables,
      geography,
      null,
      additionalParams
    );
  }

  /**
   * International Trade - Exports by NAICS (Time Series)
   */
  async getTradeExportsNAICS(
    yearMonth: string,
    variables: string | string[],
    additionalParams: Record<string, any> = {}
  ): Promise<CensusResponse> {
    return this.fetchData(
      '/timeseries/intltrade/exports/naics',
      variables,
      {},
      yearMonth,
      additionalParams
    );
  }

  /**
   * EITS - Construction Spending (Time Series)
   */
  async getConstructionSpending(
    yearMonth: string,
    variables: string | string[],
    additionalParams: Record<string, any> = {}
  ): Promise<CensusResponse> {
    return this.fetchData(
      '/timeseries/eits/vip',
      variables,
      {},
      yearMonth,
      additionalParams
    );
  }

  /**
   * Get available states
   */
  async getStates(): Promise<Record<string, string>[]> {
    try {
      const result = await this.fetchData(
        '/2023/acs/acs5',
        ['NAME'],
        { for: 'state:*' }
      );
      return result.data;
    } catch (error) {
      console.error('Error fetching states:', error);
      return [];
    }
  }

  /**
   * Get counties for a state
   */
  async getCounties(stateCode: string): Promise<Record<string, string>[]> {
    try {
      const result = await this.fetchData(
        '/2023/acs/acs5',
        ['NAME'],
        { for: 'county:*', in: `state:${stateCode}` }
      );
      return result.data;
    } catch (error) {
      console.error('Error fetching counties:', error);
      return [];
    }
  }

  /**
   * Error handler
   */
  handleError(error: AxiosError): Error {
    if (error.response) {
      const errorData = error.response.data as { error?: string };
      return new Error(
        `Census API Error: ${error.response.status} - ${
          errorData?.error || error.message
        }`
      );
    } else if (error.request) {
      return new Error('No response from Census API');
    } else {
      return new Error(`Request setup error: ${error.message}`);
    }
  }

  /**
   * Preload commonly used datasets into cache
   */
  async preloadCommonData(): Promise<void> {
    console.log('Preloading common Census datasets...');

    const preloadTasks = [
      // Preload states list
      this.getStates(),

      // Preload recent ACS 5-Year data for all states
      this.getACS5Year(
        '2023',
        ['NAME', 'B01001_001E', 'B19013_001E', 'B25077_001E'],
        { for: 'state:*' }
      ),

      // Preload recent SAIPE data
      this.getSAIPE(
        '2022',
        ['NAME', 'SAEPOVALL_PT', 'SAEMHI_PT'],
        { for: 'state:*' }
      ),

      // Preload recent SAHIE data
      this.getSAHIE(
        '2022',
        ['NAME', 'PCTUI_PT'],
        { for: 'state:*' }
      ),
    ];

    try {
      await Promise.allSettled(preloadTasks);
      console.log('Common data preloaded successfully');
    } catch (error) {
      console.warn('Some preload tasks failed:', error);
    }
  }

  /**
   * Clear all cached data
   */
  clearCache(): void {
    cacheService.clearAll();
  }

  /**
   * Get cache statistics
   */
  getCacheStats() {
    return cacheService.getStats();
  }
}

export default new CensusAPI();
