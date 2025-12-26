export interface Entry {
  id: string;
  name: string;
  type: "file" | "folder";
  size?: number;
  created_at?: string;
  modified_at?: string;
  parent_id?: string | null;
  folder_id?: string;
  file_id?: string;
  entry_id?: string;
  filename?: string;
  summary?: string;
  file_size?: number;
}

export interface Folder extends Entry {
  type: "folder";
  folder_id?: string;
  children?: Entry[];
  entry_count?: number;
}

export function useKnowledgeFolders() {
  // Stub implementation - returns empty data until proper implementation
  return {
    data: [] as Folder[],
    folders: [] as Folder[],
    recentFiles: [] as Entry[],
    loading: false,
    isLoading: false,
    error: null,
    refetch: () => Promise.resolve(),
  };
}
