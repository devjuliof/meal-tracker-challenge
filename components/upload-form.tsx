"use client";

import { UploadButton } from "@/lib/uploadthing";
import { useState } from "react";

interface UploadComponentProps {
  onUploadComplete: (url: string) => void;
  setIsUploading: (value: boolean) => void;
}

export default function UploadComponent({ onUploadComplete, setIsUploading }: UploadComponentProps) {
  const [internalUploading, setInternalUploading] = useState(false);
  const [hasUploaded, setHasUploaded] = useState(false);

  return (
    <div>
      <UploadButton
        content={{
          button({ ready }) {
            if (!ready) return "Carregando...";
            if (internalUploading) return "Enviando...";
            if (hasUploaded) return "Trocar imagem";
            return "Escolher arquivo";
          },
        }}
        appearance={{
          button: {
            background: "bg-indigo-600",
            color: "text-white",
            padding: "py-3 px-6",
            borderRadius: "rounded-lg",
          },
          container: "border border-dashed border-gray-300 p-4",
        }}
        onUploadBegin={() => {
          setIsUploading(true);
          setInternalUploading(true);
        }}
        endpoint="imageUploader"
        onClientUploadComplete={(res: { url: string }[]) => {
          setIsUploading(false);
          setInternalUploading(false);

          const url = res?.[0].url;
          if (url) {
            onUploadComplete(url);
            setHasUploaded(true);
          }
        }}
      />
    </div>
  );
}
