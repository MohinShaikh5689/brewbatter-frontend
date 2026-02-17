import React, { useEffect, useState } from 'react';
import KOTTemplate from './KOTTemplate';

interface OrderItem {
  id: string;
  itemName: string;
  quantity: number;
  unit_price: number;
}

interface Order {
  id: string;
  customerName: string;
  phone: string;
  orderItems: OrderItem[];
  total_amount: number;
  status: string;
  created_at: string;
}

const KOTPreviewPage: React.FC = () => {
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Retrieve order data from sessionStorage
    const orderData = sessionStorage.getItem('kotOrderData');
    if (orderData) {
      try {
        setOrder(JSON.parse(orderData));
      } catch (error) {
        console.error('Failed to parse order data:', error);
      }
    }
    setLoading(false);

    // Auto-print after a short delay
    setTimeout(() => {
      window.print();
    }, 500);
  }, []);

  if (loading) {
    return (
      <div style={{ padding: '20px', textAlign: 'center', fontFamily: 'Arial, sans-serif' }}>
        <p>Loading KOT...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div style={{ padding: '20px', textAlign: 'center', fontFamily: 'Arial, sans-serif' }}>
        <p>No order data found.</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <KOTTemplate order={order} />
    </div>
  );
};

export default KOTPreviewPage;
