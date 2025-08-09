'use client';

import { useState, useEffect, useMemo } from 'react';
import QRCode from 'qrcode';

export default function QRPage() {
  const [qr, setQr] = useState('');
  const eventId = 'demo-001';
  const table = '1';
  const seat = 'A';

  const orderUrl = useMemo(() => {
    if (typeof window === 'undefined') return '';
    const origin = window.location.origin;
    return `${origin}/order?eventId=${eventId}&table=${table}&seat=${seat}`;
  }, [eventId, table, seat]);

  useEffect(() => {
    if (!orderUrl) return;
    QRCode.toDataURL(orderUrl, { width: 300, margin: 2 })
      .then(setQr)
      .catch(console.error);
  }, [orderUrl]);

  return (
    <div className="section">
      <div className="max-w-xl mx-auto card p-8 flex flex-col items-center">
        <h1 className="h1 mb-2">Scan to Order</h1>
        <p className="muted mb-6">Table {table} • Seat {seat}</p>
        {qr ? (
          <img src={qr} alt="QR Code" className="shadow rounded-lg p-4 bg-white" />
        ) : (
          <div className="w-72 h-72 bg-emerald-100 animate-pulse rounded-lg" />
        )}
        <a href={orderUrl} className="btn btn-primary mt-6">Try the Ordering Flow</a>
      </div>
    </div>
  );
}
