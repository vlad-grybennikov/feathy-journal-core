export interface GenerateTasksRequest {
  date: string;
}

export interface GenerateTasksResponse {
  success: boolean;
  status: number;
  data: unknown;
}
