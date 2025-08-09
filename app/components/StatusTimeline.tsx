export default function StatusTimeline({ status } : { status: string }){
  const steps = ['PLACED', 'PREPARING', 'ON_THE_WAY', 'DELIVERED'];
  return (
    <ol className="grid md:grid-cols-4 gap-3">
      {steps.map((s, i) => {
        const done = steps.indexOf(status) >= i;
        return (
          <li key={s} className={`card p-4 text-center font-semibold ${done ? 'bg-emerald-50 border-emerald-200' : ''}`}>
            {s.replaceAll('_', ' ')}
          </li>
        )
      })}
    </ol>
  )
}