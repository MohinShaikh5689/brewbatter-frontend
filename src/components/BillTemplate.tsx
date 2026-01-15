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
    <div
      id="bill-template"
      className="hidden print:block"
      style={{
        padding: '0',
        margin: '0',
        fontFamily: 'Arial, sans-serif',
      }}
    >
      <style>{`
        @media print {
          body {
            margin: 0;
            padding: 0;
            background: white;
          }
          
          #bill-template {
            width: 80mm;
            margin: 0 auto;
            padding: 10mm;
            background: white;
            page-break-after: avoid;
          }
          
          .bill-container {
            width: 100%;
            max-width: 80mm;
          }
          
          .text-center {
            text-align: center;
          }
          
          .text-right {
            text-align: right;
          }
          
          .border-top {
            border-top: 1px dashed #333;
          }
          
          .border-bottom {
            border-bottom: 1px dashed #333;
          }
          
          table {
            width: 100%;
            border-collapse: collapse;
            margin: 8px 0;
          }
          
          td, th {
            padding: 4px 0;
            font-size: 11px;
          }
          
          th {
            text-align: left;
            border-bottom: 1px solid #333;
          }
        }
      `}</style>

      <div className="bill-container">
        {/* Header */}
        <div className="text-center mb-3" style={{ paddingBottom: '8px' }}>
          <h1
            style={{
              margin: '0 0 4px 0',
              fontSize: '18px',
              fontWeight: 'bold',
              letterSpacing: '2px',
            }}
          >
            🍶 BREWBATTER
          </h1>
          <p style={{ margin: '2px 0', fontSize: '10px', color: '#666' }}>
            Premium Quality Food & Beverages
          </p>
          <p style={{ margin: '2px 0', fontSize: '9px', color: '#999' }}>
            Taste the Craft, Experience the Quality
          </p>
        </div>

        <div style={{ borderTop: '1px dashed #333', borderBottom: '1px dashed #333', padding: '8px 0' }}>
          {/* Order Info */}
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', marginBottom: '4px' }}>
            <div>
              <strong>Bill No:</strong> {order.id.slice(0, 8).toUpperCase()}
            </div>
            <div style={{ textAlign: 'right' }}>
              <strong>Date:</strong> {formatDate(order.created_at)}
            </div>
          </div>

          {/* Customer Info */}
          <div style={{ fontSize: '11px', marginBottom: '4px' }}>
            <div>
              <strong>Customer:</strong> {order.customerName}
            </div>
            <div>
              <strong>Phone:</strong> {order.phone}
            </div>
          </div>
        </div>

        {/* Items Table */}
        <table style={{ margin: '8px 0' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #333' }}>
              <th style={{ textAlign: 'left', fontSize: '10px', paddingBottom: '4px' }}>Item</th>
              <th style={{ textAlign: 'center', fontSize: '10px', width: '30px' }}>Qty</th>
              <th style={{ textAlign: 'right', fontSize: '10px' }}>Rate</th>
              <th style={{ textAlign: 'right', fontSize: '10px' }}>Amount</th>
            </tr>
          </thead>
          <tbody>
            {order.orderItems.map((item) => (
              <tr key={item.id} style={{ borderBottom: '1px solid #f0f0f0' }}>
                <td style={{ fontSize: '10px', paddingTop: '3px', paddingBottom: '3px' }}>
                  {item.itemName}
                </td>
                <td style={{ textAlign: 'center', fontSize: '10px', paddingTop: '3px', paddingBottom: '3px' }}>
                  {item.quantity}
                </td>
                <td style={{ textAlign: 'right', fontSize: '10px', paddingTop: '3px', paddingBottom: '3px' }}>
                  ₹{item.unit_price}
                </td>
                <td style={{ textAlign: 'right', fontSize: '10px', paddingTop: '3px', paddingBottom: '3px' }}>
                  ₹{(item.quantity * item.unit_price).toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Total Section */}
        <div
          style={{
            borderTop: '1px dashed #333',
            borderBottom: '1px dashed #333',
            padding: '8px 0',
            marginTop: '8px',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px' }}>
            <span>Subtotal:</span>
            <span>₹{(order.total_amount).toFixed(2)}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px' }}>
            <span>Tax (0%):</span>
            <span>₹0.00</span>
          </div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: '13px',
              fontWeight: 'bold',
              marginTop: '4px',
              paddingTop: '4px',
              borderTop: '1px solid #333',
            }}
          >
            <span>Total Amount:</span>
            <span>₹{(order.total_amount).toFixed(2)}</span>
          </div>
        </div>

        {/* Status */}
        <div style={{ textAlign: 'center', margin: '8px 0', fontSize: '11px' }}>
          <div style={{ fontWeight: 'bold', color: '#27ae60' }}>ORDER STATUS: {order.status}</div>
        </div>

        {/* Footer */}
        <div style={{ textAlign: 'center', marginTop: '12px', paddingTop: '8px', borderTop: '1px dashed #333' }}>
          <p style={{ margin: '4px 0', fontSize: '10px', color: '#666' }}>
            Thank you for your order!
          </p>
          <p style={{ margin: '2px 0', fontSize: '9px', color: '#999' }}>
            Please keep this bill for your records
          </p>
          <p style={{ margin: '4px 0 0 0', fontSize: '8px', color: '#999' }}>
            www.brewbatter.com | Contact: +91-7208749700
          </p>
          <div style={{ marginTop: '8px', fontSize: '9px', color: '#999' }}>
            ✓ Printed on: {new Date().toLocaleString('en-IN')}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BillTemplate;
