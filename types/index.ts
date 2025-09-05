export interface Firecracker {
  id: string;
  name: string;
  price: number;
  image: string;
}

export interface CartItem {
  id: string;
  firecracker: Firecracker;
  quantity: number;
}
