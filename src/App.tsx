import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ClerkProvider } from '@clerk/clerk-react';
import './App.css';
import Dashboard from './pages/Dashboard';
import CategoryDetails from './pages/CategoryDetails';
import Ingredients from './pages/Ingredients';
import BillPreviewPage from './components/BillPreviewPage';
import { CartProvider } from './context/CartContext';
import Cart from './components/Cart';

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  console.warn('Missing Clerk Publishable Key');
}

function App() {
  return (
    <ClerkProvider publishableKey={PUBLISHABLE_KEY || ''}>
      <CartProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/category/:categoryId" element={<CategoryDetails />} />
            <Route path="/inventory" element={<Ingredients />} />
            <Route path="/bill-preview" element={<BillPreviewPage />} />
          </Routes>
          <Cart />
        </BrowserRouter>
      </CartProvider>
    </ClerkProvider>
  );
}

export default App;
