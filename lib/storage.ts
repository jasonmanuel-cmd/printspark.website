import { put } from "@vercel/blob";

export async function uploadDesignFile(
  file: File,
  orderId: string
): Promise<string> {
  const fileName = `${orderId}/${Date.now()}-${file.name}`;
  const blob = await put(fileName, file, {
    access: "public",
  });
  return blob.url;
}
