'use client';
import { useEffect, useState } from 'react';

export default function OrderClient({ initialEventId }: { initialEventId: string }) {
  const [menu, setMenu] = useState<any[]>([]);
  const [event, setEvent] = useState<any>(null);

  useEffect(() => {
    fetch(`/api/events/${initialEventId}/menu`)
      .then(res => res.json())
      .then(data => { setMenu(data.menu || []); setEvent(data.event || null); });
  }, [initialEventId]);

  const grouped = menu.reduce((acc, item) => {
    acc[item.category] = acc[item.category] || {};
    acc[item.category][item.type] = acc[item.category][item.type] || [];
    acc[item.category][item.type].push(item);
    return acc;
  }, {} as Record<string, Record<string, any[]>>);

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">{event?.name || 'Menu'}</h1>
      {Object.keys(grouped).map(cat => (
        <div key={cat} className="mb-6">
          <h2 className="text-xl font-semibold mb-2">{cat}</h2>
          {Object.keys(grouped[cat]).map(type => (
            <div key={type} className="mb-4">
              <h3 className="text-lg font-medium">{type}</h3>
              <div className="grid grid-cols-2 gap-4">
                {grouped[cat][type].map((item, idx) => (
                  <div key={idx} className="border rounded-lg p-2">
                    {item.image && <img src={item.image} alt={item.name} className="w-full h-24 object-cover rounded mb-2" />}
                    <div className="font-semibold">{item.name}</div>
                    <div className="text-sm text-gray-500">Qty: {item.qty}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
