import {
  loadSession,
  saveSession,
  clearSession,
  STORAGE_KEY,
  UserSessionData,
  defaultSessionData,
} from './sessionStorage';

// Mock simple de Storage para ejecutar en cualquier entorno sin dependencias externas
function createMockStorage(initialStore: Record<string, string> = {}) {
  const store = { ...initialStore };
  return {
    getItem: (key: string) => (key in store ? store[key] : null),
    setItem: (key: string, value: string) => {
      store[key] = value;
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    getStore: () => store,
  };
}

function runPersistenceTests() {
  let passed = 0;
  let total = 0;

  function assert(condition: boolean, testName: string) {
    total++;
    if (condition) {
      passed++;
      console.log(`✓ PASS: ${testName}`);
    } else {
      console.error(`✗ FAIL: ${testName}`);
      process.exitCode = 1;
    }
  }

  console.log('--- RUNNING SESSION PERSISTENCE REGRESSION TESTS ---');

  // Test 1: Carga estado default si no hay nada guardado
  {
    const storage = createMockStorage();
    const loaded = loadSession(storage);
    assert(loaded.step === 1 && loaded.income === '', 'Restores default session when storage is empty');
  }

  // Test 2: Guarda y restaura sesión válida
  {
    const storage = createMockStorage();
    const sessionToSave: UserSessionData = {
      step: 3,
      income: '25000',
      rent: '6000',
      food: '3500',
      utilities: '1200',
      safetyBuffer: '3000',
      debts: [{ id: '1', name: 'Banamex', balance: 10000, minimumPayment: 1000, apr: 45 }],
      result: null,
    };
    saveSession(storage, sessionToSave);
    const restored = loadSession(storage);
    assert(
      restored.step === 3 &&
      restored.income === '25000' &&
      restored.debts.length === 1 &&
      restored.debts[0].name === 'Banamex',
      'Saves and restores valid session accurately'
    );
  }

  // Test 3: Manejo defensivo ante JSON corrupto
  {
    const storage = createMockStorage({ [STORAGE_KEY]: 'corrupted-{{json}}' });
    const loaded = loadSession(storage);
    assert(
      loaded.step === 1 && loaded.income === '' && loaded.debts.length === 0,
      'Recovers safely with defaults on corrupted JSON without crashing'
    );
  }

  // Test 4: Reset elimina la sesión
  {
    const storage = createMockStorage({ [STORAGE_KEY]: '{"step":2,"income":"10000"}' });
    clearSession(storage);
    assert(storage.getItem(STORAGE_KEY) === null, 'Clears persisted session completely on reset');
  }

  console.log(`--- SUMMARY: ${passed}/${total} TESTS PASSED ---`);
}

runPersistenceTests();