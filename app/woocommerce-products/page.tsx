import type { Metadata } from "next";
import WooCommerceProductsClient from "./WooCommerceProductsClient";
import {
  fetchWooCommerceProducts,
  fetchWooCommerceCategories,
} from "@/lib/woocommerce-api";

export const metadata: Metadata = {
  title: "WooCommerce Products | GlamUp",
  description:
    "Discover our amazing collection of beauty and wellness products from our online store.",
};

export default async function WooCommerceProductsPage() {
  const [products, categories] = await Promise.all([
    fetchWooCommerceProducts(),
    fetchWooCommerceCategories(),
  ]).catch((error) => {
    console.error("Failed to fetch products or categories:", error);
    return [[], []]; // Return empty arrays on error
  });

  return (
    <WooCommerceProductsClient
      initialProducts={products}
      initialCategories={categories}
    />
  );
}
