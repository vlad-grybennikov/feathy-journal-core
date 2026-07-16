import { apiClient } from './client';

/** A connectable provider with its brand badge colors (from the catalog). */
export interface IProvider {
  _id: string;
  type: string;
  label: string;
  bg: string;
  fg: string;
  group: string;
  available: boolean;
  order: number;
}

export const getProviders = async (): Promise<IProvider[]> => {
  const res = await apiClient.get<{ data: IProvider[] }>('/v1/providers');
  return res.data.data ?? [];
};
