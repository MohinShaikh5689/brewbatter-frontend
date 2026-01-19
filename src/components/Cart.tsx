import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { createOrder, type OrderItem } from '../services/api';

export default function Cart() {
  const [isOpen, setIsOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [showCheckoutForm, setShowCheckoutForm] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [orderData, setOrderData] = useState<any>(null);
  const { items, removeFromCart, updateQuantity, clearCart, getTotalPrice, getTotalItems } = useCart();

  const handleCheckout = async () => {
    setIsProcessing(true);
    try {
      // Format cart items to order format
      const orderItems: OrderItem[] = items.map((item) => ({
        ...(item.type === 'item' ? { itemId: item.id } : { addonId: item.id }),
        quantity: item.quantity,
        price: item.price,
        name: item.name,
      }));

      const orderDataPayload = {
        customerName,
        phone,
        items: orderItems,
      };

      const response = await createOrder(orderDataPayload);
      console.log('Order successful:', response);

      setOrderData(response.order);
      setOrderSuccess(true);
      clearCart();
      setCustomerName('');
      setPhone('');
      setShowCheckoutForm(false);

      // Open bill preview in a new tab
      setTimeout(() => {
        sessionStorage.setItem('billOrderData', JSON.stringify(response.order));
        window.open('/bill-preview', 'billPreview', 'width=600,height=800');
        setIsOpen(false);
      }, 500);

      // Close success message after 2 seconds
      setTimeout(() => {
        setOrderSuccess(false);
      }, 2000);
    } catch (error) {
      console.error('Order failed:', error);
      alert('Failed to place order. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePrintBill = () => {
    window.print();
  };

  const handleCartClose = () => {
    setIsOpen(false);
  };

  if (!isOpen && getTotalItems() > 0) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-bold py-4 px-6 rounded-full shadow-2xl transition transform hover:scale-110 z-50"
      >
        🛒 Cart ({getTotalItems()}) - ₹{getTotalPrice()}
      </button>
    );
  }

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-50 flex items-end md:items-center justify-center">
        <div className="bg-white w-full md:max-w-2xl md:rounded-lg max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-800">🛒 Your Cart</h2>
          <button
            onClick={handleCartClose}
            className="text-gray-500 hover:text-gray-800 text-2xl font-bold"
          >
            ✕
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-6">
          {orderSuccess ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">✅</div>
              <p className="text-green-600 text-xl font-bold">Order Placed Successfully!</p>
              <p className="text-gray-600 mt-2">Thank you for your order.</p>
            </div>
          ) : items.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🛒</div>
              <p className="text-gray-600 text-lg">Your cart is empty</p>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <div key={item.id} className="flex items-center gap-4 bg-gray-50 p-4 rounded-lg">
                  {item.imageUrl && (
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="w-20 h-20 object-cover rounded"
                    />
                  )}
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800">{item.name}</h3>
                    <p className="text-amber-700 font-bold">₹{item.price}</p>
                    <span className="text-xs text-gray-500 uppercase">{item.type}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold w-8 h-8 rounded"
                    >
                      −
                    </button>
                    <span className="font-bold w-8 text-center">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold w-8 h-8 rounded"
                    >
                      +
                    </button>
                  </div>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-red-500 hover:text-red-700 font-bold"
                  >
                    🗑️
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && !orderSuccess && (
          <div className="border-t p-6 bg-gray-50">
            {!showCheckoutForm ? (
              <>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-xl font-bold text-gray-800">Total:</span>
                  <span className="text-2xl font-bold text-amber-700">₹{getTotalPrice()}</span>
                </div>
                <div className="flex gap-4">
                  <button
                    onClick={clearCart}
                    disabled={isProcessing}
                    className="flex-1 bg-gray-300 hover:bg-gray-400 disabled:bg-gray-200 text-gray-800 font-bold py-3 rounded-lg transition"
                  >
                    Clear Cart
                  </button>
                  <button
                    onClick={() => setShowCheckoutForm(true)}
                    disabled={isProcessing}
                    className="flex-1 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-bold py-3 rounded-lg transition"
                  >
                    Proceed to Checkout
                  </button>
                </div>
              </>
            ) : (
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-gray-800 mb-4">Customer Details</h3>
                <div>
                  <label htmlFor="customerName" className="block text-sm font-medium text-gray-700 mb-2">
                    Name *
                  </label>
                  <input
                    type="text"
                    id="customerName"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Enter your name"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Enter your phone number"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                    required
                  />
                </div>
                <div className="flex justify-between items-center py-3 border-t border-b">
                  <span className="text-lg font-bold text-gray-800">Total:</span>
                  <span className="text-xl font-bold text-amber-700">₹{getTotalPrice()}</span>
                </div>
                <div className="flex gap-4">
                  <button
                    onClick={() => setShowCheckoutForm(false)}
                    disabled={isProcessing}
                    className="flex-1 bg-gray-300 hover:bg-gray-400 disabled:bg-gray-200 text-gray-800 font-bold py-3 rounded-lg transition"
                  >
                    Back
                  </button>
                  <button
                    onClick={handleCheckout}
                    disabled={isProcessing || !customerName.trim() || !phone.trim()}
                    className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-bold py-3 rounded-lg transition"
                  >
                    {isProcessing ? 'Processing...' : 'Place Order'}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
        </div>
      </div>
    </>
  );
}
