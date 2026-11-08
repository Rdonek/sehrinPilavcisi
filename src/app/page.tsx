import { MainApp } from "@/components/MainApp";
import { getRestaurantData } from "@/lib/airtable";

export const revalidate = 15;

export default async function HomePage() {
  const { items, categories, restaurantInfo } = await getRestaurantData();

  return (
    <MainApp
      categories={categories}
      initialItems={items}
      restaurantInfo={restaurantInfo}
    />
  );
}
