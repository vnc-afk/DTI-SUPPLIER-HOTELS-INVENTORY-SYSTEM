export interface Hotel {
  id: number;
  name: string;
  location: string;
  contactPerson: string;
  status: "active" | "inactive";
}

export interface Product {
  id: number;
  name: string;
  sku: string;
  stock: number;
  price: string;
  status: "active" | "inactive" | "low";
}

export interface Consignment {
  id: number;
  productId: number;
  hotelId: number;
  quantity: number;
  datAssigned: string;
}

export interface HotelInventoryItem {
  product: string;
  hotel: string;
  stock: number;
  minStock: number;
  status: "active" | "inactive" | "low";
}

export interface InventoryContextValue {
  hotels: Hotel[];
  products: Product[];
  consignments: Consignment[];
  addHotel: (hotel: Omit<Hotel, "id">) => void;
  updateHotel: (id: number, hotel: Partial<Hotel>) => void;
  deleteHotel: (id: number) => void;
  addProduct: (product: Omit<Product, "id">) => void;
  updateProduct: (id: number, product: Partial<Product>) => void;
  deleteProduct: (id: number) => void;
  addConsignment: (productId: number, hotelId: number, quantity: number) => void;
  getHotelInventory: (hotelId?: number) => HotelInventoryItem[];
}
