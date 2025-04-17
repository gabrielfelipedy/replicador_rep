// getAfdByInitialNSR.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';
import axios from 'axios';
import iconv from 'iconv-lite';
import { processLine } from '../src/utils/ProcessLine.js';
import { writeRegistros } from '../src/config/WriteRegistros.js';
import { Clock } from '../src/models/Clock.js';
import { getAfdByInitialNSR } from '../src/controllers/NSRController.js';

vi.mock('axios');
vi.mock('../src/utils/ProcessLine.js', () => ({
  processLine: vi.fn((line: string) => Promise.resolve(line)),
}));
vi.mock('../src/config/WriteRegistros.js', () => ({
  writeRegistros: vi.fn(() => Promise.resolve()),
}));


const mockedAxios = axios as unknown as {
  post: ReturnType<typeof vi.fn>;
};

const mockClock: Clock = {
  id: 1,
  ip: '192.168.0.100',
  descricao: 'Relógio A',
  user: 'admin',
  password: 'admin',
};

beforeEach(() => {
  vi.clearAllMocks();
});

describe('getAfdByInitialNSR', () => {
  it('should process valid AFD response', async () => {

    const fakeAFD = '0000000013202404170800000000000012345678901A1B2\n0000000014202404170900000000000012345678901B2C3\n0000000014202404170900000000000012345678901B2C3\n0000000014202404170900000000000012345678901B2C3';
    const encoded = iconv.encode(fakeAFD, 'win1252');

    mockedAxios.post = vi.fn().mockResolvedValue({ data: encoded });

    const registros = await getAfdByInitialNSR('session-abc', mockClock, 13);
    console.log(registros)

    expect(axios.post).toHaveBeenCalled();
    expect(processLine).toHaveBeenCalledTimes(2);
    expect(writeRegistros).toHaveBeenCalledWith(expect.any(Array), 1);
    expect(registros?.length).toBe(2);
  });

  it('should handle empty response', async () => {
    mockedAxios.post = vi.fn().mockResolvedValue({ data: '' });

    const registros = await getAfdByInitialNSR('session-abc', mockClock, 13);

    expect(registros).toEqual([]);
  });

  it('should return null on error', async () => {
    mockedAxios.post = vi.fn().mockRejectedValue(new Error('Connection failed'));

    const registros = await getAfdByInitialNSR('session-abc', mockClock, 13);

    expect(registros).toBeNull();
  });
});
