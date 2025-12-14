
const Popup = () => {
  return (
    <div className="p-4 min-h-[200px] text-slate-800 dark:text-gray-100">
      <header className="mb-4 border-b border-gray-200 pb-2 flex items-center justify-between">
        <h1 className="text-lg font-bold text-brand-dark">Aura</h1>
        <span className="text-xs bg-brand-light text-brand-dark px-2 py-0.5 rounded-full">v1.0</span>
      </header>
      
      <main>
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
          Select any text on a webpage to see the context-aware definition.
        </p>

        <div className="space-y-2">
          <label className="flex items-center space-x-2 cursor-pointer">
            <input type="checkbox" className="form-checkbox text-brand rounded" defaultChecked />
            <span className="text-sm">Enable "Ghost" Icon</span>
          </label>
        </div>
      </main>

      <footer className="mt-6 pt-4 border-t border-gray-100 dark:border-slate-700 text-center">
        <p className="text-xs text-gray-400">
            Built with ❤️ by <span className="text-brand font-bold">Sagar Sirikonda</span>
        </p>
        <p className="text-[10px] text-gray-300 mt-1">
            Powered by Llama 3.1 & Groq
        </p>
        </footer>
    </div>
  );
};

export default Popup;