import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";

const f = createUploadthing();

export const ourFileRouter = {
  imageUploader: f({ image: { maxFileSize: "4MB" } }).onUploadComplete(
    ({ metadata, file }) => {
      console.log("Upload completo", file);
    }
  ),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
