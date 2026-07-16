import { apiClient } from './client';

export interface IMeasurementUnitRef {
  _id: string;
  unit: string;
}

export interface IMeasurementTypeRef {
  _id: string;
  key: string;
  name: string;
  category?: string | null;
  lowerIsBetter?: boolean;
  refLow?: number | null;
  refHigh?: number | null;
}

export interface IMeasurementSourceRef {
  _id: string;
  type: string; // provider type, e.g. 'oura' | 'apple' | 'manual'
  name?: string;
}

/** A measurement with its type, unit + source populated. */
export interface IMeasurement {
  _id: string;
  userId: string;
  typeId: IMeasurementTypeRef;
  unitId: IMeasurementUnitRef;
  sourceId: IMeasurementSourceRef | null;
  value: number;
  timestamp: string;
}

export interface GetMeasurementsParams {
  from?: string;
  to?: string;
  type?: string; // comma-separated type keys
  category?: string; // comma-separated categories
}

export const getMeasurements = async (params: GetMeasurementsParams = {}): Promise<IMeasurement[]> => {
  const res = await apiClient.get<{ data: IMeasurement[] }>('/v1/measurements', { params });
  return res.data.data ?? [];
};

export const getMeasurementTypes = async (): Promise<IMeasurementTypeRef[]> => {
  const res = await apiClient.get<{ data: IMeasurementTypeRef[] }>('/v1/measurements/types');
  return res.data.data ?? [];
};

export const createMeasurement = async (data: {
  typeKey: string;
  value: number;
  unit?: string;
  timestamp?: string;
}): Promise<void> => {
  await apiClient.post('/v1/measurements', data);
};

export const deleteMeasurement = async (id: string): Promise<void> => {
  await apiClient.delete(`/v1/measurements/${id}`);
};
