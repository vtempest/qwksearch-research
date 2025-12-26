export interface Memory {
  memory_id: string;
  content: string;
  memory_type?: string;
  created_at: string;
  updated_at?: string;
  metadata?: Record<string, any>;
}

export interface MemoryStats {
  total_memories: number;
  max_memories: number;
  memory_enabled: boolean;
}

export interface CreateMemoryRequest {
  content: string;
  memory_type?: string;
  metadata?: Record<string, any>;
}

export interface ListMemoriesParams {
  page?: number;
  limit?: number;
  memory_type?: string;
}

export interface ListMemoriesResponse {
  memories: Memory[];
  total: number;
  page: number;
  pages: number;
  limit: number;
}

export async function listMemories(params?: ListMemoriesParams): Promise<ListMemoriesResponse> {
  return {
    memories: [],
    total: 0,
    page: params?.page || 1,
    pages: 0,
    limit: params?.limit || 50,
  };
}

export async function getMemoryStats(): Promise<MemoryStats> {
  return {
    total_memories: 0,
    max_memories: 100,
    memory_enabled: false,
  };
}

export async function deleteMemory(id: string): Promise<void> {
  // Stub implementation
}

export async function deleteAllMemories(confirm?: boolean): Promise<{ deleted_count: number }> {
  return { deleted_count: 0 };
}

export async function createMemory(data: CreateMemoryRequest): Promise<Memory> {
  return {
    memory_id: '',
    content: data.content,
    memory_type: data.memory_type,
    created_at: new Date().toISOString(),
    metadata: data.metadata,
  };
}

export async function getMemorySettings(): Promise<any> {
  return {};
}

export async function updateMemorySettings(settings: any): Promise<any> {
  return settings;
}

export async function getThreadMemorySettings(threadId: string): Promise<any> {
  return {};
}

export async function updateThreadMemorySettings(threadId: string, settings: any): Promise<any> {
  return settings;
}
