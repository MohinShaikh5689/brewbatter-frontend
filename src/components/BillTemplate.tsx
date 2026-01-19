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
 
  lines.push(' Premium Quality');
  lines.push('Food & Beverages');
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
  lines.push('BREWBATTER');
  lines.push('');
  lines.push('');
  lines.push('');
  lines.push('');

  const text = lines.join('\n');

  return (
    <div id="bill-template" className="hidden print:block" style={{ padding: '10px', margin: 0, pageBreakAfter: 'always' }}>
      <pre style={{ margin: 0, fontFamily: 'monospace', fontSize: 12, whiteSpace: 'pre-wrap', lineHeight: '1.3' }}>{text}</pre>
    </div>
  );
};

export default BillTemplate;
