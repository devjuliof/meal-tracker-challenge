"use client"

import * as React from "react"
import { useDropzone } from "react-dropzone"
import { Camera, Loader2, X } from "lucide-react"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useUploadThing } from "@/lib/uploadthing"

interface UploadButtonProps {
  onUploadComplete: (url: string) => void
  onUploadError: (error: Error) => void
  currentImageUrl?: string | null
  className?: string
}

export function UploadButton({ onUploadComplete, onUploadError, currentImageUrl, className }: UploadButtonProps) {
  const [isUploading, setIsUploading] = React.useState(false)
  const [preview, setPreview] = React.useState<string | null>(currentImageUrl || null)

  const { startUpload, permittedFileInfo } = useUploadThing("profileImage", {
    onClientUploadComplete: (res) => {
      if (res && res[0]) {
        const imageUrl = res[0].url
        setPreview(imageUrl)
        onUploadComplete(imageUrl)
        toast.success("Imagem carregada com sucesso!")
      }
      setIsUploading(false)
    },
    onUploadError: (error) => {
      toast.error(`Erro ao carregar imagem: ${error.message}`)
      onUploadError(error)
      setIsUploading(false)
    },
  })

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".gif"],
    },
    maxFiles: 1,
    onDrop: async (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        setIsUploading(true)

        // Create a preview
        const file = acceptedFiles[0]
        const objectUrl = URL.createObjectURL(file)
        setPreview(objectUrl)

        // Start upload
        try {
          await startUpload(acceptedFiles)
        } catch (error) {
          console.error("Upload failed:", error)
          // Error is handled by onUploadError callback
        }
      }
    },
  })

  const removeImage = (e: React.MouseEvent) => {
    e.stopPropagation()
    setPreview(null)
    onUploadComplete("")
  }

  return (
    <div className={cn("relative", className)}>
      {preview ? (
        <div className="relative">
          <img
            src={preview || "/placeholder.svg"}
            alt="Profile preview"
            className="h-24 w-24 rounded-full object-cover"
            onError={() => {
              setPreview("/placeholder.svg?height=100&width=100")
            }}
          />
          <div className="absolute -right-2 -top-2 flex space-x-1">
            <Button
              type="button"
              variant="destructive"
              size="icon"
              className="h-6 w-6 rounded-full"
              onClick={removeImage}
            >
              <X className="h-3 w-3" />
              <span className="sr-only">Remover imagem</span>
            </Button>
          </div>
          <div
            {...getRootProps()}
            className="absolute bottom-0 right-0 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-primary text-primary-foreground shadow-sm transition-colors hover:bg-primary/90"
          >
            <input {...getInputProps()} />
            {isUploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Camera className="h-4 w-4" />}
            <span className="sr-only">Alterar foto</span>
          </div>
        </div>
      ) : (
        <div
          {...getRootProps()}
          className={cn(
            "flex h-24 w-24 cursor-pointer flex-col items-center justify-center rounded-full border-2 border-dashed border-muted-foreground/25 bg-muted transition-colors hover:border-muted-foreground/50",
            isDragActive && "border-primary/50 bg-primary/5",
            isUploading && "pointer-events-none opacity-60",
          )}
        >
          <input {...getInputProps()} />
          {isUploading ? (
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          ) : (
            <>
              <Camera className="mb-1 h-6 w-6 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">Upload</span>
            </>
          )}
        </div>
      )}
    </div>
  )
}
