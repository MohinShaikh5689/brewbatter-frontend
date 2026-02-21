import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL;

const apiClient = axios.create({
  baseURL: API_BASE_URL,
});



export interface Category {
  id: string;
  name: string;
  image_url: string;
  
}

export const getCategories = async () => {
  try {
    const response = await apiClient.get('/controller');
    return response.data; 
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
};

export interface CategoryItem {
  id: string;
  name: string;
  price: number;
  description?: string;
  imageUrl?: string;
  menuItemId: string;
  created_at: string;
  updated_at: string;
}

export interface Addon {
  id: string;
  name: string;
  price: number;
  menuItemId: string;
  imageUrl?: string;
  created_at: string;
  updated_at: string;
}

export const getCategoryItems = async (categoryId: string) => {
  try {
    const response = await apiClient.get(`/controller/${categoryId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching category items:', error);
    throw error;
  }
};

export const getMenuItems = async () => {
  try {
    const response = await apiClient.get('/controller');
    return response.data;
  } catch (error) {
    console.error('Error fetching menu items:', error);
    throw error;
  }
};

export const createMenuItem = async (formData: FormData) => {
  try {
    const response = await apiClient.post('/controller', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error creating menu item:', error);
    throw error;
  }
};

export const createCategoryItem = async (categoryId: string, formData: FormData) => {
  try {
    const response = await apiClient.post(`/controller/${categoryId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error creating category item:', error);
    throw error;
  }
};

export const updateCategoryItem = async (itemTypeId: string, payload: { name: string; price: number; description?: string }) => {
  try {
    const response = await apiClient.put(`/controller/type/${itemTypeId}`, payload, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error updating category item:', error);
    throw error;
  }
};

export const deleteCategoryItem = async (itemTypeId: string) => {
  try {
    const response = await apiClient.delete(`/controller/type/${itemTypeId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting category item:', error);
    throw error;
  }
};

export interface Ingredient {
  id: string;
  name: string;
  stock: number;
  unit: 'G' | 'ML';
  reorder_level: number;
  image_url?: string;
  addons_quantity?: number;
  addon_price?: number;
  created_at: string;
  updated_at: string;
}

export interface RecipeIngredient {
  ingredientId: string;
  quantity: number;
  unit: 'G' | 'ML';
  ingredient?: Ingredient;
}

export const getRecipe = async (itemTypeId: string) => {
  try {
    const response = await apiClient.get(`/controller/recepie/${itemTypeId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching recipe:', error);
    throw error;
  }
};

export const createRecipe = async (itemTypeId: string, ingredients: { ingredientId: string; quantity: number; unit: 'G' | 'ML' }[]) => {
  try {
    console.log('Creating recipe for itemTypeId:', itemTypeId, 'with ingredients:', ingredients);
    const response = await apiClient.post(`/controller/recepie/${itemTypeId}`, ingredients, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error creating recipe:', error);
    throw error;
  }
};

export const deleteRecipe = async (itemTypeId: string) => {
  try {
    const response = await apiClient.delete(`/controller/recepie/${itemTypeId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting recipe:', error);
    throw error;
  }
};

export const getIngredients = async () => {
  try {
    const response = await apiClient.get('/controller/ingredients');
    return response.data;
  } catch (error) {
    console.error('Error fetching ingredients:', error);
    throw error;
  }
};

export const createIngredient = async (formData: FormData) => {
  try {
    const response = await apiClient.post('/controller/ingredients', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error creating ingredient:', error);
    throw error;
  }
};

export const updateIngredient = async (ingredientId: string, payload: { name: string; stock: number; unit: 'G' | 'ML'; addon_quantity?: number; addon_price?: number }) => {
  try {
    const response = await apiClient.put(`/controller/ingredients/${ingredientId}`, payload, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error updating ingredient:', error);
    throw error;
  }
};

export const deleteIngredient = async (ingredientId: string) => {
  try {
    const response = await apiClient.delete(`/controller/ingredients/${ingredientId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting ingredient:', error);
    throw error;
  }
};

// Order API
export interface Order {
  id: string;
  created_at: string;
  customerName: string;
  phone: string;
  total_amount: number;
  status: string;
}

export interface OrderItemDetail {
  id: string;
  orderId: string;
  menuItemTypeId: string | null;
  ingredientId: string | null;
  itemName: string;
  quantity: number;
  unit_price: number;
  created_at: string;
}

export interface OrderDetails {
  id: string;
  created_at: string;
  customerName: string;
  phone: string;
  total_amount: number;
  status: string;
  orderItems: OrderItemDetail[];
}

export interface OrderItem {
  itemId?: string;
  addonId?: string;
  name: string;
  quantity: number;
  price: number;
}

export const getOrders = async (page: number = 1) => {
  try {
    const response = await apiClient.get(`/controller/orders?page=${page}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching orders:', error);
    throw error;
  }
};

export const getOrderDetails = async (orderId: string) => {
  try {
    const response = await apiClient.get(`/controller/orders/${orderId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching order details:', error);
    throw error;
  }
};

export const createOrder = async (orderData: { customerName: string; phone: string; items: OrderItem[] }) => {
  try {
    const response = await apiClient.post('/controller/order', orderData, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error creating order:', error);
    throw error;
  }
};

export interface DailySale {
  date: string;
  total_sales: number;
  order_count: number;
}

export const getDailySales = async () => {
  try {
    const response = await apiClient.get('/controller/daily-sales');
    return response.data;
  } catch (error) {
    console.error('Error fetching daily sales:', error);
    throw error;
  }
};


export default apiClient;

