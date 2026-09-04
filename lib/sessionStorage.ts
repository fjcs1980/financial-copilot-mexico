import { Debt, FinancialResult } from '@/types/financial';

export const STORAGE_KEY = 'financial_copilot_session_v1';

export interface UserSessionData {
  step: number;
  income: string;
  rent: string;
  food: string;
  utilities: string;
  safetyBuffer: string;
  debts: Debt[];
  result: FinancialResult | null;
}

export const defaultSessionData: UserSessionData = {
  step: 1,
  income: '',
  rent: '',
  food: '',
  utilities: '',
  safetyBuffer: '',
  debts: [],
  result: null,
};

export function loadSession(storage: Storage | { getItem: (key: string) => string | null }): UserSessionData {
  try {
    const raw = storage.getItem(STORAGE_KEY);
    if (!raw) return { ...defaultSessionData };

    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object') {
      return { ...defaultSessionData };
    }

    return {
      step: typeof parsed.step === 'number' ? parsed.step : 1,
      income: typeof parsed.income === 'string' ? parsed.income : '',
      rent: typeof parsed.rent === 'string' ? parsed.rent : '',
      food: typeof parsed.food === 'string' ? parsed.food : '',
      utilities: typeof parsed.utilities === 'string' ? parsed.utilities : '',
      safetyBuffer: typeof parsed.safetyBuffer === 'string' ? parsed.safetyBuffer : '',
      debts: Array.isArray(parsed.debts) ? parsed.debts : [],
      result: parsed.result && typeof parsed.result === 'object' ? parsed.result : null,
    };
  } catch {
    return { ...defaultSessionData };
  }
}

export function saveSession(
  storage: Storage | { setItem: (key: string, val: string) => void },
  data: UserSessionData
): boolean {
  try {
    storage.setItem(STORAGE_KEY, JSON.stringify(data));
    return true;
  } catch {
    return false;
  }
}

export function clearSession(
  storage: Storage | { removeItem: (key: string) => void }
): boolean {
  try {
    storage.removeItem(STORAGE_KEY);
    return true;
  } catch {
    return false;
  }
}