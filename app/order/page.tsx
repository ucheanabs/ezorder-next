import OrderClient from './ui/OrderClient';
export default function Page({ searchParams }: { searchParams: Record<string,string|string[]|undefined> }){
  const get = (k:string)=> typeof searchParams?.[k] === 'string' ? String(searchParams[k]) : '';
  return <OrderClient initial={{ eventId:get('eventId'), table:get('table'), seat:get('seat'), name:get('name') }} />;
}
