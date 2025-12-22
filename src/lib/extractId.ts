export default function extractCloudinaryPublicId(url?: string): string | undefined {
  if (!url) return;
  const parts = url.split("/");
  const filename = parts[parts.length - 1];
  return filename?.split(".")[0];
}
