import { useMemo, type ComponentType } from 'react';
import { useNavigate } from 'react-router';
import { useSelector } from 'react-redux';
import { Users, WalletCards, ArrowDownToLine, ArrowUpFromLine, FileText, Settings, ShieldCheck, LogOut, RefreshCw } from 'lucide-react';
import type { RootState } from '../../redux/app/store';
import { useGetOperatorStatsQuery } from '../../redux/features/users/usersApi';
import { useGetIncomeVoucherStatsQuery } from '../../redux/features/incomeVouchers/incomeVouchersApi';
import { useGetExpenseVoucherStatsQuery } from '../../redux/features/expenseVouchers/expenseVouchersApi';
import { useLogoutMutation } from '../../redux/features/api/authApi/authApi';

export default function AdminDashboardPage() {
    const navigate = useNavigate();
    const user = useSelector((s: RootState) => s.auth.user);
    const { data: operators, isFetching: opLoading, refetch: refetchOp } = useGetOperatorStatsQuery();
    const { data: income, isFetching: inLoading, refetch: refetchIn } = useGetIncomeVoucherStatsQuery();
    const { data: expense, isFetching: exLoading, refetch: refetchEx } = useGetExpenseVoucherStatsQuery();
    const [logout, { isLoading: loggingOut }] = useLogoutMutation();

    const balance = useMemo(() => (income?.totalAmount || 0) - (expense?.totalAmount || 0), [income, expense]);
    const loading = opLoading || inLoading || exLoading;

    const refresh = () => { refetchOp(); refetchIn(); refetchEx(); };
    const doLogout = async () => { try { await logout().unwrap(); } finally { navigate('/admin', { replace: true }); } };

    const cards = [
        { label: 'Total Operators', value: operators?.totalOperators ?? 0, icon: Users, onClick: () => navigate('/admin/operators') },
        { label: 'Income Vouchers', value: income?.totalVouchers ?? 0, icon: ArrowDownToLine, onClick: () => navigate('/admin/income-vouchers') },
        { label: 'Expense Vouchers', value: expense?.totalVouchers ?? 0, icon: ArrowUpFromLine, onClick: () => navigate('/admin/expense-vouchers') },
        { label: 'Current Balance', value: `৳${balance.toLocaleString()}`, icon: WalletCards, onClick: () => navigate('/admin/reports') },
    ];

    return <div className="min-h-screen bg-background p-4 sm:p-6">
        <div className="mx-auto max-w-7xl">
            <header className="mb-6 flex flex-col gap-4 rounded-2xl bg-surface p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
                <div><div className="flex items-center gap-2"><ShieldCheck size={24}/><h1 className="text-xl font-bold text-text-primary sm:text-2xl">Admin Dashboard</h1></div><p className="mt-1 text-sm text-text-secondary">Welcome, {user?.name || 'Administrator'}</p></div>
                <div className="flex gap-2"><button onClick={refresh} className="flex items-center gap-2 rounded-lg border border-surface-border px-3 py-2 text-sm font-semibold"><RefreshCw size={16} className={loading ? 'animate-spin' : ''}/> Refresh</button><button onClick={doLogout} disabled={loggingOut} className="flex items-center gap-2 rounded-lg border border-surface-border px-3 py-2 text-sm font-semibold"><LogOut size={16}/> Logout</button></div>
            </header>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {cards.map(({label,value,icon:Icon,onClick}) => <button key={label} onClick={onClick} className="rounded-2xl bg-surface p-5 text-left shadow-sm transition hover:-translate-y-0.5"><div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-primary-soft-bg"><Icon size={22}/></div><p className="text-sm text-text-secondary">{label}</p><h2 className="mt-1 text-2xl font-bold text-text-primary">{value}</h2></button>)}
            </div>
            <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
                <div className="rounded-2xl bg-surface p-5 shadow-sm"><p className="text-sm text-text-secondary">Active Operators</p><p className="mt-2 text-2xl font-bold">{operators?.activeOperators ?? 0}</p><p className="mt-1 text-xs text-text-secondary">Inactive: {operators?.inactiveOperators ?? 0}</p></div>
                <div className="rounded-2xl bg-surface p-5 shadow-sm"><p className="text-sm text-text-secondary">Total Income</p><p className="mt-2 text-2xl font-bold">৳{(income?.totalAmount || 0).toLocaleString()}</p><p className="mt-1 text-xs text-text-secondary">Today: ৳{(income?.todayAmount || 0).toLocaleString()}</p></div>
                <div className="rounded-2xl bg-surface p-5 shadow-sm"><p className="text-sm text-text-secondary">Total Expense</p><p className="mt-2 text-2xl font-bold">৳{(expense?.totalAmount || 0).toLocaleString()}</p><p className="mt-1 text-xs text-text-secondary">Today: ৳{(expense?.todayAmount || 0).toLocaleString()}</p></div>
            </div>
            <div className="mt-6 rounded-2xl bg-surface p-5 shadow-sm"><h2 className="mb-5 text-lg font-bold">Administration</h2><div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                <AdminButton icon={Users} title="Operators" text="Manage operator accounts" onClick={() => navigate('/admin/operators')}/>
                <AdminButton icon={ArrowDownToLine} title="Income Vouchers" text="View and manage income" onClick={() => navigate('/admin/income-vouchers')}/>
                <AdminButton icon={ArrowUpFromLine} title="Expense Vouchers" text="View and manage expense" onClick={() => navigate('/admin/expense-vouchers')}/>
                <AdminButton icon={FileText} title="Reports" text="Financial summaries" onClick={() => navigate('/admin/reports')}/>
                <AdminButton icon={Settings} title="Settings" text="System configuration" onClick={() => navigate('/admin/settings')}/>
            </div></div>
        </div>
    </div>;
}
function AdminButton({icon: Icon,title,text,onClick}:{icon: ComponentType<{ size?: number }>,title:string,text:string,onClick:()=>void}) { return <button onClick={onClick} className="flex items-center gap-3 rounded-xl border border-surface-border p-4 text-left transition hover:bg-surface-border"><Icon size={21}/><div><p className="font-semibold text-text-primary">{title}</p><p className="text-xs text-text-secondary">{text}</p></div></button>; }
