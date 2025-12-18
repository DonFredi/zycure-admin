import DashboardLayout from "./dashboard/layout";
import ProductsPage from "./dashboard/products/page";

export default function Home() {
  return (
    <DashboardLayout>
      <ProductsPage />
    </DashboardLayout>
  );
}
