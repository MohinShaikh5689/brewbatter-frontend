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
    return date.toLocaleString('en-IN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  };

  const pad = (s: string, length: number, dir: 'left' | 'right' = 'right') => {
    const str = s ?? '';
    if (str.length > length) return str.slice(0, length);
    return dir === 'right' ? str.padEnd(length, ' ') : str.padStart(length, ' ');
  };

  const wrapText = (text: string, maxLength: number): string[] => {
    if (text.length <= maxLength) return [text];
    const words = text.split(' ');
    const lines: string[] = [];
    let currentLine = '';

    words.forEach((word) => {
      if ((currentLine + word).length <= maxLength) {
        currentLine += (currentLine ? ' ' : '') + word;
      } else {
        if (currentLine) lines.push(currentLine);
        currentLine = word;
      }
    });
    if (currentLine) lines.push(currentLine);
    return lines;
  };

  const lines: string[] = [];
  lines.push('BREWBATTER');
  lines.push('Premium Quality Food & Beverages');
  lines.push('Taste the Craft, Experience the Quality');
  lines.push('');
  lines.push('----------------------------');
  lines.push(`Bill No: ${order.id.slice(0, 8).toUpperCase()}`);
  lines.push(`Date: ${formatDate(order.created_at)}`);
  lines.push(`Customer: ${order.customerName}`);
  lines.push(`Phone: ${order.phone}`);
  lines.push('----------------------------');
  lines.push(pad('Item', 18) + ' ' + pad('Qty', 3, 'left') + ' ' + pad('Rate', 6, 'left'));
  lines.push('');

  order.orderItems.forEach((item) => {
    const rate = item.unit_price.toFixed(2);
    const wrappedName = wrapText(item.itemName, 18);
    
    // First line with quantity and rate
    lines.push(
      pad(wrappedName[0], 18) + ' ' + pad(String(item.quantity), 3, 'left') + ' ' + pad(rate, 6, 'left')
    );
    
    // Additional lines for wrapped text (without quantity and rate)
    for (let i = 1; i < wrappedName.length; i++) {
      lines.push(pad(wrappedName[i], 18));
    }
  });

  lines.push('');
  const subtotal = Number(order.total_amount ?? order.orderItems.reduce((s, it) => s + it.quantity * it.unit_price, 0));
  lines.push(pad('Total:', 18) + ' ' + pad('', 3) + ' ' + pad(subtotal.toFixed(2), 6, 'left'));

  lines.push('');
  lines.push(`ORDER STATUS: ${order.status}`);
  lines.push('');
  lines.push('Thank you for your order!');
  lines.push('Please keep this bill for your');
  lines.push('records');
  lines.push('Contact: +91-7208749700');
  lines.push('www.brewbatter.com');
  lines.push('');
  lines.push(`Printed on: ${new Date().toLocaleString('en-IN')}`);

  const billText = lines.join('\n');

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
        <div className="flex-1 overflow-y-auto p-6 bg-white">
          <pre style={{ margin: 0, fontFamily: 'monospace', fontSize: 11, lineHeight: 1.4, whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}>
            {billText}
          </pre>
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
