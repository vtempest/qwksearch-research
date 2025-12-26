import { useQuery } from '@tanstack/react-query';

export interface Folder {
  folder_id: string;
  name: string;
  parent_id: string | null;
  entry_count?: number;
  created_at: string;
  updated_at: string;
  user_id?: string;
}

export interface Entry {
  entry_id: string;
  folder_id: string;
  name: string;
  filename: string;
  type: string;
  file_path?: string;
  url?: string;
  content?: string;
  summary: string;
  file_size: number;
  created_at: string;
  updated_at: string;
}

export function useKnowledgeFolders() {
  const { data: folders = [], refetch, isLoading, error } = useQuery<Folder[]>({
    queryKey: ['knowledge-folders'],
    queryFn: async () => {
      // Stub implementation - returns empty array
      return [];
    },
  });

  return {
    folders,
    recentFiles: [],
    loading: isLoading,
    refetch,
    error,
  };
}
