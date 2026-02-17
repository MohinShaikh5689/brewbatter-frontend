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

interface KOTTemplateProps {
  order: Order;
}

const KOTTemplate: React.FC<KOTTemplateProps> = ({ order }) => {
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

  lines.push('==============================');
  lines.push('        KITCHEN ORDER TICKET');
  lines.push('==============================');
  lines.push(`Order ID: ${order.id.slice(0, 8).toUpperCase()}`);
  lines.push(`Time: ${formatDate(order.created_at)}`);
  lines.push(`Customer: ${order.customerName}`);
  lines.push('==============================');
  lines.push('ITEMS TO PREPARE:');
  lines.push('------------------------------');

  order.orderItems.forEach((item, index) => {
    const wrappedName = wrapText(item.itemName, 20);
    
    // First line with quantity
    lines.push(`${index + 1}. ${pad(wrappedName[0], 20)} x${item.quantity}`);
    
    // Additional lines for wrapped text
    for (let i = 1; i < wrappedName.length; i++) {
      lines.push(`   ${pad(wrappedName[i], 20)}`);
    }
  });

  lines.push('------------------------------');
  lines.push('');
  lines.push('Special Instructions: None');
  lines.push('');
  lines.push('==============================');
  lines.push('Print Time & Verify Order');
  lines.push('==============================');

  const preStyle: React.CSSProperties = {
    margin: 0,
    fontFamily: 'monospace',
    fontSize: 14,
    whiteSpace: 'pre-wrap',
    lineHeight: '1.4',
    textAlign: 'left',
  };

  const text = lines.join('\n');

  return (
    <div id="kot-template" className="hidden print:block" style={{ padding: 0, margin: 0, width: '58mm', pageBreakAfter: 'always' }}>
      <div style={{ marginBottom: '4px', display: 'flex', flexDirection: 'column', marginLeft: '50px' }}>
        <div style={{ fontFamily: 'monospace', fontSize: 16, fontWeight: 'bold', marginLeft: '10px' }}>BREWBATTER</div>
        <div style={{ fontFamily: 'monospace', fontSize: 12, marginLeft: '5px' }}>KITCHEN ORDER</div>
        <div style={{ fontFamily: 'monospace', fontSize: 12, marginLeft: '4px' }}>TICKET</div>
      </div>
      <pre style={preStyle}>{text}</pre>
    </div>
  );
};

export default KOTTemplate;
