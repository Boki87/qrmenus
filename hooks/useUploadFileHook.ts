import { useState } from "react";
import { supabase } from "../api/supabase-client";

interface UploadProps {
  bucketName: string;
  file: File;
  fileName: string;
  folder: string;
}

const useUploadFileHook = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [errorUploading, setErrorUploading] = useState(false);
  const [publicUrl, setPublicUrl] = useState<string | null>(null);

  function resetState() {
    setErrorUploading(false);
    setPublicUrl(null);
    setPublicUrl(null);
  }

  async function uploadFile({
    bucketName,
    file,
    fileName,
    folder,
  }: UploadProps) {
    resetState();
    let ext = file.name.split(".").pop();
    let fullPath = `${folder}/${fileName}.${ext}`;
    try {
      setIsUploading(true);
      const { data, error } = await supabase.storage
        .from(bucketName)
        .upload(fullPath, file, {
          upsert: true,
        });
      if (error) {
        setErrorUploading(true);
        throw error;
      }

      const { publicURL, error: readError } = supabase.storage
        .from(bucketName)
        .getPublicUrl(fullPath);

      if (readError) {
        setPublicUrl(null);
        throw readError;
      }

      if (publicURL) {
        setPublicUrl(publicURL);
        setIsUploading(false);
        return publicURL;
      } else {
        setPublicUrl(null);
        setIsUploading(false);
      }
    } catch (e) {
      console.log(e);
      resetState();
      setIsUploading(false);
    }
  }

  return { uploadFile, isUploading, errorUploading, publicUrl };
};

export default useUploadFileHook;
