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
  discount?: number;
  status: string;
  created_at: string;
}

interface BillTemplateProps {
  order: Order;
}

const BillTemplate: React.FC<BillTemplateProps> = ({ order }) => {
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
 
  lines.push('----------------------------');
  lines.push(`Bill No: ${order.id.slice(0, 8).toUpperCase()}`);
  lines.push(`Date: ${formatDate(order.created_at)}`);
  lines.push(`Customer: ${order.customerName}`);
  lines.push(`Phone: ${order.phone}`);
  lines.push('----------------------------');
  lines.push(pad('Item', 9) + pad('Qty', 3, 'left') + pad('Rate', 6, 'left') + pad('Total', 8, 'left'));
  lines.push('----------------------------');

  order.orderItems.forEach((item) => {
    const rate = item.unit_price.toFixed(0);
    const itemTotal = (item.quantity * item.unit_price).toFixed(0);
    const wrappedName = wrapText(item.itemName, 9);
    
    // First line with quantity, rate and total
    lines.push(
      pad(wrappedName[0], 9) + pad(String(item.quantity), 3, 'left') + pad('₹' + rate, 6, 'left') + pad('₹' + itemTotal, 8, 'left')
    );
    
    // Additional lines for wrapped text (without quantity, rate and total)
    for (let i = 1; i < wrappedName.length; i++) {
      lines.push(pad(wrappedName[i], 9));
    }
  });

  lines.push('----------------------------');
  const subtotal = order.orderItems.reduce((s, it) => s + it.quantity * it.unit_price, 0);
  const discountAmount = order.discount || 0;
  const total = Number(order.total_amount ?? subtotal);
  
  lines.push(pad('Subtotal:', 14) + pad('', 4) + pad('₹' + subtotal.toFixed(0), 8, 'left'));
  
  // Show discount if present
  if (discountAmount > 0) {
    lines.push(pad('Discount:', 14) + pad('', 4) + pad('-₹' + discountAmount.toFixed(0), 8, 'left'));
  }
  
  lines.push(pad('TOTAL:', 14) + pad('', 4) + pad('₹' + total.toFixed(0), 8, 'left'));
  lines.push('----------------------------');


  lines.push('');
  lines.push(`Status: ${order.status}`);
  lines.push('');
  lines.push('Thank you for your order!');
  lines.push('');
  lines.push(`Contact: ${import.meta.env.VITE_CONTACT_NUMBER}`);
  lines.push('www.brewbatter.in');
  lines.push('');
  lines.push('');
  lines.push('');
  lines.push('');

  const text = lines.join('\n');

  return (
    <div id="bill-template" className="hidden print:block" style={{ padding: 0, margin: 0, width: '58mm', pageBreakAfter: 'always' }}>
      <div style={{ marginBottom: '4px', display: 'flex', flexDirection: 'column', marginLeft: '50px' }}>
        <div style={{ fontFamily: 'monospace', fontSize: 16, fontWeight: 'bold', marginLeft: '10px' }}>BREWBATTER</div>
        <div style={{ fontFamily: 'monospace', fontSize: 12, marginLeft: '5px' }}>Premium Quality</div>
        <div style={{ fontFamily: 'monospace', fontSize: 12, marginLeft: '4px' }}>Food & Beverages</div>
      </div>
      <pre style={{ margin: 0, fontFamily: 'monospace', fontSize: 14, whiteSpace: 'pre-wrap', lineHeight: '1.4', textAlign: 'left' }}>{text}</pre>
    </div>
  );
};

export default BillTemplate;
