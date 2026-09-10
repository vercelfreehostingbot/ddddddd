import { useState } from 'react';
import { useNavigate } from 'react-router';
import { ArrowLeft, Search } from 'lucide-react';
import { useGetIncomeVouchersQuery } from '../../redux/features/incomeVouchers/incomeVouchersApi';
import { useGetExpenseVouchersQuery } from '../../redux/features/expenseVouchers/expenseVouchersApi';

export function AdminIncomeVouchersPage(){return <VoucherPage type="income"/>}
export function AdminExpenseVouchersPage(){return <VoucherPage type="expense"/>}
function VoucherPage({type}:{type:'income'|'expense'}){
 const navigate=useNavigate();const [search,setSearch]=useState('');
 const income=useGetIncomeVouchersQuery(type==='income'?{page:1,limit:100,search}: {page:1,limit:1},{skip:type!=='income'});
 const expense=useGetExpenseVouchersQuery(type==='expense'?{page:1,limit:100,search}: {page:1,limit:1},{skip:type!=='expense'});
 const rows=type==='income'?income.data?.vouchers:expense.data?.vouchers; const loading=type==='income'?income.isFetching:expense.isFetching;
 return <div className="min-h-screen bg-background p-4 sm:p-6"><div className="mx-auto max-w-7xl"><button onClick={()=>navigate('/admin/dashboard')} className="mb-5 flex items-center gap-2 text-sm font-semibold"><ArrowLeft size={17}/> Admin Dashboard</button><div className="rounded-2xl bg-surface p-5 shadow-sm"><h1 className="text-xl font-bold">{type==='income'?'Income':'Expense'} Vouchers</h1><div className="mt-4 flex items-center gap-2 rounded-lg border border-surface-border px-3"><Search size={17}/><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search voucher number, reference..." className="w-full bg-transparent py-3 text-sm outline-none"/></div><div className="mt-5 overflow-x-auto"><table className="w-full min-w-[850px] text-left text-sm"><thead><tr className="border-b border-surface-border text-text-secondary"><th className="p-3">Voucher</th><th className="p-3">Date</th><th className="p-3">Amount</th><th className="p-3">Description</th><th className="p-3">Status</th><th className="p-3">Created By</th></tr></thead><tbody>{rows?.map(v=><tr key={v.id} className="border-b border-surface-border"><td className="p-3 font-semibold">{v.voucherNumber}</td><td className="p-3">{new Date(v.date).toLocaleDateString()}</td><td className="p-3">৳{Number(v.amount).toLocaleString()}</td><td className="p-3">{v.description}</td><td className="p-3">{v.status}</td><td className="p-3">{v.createdBy?.name||'—'}</td></tr>)}</tbody></table>{loading&&<p className="p-4 text-sm text-text-secondary">Loading…</p>}{!loading&&!rows?.length&&<p className="p-6 text-center text-sm text-text-secondary">No vouchers found.</p>}</div></div></div></div>;
}
