"use client";

import { createContext, useMemo, useState, useCallback, type ReactNode } from "react";
import { InventoryContext } from "./inventory.context";
import type {
  Hotel,
  Product,
  Consignment,
  HotelInventoryItem,
  InventoryContextValue,
} from "./inventory-context.types";

export type { Hotel, Product, Consignment, HotelInventoryItem, InventoryContextValue };

export function InventoryProvider({ children }: { children: ReactNode }) {
  const initialHotels: Hotel[] = [
    {
      id: 1,
      name: "Grand Plaza Hotel",
      location: "Manila",
      contactPerson: "Juan Reyes",
      status: "active",
    },
    {
      id: 2,
      name: "Seaside Resort",
      location: "Boracay",
      contactPerson: "Carlos Lim",
      status: "active",
    },
    {
      id: 3,
      name: "Mountain View Inn",
      location: "Tagaytay",
      contactPerson: "Rosa Dela Cruz",
      status: "active",
    },
  ];

  const initialProducts: Product[] = [
    {
      id: 1,
      name: "Premium Pillows",
      sku: "PIL-001",
      stock: 50,
      price: "₱599",
      status: "active",
    },
    {
      id: 2,
      name: "Egyptian Cotton Sheets",
      sku: "SHE-001",
      stock: 10,
      price: "₱1,299",
      status: "low",
    },
    {
      id: 3,
      name: "Hotel Grade Shampoo",
      sku: "SHP-001",
      stock: 0,
      price: "₱249",
      status: "inactive",
    },
  ];

  const [hotels, setHotels] = useState<Hotel[]>(initialHotels);
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [consignments, setConsignments] = useState<Consignment[]>([]);

  const addHotel = useCallback((hotel: Omit<Hotel, "id">) => {
    const newHotel: Hotel = {
      ...hotel,
      id: Math.max(...hotels.map((h) => h.id), 0) + 1,
    };
    setHotels((prev) => [...prev, newHotel]);
  }, [hotels]);

  const updateHotel = useCallback((id: number, updates: Partial<Hotel>) => {
    setHotels((prev) =>
      prev.map((hotel) => (hotel.id === id ? { ...hotel, ...updates } : hotel))
    );
  }, []);

  const deleteHotel = useCallback((id: number) => {
    setHotels((prev) => prev.filter((hotel) => hotel.id !== id));
  }, []);

  const addProduct = useCallback((product: Omit<Product, "id">) => {
    const newProduct: Product = {
      ...product,
      id: Math.max(...products.map((p) => p.id), 0) + 1,
    };
    setProducts((prev) => [...prev, newProduct]);
  }, [products]);

  const updateProduct = useCallback((id: number, updates: Partial<Product>) => {
    setProducts((prev) =>
      prev.map((product) => (product.id === id ? { ...product, ...updates } : product))
    );
  }, []);

  const deleteProduct = useCallback((id: number) => {
    setProducts((prev) => prev.filter((product) => product.id !== id));
  }, []);

  const addConsignment = useCallback(
    (productId: number, hotelId: number, quantity: number) => {
      const product = products.find((p) => p.id === productId);
      if (!product) return;

      const newConsignment: Consignment = {
        id: Math.max(...consignments.map((c) => c.id), 0) + 1,
        productId,
        hotelId,
        quantity,
        datAssigned: new Date().toISOString().split("T")[0],
      };
      setConsignments((prev) => [...prev, newConsignment]);

      // Decrease product stock
      updateProduct(productId, {
        stock: product.stock - quantity,
      });
    },
    [consignments, products, updateProduct]
  );

  const getHotelInventory = useCallback(
    (hotelId?: number) => {
      const inventory: HotelInventoryItem[] = consignments
        .filter((c) => !hotelId || c.hotelId === hotelId)
        .map((consignment) => {
          const product = products.find((p) => p.id === consignment.productId);
          const hotel = hotels.find((h) => h.id === consignment.hotelId);
          const stock = consignment.quantity;

          return {
            product: product?.name || "Unknown",
            hotel: hotel?.name || "Unknown",
            stock,
            minStock: 15,
            status: stock === 0 ? "inactive" : stock < 15 ? "low" : "active",
          };
        });

      return inventory;
    },
    [consignments, products, hotels]
  );

  const value = useMemo<InventoryContextValue>(
    () => ({
      hotels,
      products,
      consignments,
      addHotel,
      updateHotel,
      deleteHotel,
      addProduct,
      updateProduct,
      deleteProduct,
      addConsignment,
      getHotelInventory,
    }),
    [
      hotels,
      products,
      consignments,
      addHotel,
      updateHotel,
      deleteHotel,
      addProduct,
      updateProduct,
      deleteProduct,
      addConsignment,
      getHotelInventory,
    ]
  );

  return (
    <InventoryContext.Provider value={value}>{children}</InventoryContext.Provider>
  );
}
