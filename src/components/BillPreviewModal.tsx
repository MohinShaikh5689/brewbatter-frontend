import React from 'react';

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

interface BillPreviewModalProps {
  order: Order;
  onClose: () => void;
  onPrint: () => void;
}

const BillPreviewModal: React.FC<BillPreviewModalProps> = ({ order, onClose, onPrint }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
    });
  };

  return (
    <div className="fixed inset-0 bg-black/70 z-[9999] flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-2xl max-w-md w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b bg-gray-50">
          <h2 className="text-lg font-bold text-gray-800">Order Bill Preview</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-800 text-2xl font-bold"
          >
            ✕
          </button>
        </div>

        {/* Bill Content */}
        <div className="flex-1 overflow-y-auto p-6 bg-white" style={{ fontFamily: 'Arial, sans-serif' }}>
          {/* Restaurant Header */}
          <div className="text-center mb-4 pb-4 border-b-2 border-dashed border-gray-400">
            <h1 className="text-2xl font-bold mb-1">🍶 BREWBATTER</h1>
            <p className="text-xs text-gray-600 mb-1">Premium Quality Food & Beverages</p>
            <p className="text-xs text-gray-500">Taste the Craft, Experience the Quality</p>
          </div>

          {/* Order Info */}
          <div className="text-xs space-y-2 mb-4 pb-4 border-b-2 border-dashed border-gray-400">
            <div className="flex justify-between">
              <span className="font-semibold">Bill No:</span>
              <span>{order.id.slice(0, 8).toUpperCase()}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold">Date:</span>
              <span>{formatDate(order.created_at)}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold">Customer:</span>
              <span>{order.customerName}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold">Phone:</span>
              <span>{order.phone}</span>
            </div>
          </div>

          {/* Items Table */}
          <div className="text-xs mb-4 pb-4 border-b-2 border-dashed border-gray-400">
            <div className="flex justify-between font-bold mb-2 pb-2 border-b border-gray-300">
              <span className="flex-1">Item</span>
              <span className="w-12 text-center">Qty</span>
              <span className="w-16 text-right">Rate</span>
              <span className="w-16 text-right">Amount</span>
            </div>
            {order.orderItems.map((item) => (
              <div key={item.id} className="flex justify-between mb-2 border-b border-gray-100 pb-2">
                <span className="flex-1 text-gray-700">{item.itemName}</span>
                <span className="w-12 text-center">{item.quantity}</span>
                <span className="w-16 text-right">₹{item.unit_price}</span>
                <span className="w-16 text-right font-semibold">
                  ₹{(item.quantity * item.unit_price).toFixed(2)}
                </span>
              </div>
            ))}
          </div>

          {/* Totals */}
          <div className="text-xs space-y-2 mb-4 pb-4 border-b-2 border-dashed border-gray-400">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span>₹{order.total_amount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Tax (0%):</span>
              <span>₹0.00</span>
            </div>
            <div className="flex justify-between font-bold text-sm mt-2 pt-2 border-t border-gray-400">
              <span>Total Amount:</span>
              <span className="text-green-700">₹{order.total_amount.toFixed(2)}</span>
            </div>
          </div>

          {/* Status */}
          <div className="text-center mb-4 pb-4 border-b-2 border-dashed border-gray-400">
            <span className="inline-block bg-green-100 text-green-700 px-3 py-1 rounded text-xs font-bold">
              STATUS: {order.status}
            </span>
          </div>

          {/* Footer */}
          <div className="text-center text-xs text-gray-600 space-y-1">
            <p className="font-semibold">Thank you for your order!</p>
            <p>Please keep this bill for your records</p>
            <p className="text-gray-500">www.brewbatter.com</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="border-t p-4 bg-gray-50 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 rounded-lg transition"
          >
            Close
          </button>
          <button
            onClick={onPrint}
            className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold py-2 rounded-lg transition flex items-center justify-center gap-2"
          >
            🖨️ Print Bill
          </button>
        </div>
      </div>
    </div>
  );
};

export default BillPreviewModal;
