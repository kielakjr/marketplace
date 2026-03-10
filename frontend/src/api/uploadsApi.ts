import api from './axiosInstance';

interface PresignedUrlResponse {
  uploadUrl: string;
  publicUrl: string;
}

export const uploadsApi = {
  getPresignedUrl: (fileType: string, fileSize: number) =>
    api
      .post<PresignedUrlResponse>('/uploads/presigned-url', { fileType, fileSize })
      .then((res) => res.data),
};
