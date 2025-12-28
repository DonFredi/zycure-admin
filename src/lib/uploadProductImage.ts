export async function uploadProductImage(
  productId: string,
  file: File,
  title: string
): Promise<{ url: string; publicId: string }> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("title", title);

  const res = await fetch(`/api/upload/product-image/${productId}`, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    const text = await res.text();
    console.error("Upload failed response:", text);
    throw new Error("Product image upload failed");
  }

  const data = await res.json();

  return {
    url: data.url,
    publicId: data.publicId,
  };
}
