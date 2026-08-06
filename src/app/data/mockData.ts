export interface FoodItem {
  id: string;
  name: string;
  vendor: string;
  image: string;
  distance: number; // in km
  price: number; // 0 for free
  originalPrice: number;
  pickupTime: string;
  expiryTime: string;
  quantity: number;
  description: string;
  location: string;
  hygieneRating: number; // out of 5
  category: string;
}

export const foodItems: FoodItem[] = [
  {
    id: '1',
    name: 'Nasi Lemak Set',
    vendor: 'Warung Kak Yah',
    image: 'https://images.unsplash.com/photo-1743790769102-d0856d701466?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmcmVzaCUyMG5hc2klMjBsZW1hayUyMG1hbGF5c2lhbiUyMGZvb2R8ZW58MXx8fHwxNzcwOTY1NDQ2fDA&ixlib=rb-4.1.0&q=80&w=1080',
    distance: 0.3,
    price: 0,
    originalPrice: 8.50,
    pickupTime: '12:00 PM - 1:00 PM',
    expiryTime: '2:00 PM',
    quantity: 3,
    description: 'Fresh nasi lemak with sambal, fried chicken, egg, and anchovies. Perfect for lunch!',
    location: 'Cafeteria Building A, Ground Floor',
    hygieneRating: 5,
    category: 'Malaysian',
  },
  {
    id: '2',
    name: 'Chicken Rice',
    vendor: 'Uncle Lee Kopitiam',
    image: 'https://images.unsplash.com/photo-1668665771959-b217076ddde3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGlja2VuJTIwcmljZSUyMG1lYWx8ZW58MXx8fHwxNzcwOTY1NDQ3fDA&ixlib=rb-4.1.0&q=80&w=1080',
    distance: 0.5,
    price: 2.00,
    originalPrice: 7.00,
    pickupTime: '1:00 PM - 2:00 PM',
    expiryTime: '3:00 PM',
    quantity: 5,
    description: 'Steamed chicken rice with fresh vegetables and homemade chili sauce.',
    location: 'Library Cafeteria, Level 1',
    hygieneRating: 5,
    category: 'Chinese',
  },
  {
    id: '3',
    name: 'Veggie Wrap',
    vendor: 'Healthy Bites',
    image: 'https://images.unsplash.com/photo-1705131187470-9458824c0d79?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzYW5kd2ljaCUyMHdyYXB8ZW58MXx8fHwxNzcwOTQyNDM3fDA&ixlib=rb-4.1.0&q=80&w=1080',
    distance: 0.8,
    price: 0,
    originalPrice: 6.50,
    pickupTime: '2:00 PM - 3:00 PM',
    expiryTime: '4:00 PM',
    quantity: 2,
    description: 'Wholesome vegetarian wrap with hummus, fresh greens, and roasted vegetables.',
    location: 'Student Center Food Court',
    hygieneRating: 4,
    category: 'Vegetarian',
  },
  {
    id: '4',
    name: 'Fresh Salad Bowl',
    vendor: 'Green Garden Cafe',
    image: 'https://images.unsplash.com/photo-1620019989479-d52fcedd99fe?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmcmVzaCUyMHNhbGFkJTIwYm93bHxlbnwxfHx8fDE3NzA4OTAyODJ8MA&ixlib=rb-4.1.0&q=80&w=1080',
    distance: 1.2,
    price: 3.00,
    originalPrice: 9.00,
    pickupTime: '11:00 AM - 12:00 PM',
    expiryTime: '1:00 PM',
    quantity: 4,
    description: 'Mixed greens salad with quinoa, cherry tomatoes, and balsamic dressing.',
    location: 'Faculty of Science Canteen',
    hygieneRating: 5,
    category: 'Healthy',
  },
  {
    id: '5',
    name: 'Croissant & Pastries',
    vendor: 'Campus Bakery',
    image: 'https://images.unsplash.com/photo-1737700088850-d0b53f9d39ec?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwYXN0cnklMjBjcm9pc3NhbnQlMjBiYWtlcnl8ZW58MXx8fHwxNzcwODk3MDA1fDA&ixlib=rb-4.1.0&q=80&w=1080',
    distance: 0.4,
    price: 0,
    originalPrice: 5.00,
    pickupTime: '3:00 PM - 4:00 PM',
    expiryTime: '5:00 PM',
    quantity: 6,
    description: 'Assorted fresh pastries and butter croissants baked this morning.',
    location: 'Main Campus Bakery',
    hygieneRating: 5,
    category: 'Bakery',
  },
  {
    id: '6',
    name: 'Pizza Slices',
    vendor: 'Pizzeria Roma',
    image: 'https://images.unsplash.com/photo-1544982503-9f984c14501a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwaXp6YSUyMHNsaWNlfGVufDF8fHx8MTc3MDk1MTY3MHww&ixlib=rb-4.1.0&q=80&w=1080',
    distance: 0.6,
    price: 1.50,
    originalPrice: 5.50,
    pickupTime: '4:00 PM - 5:00 PM',
    expiryTime: '6:00 PM',
    quantity: 8,
    description: 'Margherita and pepperoni pizza slices. Still warm and delicious!',
    location: 'Engineering Faculty Cafeteria',
    hygieneRating: 4,
    category: 'Western',
  },
];
