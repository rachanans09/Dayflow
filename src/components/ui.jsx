export function Card({ children, className = "" }) {
  return (
    <div
      className={`bg-white/80 dark:bg-slate-800/80 backdrop-blur-md rounded-2xl shadow-sm hover:shadow-md border border-slate-200/60 dark:border-slate-700/60 p-6 transition-all duration-300 ${className}`}
    >
      {children}
    </div>
  );
}

export function Button({ children, variant = "primary", className = "", ...props }) {
  const styles = {
    primary:
      "bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white shadow-md shadow-indigo-500/20 hover:shadow-indigo-500/30",
    secondary:
      "bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 active:scale-95",
    danger:
      "bg-rose-600 hover:bg-rose-700 active:scale-95 text-white shadow-md shadow-rose-500/20",
    success:
      "bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white shadow-md shadow-emerald-500/20",
  };
  return (
    <button
      {...props}
      className={`px-4 py-2.5 rounded-xl font-semibold text-sm transition-all duration-200 inline-flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none ${
        styles[variant] || styles.primary
      } ${className}`}
    >
      {children}
    </button>
  );
}

export function Input({ label, ...props }) {
  return (
    <div className="w-full mb-3 text-left">
      {label && (
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
          {label}
        </label>
      )}
      <input
        {...props}
        className="w-full px-3.5 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50/50 dark:bg-slate-900/50 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white dark:focus:bg-slate-900 transition-all duration-200 shadow-inner"
      />
    </div>
  );
}

export function Badge({ status }) {
  const colors = {
    Pending: "bg-amber-100/80 text-amber-700 border-amber-300 dark:bg-amber-900/40 dark:text-amber-300 dark:border-amber-700/50",
    Approved: "bg-emerald-100/80 text-emerald-700 border-emerald-300 dark:bg-emerald-900/40 dark:text-emerald-300 dark:border-emerald-700/50",
    Present: "bg-emerald-100/80 text-emerald-700 border-emerald-300 dark:bg-emerald-900/40 dark:text-emerald-300 dark:border-emerald-700/50",
    Rejected: "bg-rose-100/80 text-rose-700 border-rose-300 dark:bg-rose-900/40 dark:text-rose-300 dark:border-rose-700/50",
    Absent: "bg-rose-100/80 text-rose-700 border-rose-300 dark:bg-rose-900/40 dark:text-rose-300 dark:border-rose-700/50",
    "Half-day": "bg-sky-100/80 text-sky-700 border-sky-300 dark:bg-sky-900/40 dark:text-sky-300 dark:border-sky-700/50",
  };
  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-semibold border backdrop-blur-xs inline-flex items-center gap-1.5 ${
        colors[status] || "bg-slate-100 text-slate-700 border-slate-200"
      }`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
      {status}
    </span>
  );
}

export function PageContainer({ children, className = "" }) {
  return <div className={`w-full max-w-5xl mx-auto p-4 md:p-8 space-y-6 ${className}`}>{children}</div>;
}

export function Spinner() {
  return (
    <div className="flex justify-center items-center py-12">
      <div className="relative w-8 h-8">
        <div className="absolute inset-0 rounded-full border-2 border-indigo-200 dark:border-indigo-900"></div>
        <div className="absolute inset-0 rounded-full border-2 border-indigo-600 border-t-transparent animate-spin"></div>
      </div>
    </div>
  );
}

export function EmptyState({ text }) {
  return (
    <div className="text-center py-12 bg-slate-50/50 dark:bg-slate-900/30 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700">
      <i className="bi bi-inbox text-3xl text-slate-300 dark:text-slate-600 mb-2 block"></i>
      <p className="text-sm font-medium text-slate-400 dark:text-slate-500">{text}</p>
    </div>
  );
}