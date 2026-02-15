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
  lines.push('--------------------------------');
  lines.push(`Bill No: ${order.id.slice(0, 8).toUpperCase()}`);
  lines.push(`Date: ${formatDate(order.created_at)}`);
  lines.push(`Customer: ${order.customerName}`);
  lines.push(`Phone: ${order.phone}`);
  lines.push('--------------------------------');
  lines.push(pad('Item', 14) + pad('Qty', 4, 'left') + pad('Rate', 8, 'left'));
  lines.push('--------------------------------');

  order.orderItems.forEach((item) => {
    const rate = item.unit_price.toFixed(0);
    const wrappedName = wrapText(item.itemName, 14);
    
    // First line with quantity and rate
    lines.push(
      pad(wrappedName[0], 14) + pad(String(item.quantity), 4, 'left') + pad('₹' + rate, 8, 'left')
    );
    
    // Additional lines for wrapped text (without quantity and rate)
    for (let i = 1; i < wrappedName.length; i++) {
      lines.push(pad(wrappedName[i], 14));
    }
  });

  lines.push('--------------------------------');
  const subtotal = Number(order.total_amount ?? order.orderItems.reduce((s, it) => s + it.quantity * it.unit_price, 0));
  lines.push(pad('TOTAL:', 14) + pad('', 4) + pad('₹' + subtotal.toFixed(0), 8, 'left'));
  lines.push('--------------------------------');

  lines.push('');
  lines.push(`Status: ${order.status}`);
  lines.push('');
  lines.push('Thank you for your order!');
  lines.push('');
  lines.push('Contact: +91-7208749700');
  lines.push('www.brewbatter.com');
  lines.push('');

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
          <div style={{ marginBottom: '8px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <img src="/assets/react.svg" alt="Logo" style={{ width: '40px', height: '40px' }} />
            <div style={{ fontFamily: 'monospace', fontSize: 16, fontWeight: 'bold' }}>BREWBATTER</div>
            <div style={{ fontFamily: 'monospace', fontSize: 12 }}>Premium Quality</div>
            <div style={{ fontFamily: 'monospace', fontSize: 12 }}>Food & Beverages</div>
          </div>
          <pre style={{ margin: 0, fontFamily: 'monospace', fontSize: 14, lineHeight: 1.5, whiteSpace: 'pre-wrap', wordWrap: 'break-word', textAlign: 'left' }}>
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
