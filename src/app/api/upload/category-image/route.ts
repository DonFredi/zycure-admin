import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    const name = formData.get("name") as string;

    if (!file || !name) {
      return NextResponse.json({ error: "Missing data" }, { status: 400 });
    }

    // Generate slug from name
    // Convert category name to slug
    const slug = name
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-") // spaces -> dash
      .replace(/[^a-z0-9-_]/g, ""); // remove special chars

    const buffer = Buffer.from(await file.arrayBuffer());

    const uploadResult = await new Promise<any>((resolve, reject) => {
      cloudinary.uploader
        .upload_stream({ folder: "categories", public_id: slug, overwrite: true }, (err, result) =>
          err ? reject(err) : resolve(result)
        )
        .end(buffer);
    });

    return NextResponse.json({ slug, url: uploadResult.secure_url });
  } catch (err) {
    console.error("Category upload error:", err);
    return NextResponse.json({ error: (err as Error).message || "Upload failed" }, { status: 500 });
  }
}
