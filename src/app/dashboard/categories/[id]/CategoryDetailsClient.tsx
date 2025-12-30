import SectionContainer from "@/components/section/SectionContainer";
import { Category } from "@/types/category";

interface Props {
  category: Category;
}

export default function CategoryDetailsClient({ category }: Props) {
  return (
    <>
      <h2>{category.name}</h2>
      <SectionContainer>
        <p>Category Page</p>
      </SectionContainer>
    </>
  );
}
