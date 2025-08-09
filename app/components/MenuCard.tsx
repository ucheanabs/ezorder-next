'use client';
export default function MenuCard({ item, onAdd, onRemove, qty } : any) {
  return (
    <div className="card p-4 space-y-2">
      <div className="font-heading font-semibold">{item.name}</div>
      <div className="text-sm text-brand-gray">{item.category}</div>
      <div className="flex items-center justify-between pt-2">
        <span className="font-semibold">₦{item.price.toLocaleString()}</span>
        <div className="flex items-center gap-2">
          <button className="btn btn-outline" onClick={() => onRemove(item)}>-</button>
          <span className="min-w-[20px] text-center">{qty || 0}</span>
          <button className="btn btn-primary" onClick={() => onAdd(item)}>+</button>
        </div>
      </div>
    </div>
  )
}