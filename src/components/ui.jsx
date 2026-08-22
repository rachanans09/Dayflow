export function Card({ children, className = "" }) {
  return (
    <div className={`bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 p-6 w-full ${className}`}>
      {children}
    </div>
  );
}

export function Button({ children, variant = "primary", className = "", ...props }) {
  const styles = {
    primary: "bg-indigo-600 hover:bg-indigo-700 text-white",
    secondary: "bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200",
    danger: "bg-red-600 hover:bg-red-700 text-white",
    success: "bg-emerald-600 hover:bg-emerald-700 text-white",
  };
  return (
    <button
      {...props}
      className={`px-4 py-2 rounded-lg font-medium transition active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed ${styles[variant] || styles.primary} ${className}`}
    >
      {children}
    </button>
  );
}

export function Input({ label, ...props }) {
  return (
    <div className="w-full mb-3">
      {label && <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">{label}</label>}
      <input
        {...props}
        className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
      />
    </div>
  );
}

export function Select({ label, children, ...props }) {
  return (
    <div className="w-full mb-3">
      {label && <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">{label}</label>}
      <select
        {...props}
        className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
      >
        {children}
      </select>
    </div>
  );
}

export function Badge({ status }) {
  const colors = {
    Pending: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
    Approved: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
    Present: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
    Rejected: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300",
    Absent: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300",
    "Half-day": "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
    "Checked In": "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
    "Checked Out": "bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300",
  };
  return (
    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${colors[status] || "bg-slate-100 text-slate-700"}`}>
      {status}
    </span>
  );
}

export function PageContainer({ children, className = "" }) {
  return <div className={`w-full px-6 py-8 ${className}`}>{children}</div>;
}

export function Spinner() {
  return <div className="animate-spin h-6 w-6 border-2 border-indigo-600 border-t-transparent rounded-full mx-auto" />;
}

export function EmptyState({ text }) {
  return <p className="text-center text-slate-400 py-8 text-sm">{text}</p>;
}