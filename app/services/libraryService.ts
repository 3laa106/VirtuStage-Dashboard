import { API_ENDPOINTS } from '../config/api';
import type { LibraryFile } from '../types/library';
import api from '../utils/api';

export const getFiles = async (): Promise<LibraryFile[]> => {
  const { data } = await api.get<LibraryFile[]>(API_ENDPOINTS.files.list);
  return data;
};

export const uploadFile = async (
  file: File,
  onProgress?: (progress: number) => void,
): Promise<LibraryFile> => {
  const formData = new FormData();
  formData.append('file', file);
  const { data } = await api.post(API_ENDPOINTS.files.upload, formData, {
    onUploadProgress: (event) => {
      if (event.total) {
        onProgress?.(Math.round((event.loaded * 100) / event.total));
      }
    },
  });
  return data;
};

export const deleteFile = async (id: string) => {
  await api.delete(API_ENDPOINTS.files.delete(id));
};
