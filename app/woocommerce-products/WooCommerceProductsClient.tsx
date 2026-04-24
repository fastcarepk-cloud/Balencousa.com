"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import LoadingSpinner from "@/components/LoadingSpinner";
import { WooCommerceProductCard } from "@/components/WooCommerceProductCard";
import { WooCommerceCategoryCard } from "@/components/WooCommerceCategoryCard";
import {
  fetchWooCommerceProducts,
  fetchProductsByCategory,
  type WooCommerceProduct,
  type WooCommerceCategory,
} from "@/lib/woocommerce-api";
import { Search, Filter, Grid, List, RefreshCw } from 'lucide-react';

interface WooCommerceProductsClientProps {
  initialProducts: WooCommerceProduct[];
  initialCategories: WooCommerceCategory[];
}

export default function WooCommerceProductsClient({
  initialProducts,
  initialCategories,
}: WooCommerceProductsClientProps) {
  const [products, setProducts] = useState<WooCommerceProduct[]>(initialProducts);
  const [categories, setCategories] =
    useState<WooCommerceCategory[]>(initialCategories);
  const [filteredProducts, setFilteredProducts] =
    useState<WooCommerceProduct[]>(initialProducts);
  const [loading, setLoading] = useState(false); // Data is pre-loaded
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState<"name" | "price" | "date">("name");
  const [showCategories, setShowCategories] = useState(true);

  useEffect(() => {
    let tempProducts = [...products];

    // Filter by search term
    if (searchTerm) {
      tempProducts = tempProducts.filter(
        (product) =>
          product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Sort products
    tempProducts.sort((a, b) => {
      switch (sortBy) {
        case "price":
          return (
            Number.parseFloat(a.price || "0") -
            Number.parseFloat(b.price || "0")
          );
        case "date":
          return (
            new Date(b.date_created).getTime() -
            new Date(a.date_created).getTime()
          );
        default:
          return a.name.localeCompare(b.name);
      }
    });

    setFilteredProducts(tempProducts);
  }, [products, searchTerm, sortBy]);

  const refreshData = async () => {
    setLoading(true);
    try {
      const productsData = await fetchWooCommerceProducts();
      setProducts(productsData);
      // Reset all filters
      setSelectedCategory(null);
      setSearchTerm("");
      setSortBy("name");
    } catch (error) {
      console.error("Error refreshing data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCategorySelect = async (categoryId: number | null) => {
    // If clicking the same category, deselect it
    if (selectedCategory === categoryId) {
      setSelectedCategory(null);
      setProducts(initialProducts);
      return;
    }

    setSelectedCategory(categoryId);
    setSearchTerm(""); // Clear search term when changing category

    if (categoryId) {
      setLoading(true);
      try {
        const categoryProducts = await fetchProductsByCategory(categoryId);
        setProducts(categoryProducts);
      } catch (error) {
        console.error("Error fetching category products:", error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    } else {
      setProducts(initialProducts);
    }
  };

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedCategory(null);
    setSortBy("name");
    setProducts(initialProducts);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          WooCommerce Products
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Discover our amazing collection of beauty and wellness products from
          our online store.
        </p>
      </div>

      {/* Controls */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
        <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Controls */}
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowCategories(!showCategories)}
            >
              <Filter className="h-4 w-4 mr-2" />
              Categories
            </Button>

            <select
              value={sortBy}
              onChange={(e) =>
                setSortBy(e.target.value as "name" | "price" | "date")
              }
              className="px-3 py-2 border border-gray-300 rounded-md text-sm"
            >
              <option value="name">Sort by Name</option>
              <option value="price">Sort by Price</option>
              <option value="date">Sort by Date</option>
            </select>

            <div className="flex border border-gray-300 rounded-md">
              <Button
                variant={viewMode === "grid" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("grid")}
                className="rounded-r-none"
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("list")}
                className="rounded-l-none"
              >
                <List className="h-4 w-4" />
              </Button>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={refreshData}
              disabled={loading}
            >
              <RefreshCw
                className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`}
              />
              Refresh
            </Button>
          </div>
        </div>

        {/* Active Filters */}
        {(selectedCategory || searchTerm) && (
          <div className="flex items-center gap-2 mt-4 pt-4 border-t">
            <span className="text-sm text-gray-600">Active filters:</span>
            {selectedCategory && (
              <Badge variant="secondary" className="flex items-center gap-1">
                {categories.find((cat) => cat.id === selectedCategory)?.name}
                <button
                  onClick={() => handleCategorySelect(null)}
                  className="ml-1 hover:text-red-600"
                >
                  ×
                </button>
              </Badge>
            )}
            {searchTerm && (
              <Badge variant="secondary" className="flex items-center gap-1">
                Search: {searchTerm}
                <button
                  onClick={() => setSearchTerm("")}
                  className="ml-1 hover:text-red-600"
                >
                  ×
                </button>
              </Badge>
            )}
            <Button variant="ghost" size="sm" onClick={clearFilters}>
              Clear all
            </Button>
          </div>
        )}
      </div>

      {/* Categories */}
      {showCategories && categories.length > 0 && (
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Categories</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {categories.map((category) => (
              <WooCommerceCategoryCard
                key={category.id}
                category={category}
                onClick={() => handleCategorySelect(category.id)}
                isSelected={selectedCategory === category.id}
              />
            ))}
          </div>
        </div>
      )}

      {/* Products */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-900">
            Products ({filteredProducts.length})
          </h2>
          {loading && (
            <div className="flex items-center gap-2 text-gray-600">
              <RefreshCw className="h-4 w-4 animate-spin" />
              Loading...
            </div>
          )}
        </div>

        {filteredProducts.length === 0 && !loading ? (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">No products found.</p>
            <Button onClick={clearFilters} className="mt-4">
              Clear Filters
            </Button>
          </div>
        ) : (
          <div
            className={`grid gap-6 ${
              viewMode === "grid"
                ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                : "grid-cols-1"
            }`}
          >
            {filteredProducts.map((product) => (
              <WooCommerceProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
