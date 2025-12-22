export async function uploadProductImage(file: File, title: string): Promise<{ url: string; publicId: string }> {
  const formData = new FormData();

  formData.append("file", file);
  formData.append("title", title);
  const res = await fetch("/api/upload/product-image", {
    method: "POST",
    body: formData,
  });

  if (!res.ok) throw new Error("Product image upload failed");

  const data = await res.json();
  return data[0];
}
