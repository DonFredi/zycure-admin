export async function uploadCategoryImage(file: File, categoryName: string): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("name", categoryName); // ✅ must be "name"

  const res = await fetch("/api/upload/category-image", {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text);
  }

  const data = await res.json();
  return data.url as string;
}
