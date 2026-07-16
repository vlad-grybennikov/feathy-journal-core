import { apiClient } from './client';

export interface ISource {
  type: string;
  name?: string | null;
  status: 'connected' | 'disconnected' | 'error';
  lastSyncAt?: string | null;
  lastError?: string | null;
}

export interface SyncResult {
  measurements: number;
  days: number;
  lastSyncAt: string;
}

export const getSources = async (): Promise<ISource[]> => {
  const res = await apiClient.get<{ data: ISource[] }>('/v1/sources');
  return res.data.data ?? [];
};

export const connectSource = async (type: string, token?: string): Promise<ISource> => {
  const res = await apiClient.post<{ data: ISource }>(`/v1/sources/${type}`, token ? { token } : {});
  return res.data.data;
};

export const syncSource = async (type: string, full = false): Promise<SyncResult> => {
  const res = await apiClient.post<{ data: SyncResult }>(`/v1/sources/${type}/sync`, { full });
  return res.data.data;
};

export const disconnectSource = async (type: string): Promise<void> => {
  await apiClient.delete(`/v1/sources/${type}`);
};
