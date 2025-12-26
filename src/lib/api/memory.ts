/**
 * Memory API types and functions
 */

export interface Memory {
  id: string;
  memory_id?: string;
  content: string;
  created_at: string;
  updated_at?: string;
  metadata?: Record<string, any>;
  memory_type?: string;
}

export interface MemoryStats {
  total: number;
  total_memories?: number;
  max_memories?: number;
  by_type?: Record<string, number>;
  memory_enabled?: boolean;
}

export interface CreateMemoryRequest {
  content: string;
  memory_type?: string;
  metadata?: Record<string, any>;
}

export interface MemorySettings {
  enabled: boolean;
  memory_types?: string[];
}

export interface ListMemoriesParams {
  page?: number;
  limit?: number;
  memory_type?: string;
}

export interface ListMemoriesResponse {
  memories: Memory[];
  total?: number;
  page?: number;
  pages?: number;
  limit?: number;
}

export async function listMemories(params?: ListMemoriesParams): Promise<ListMemoriesResponse> {
  // Stub implementation
  return {
    memories: [],
    total: 0,
    page: params?.page || 1,
    limit: params?.limit || 50,
  };
}

export async function getMemories(): Promise<Memory[]> {
  // Stub implementation
  return [];
}

export async function getMemoryStats(): Promise<MemoryStats> {
  // Stub implementation
  return { total: 0 };
}

export async function createMemory(request: CreateMemoryRequest): Promise<Memory> {
  // Stub implementation
  return {
    id: Date.now().toString(),
    content: request.content,
    created_at: new Date().toISOString(),
    metadata: request.metadata,
    memory_type: request.memory_type,
  };
}

export async function deleteMemory(id: string): Promise<void> {
  // Stub implementation
}

export interface DeleteAllMemoriesResponse {
  deleted_count: number;
}

export async function deleteAllMemories(confirm?: boolean): Promise<DeleteAllMemoriesResponse> {
  // Stub implementation
  return { deleted_count: 0 };
}

export async function getMemorySettings(): Promise<MemorySettings> {
  // Stub implementation
  return { enabled: false };
}

export async function updateMemorySettings(settings: MemorySettings | boolean): Promise<MemoryStats> {
  // Stub implementation
  const enabled = typeof settings === 'boolean' ? settings : settings.enabled;
  return { total: 0, memory_enabled: enabled };
}

export async function getThreadMemorySettings(threadId: string): Promise<MemorySettings> {
  // Stub implementation
  return { enabled: false };
}

export interface ThreadMemorySettingsResponse {
  thread_id: string;
  enabled: boolean;
  memory_enabled?: boolean;
}

export async function updateThreadMemorySettings(threadId: string, settings: MemorySettings | boolean): Promise<ThreadMemorySettingsResponse> {
  // Stub implementation
  const enabled = typeof settings === 'boolean' ? settings : settings.enabled;
  return { thread_id: threadId, enabled };
}
