import { Category } from "@/types/category";

interface Props {
  category: Category;
}

export default function CategoryDetailsClient({ category }: Props) {
  return (
    <div>
      <h1>{category.name}</h1>
    </div>
  );
}
