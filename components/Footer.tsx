export default function Footer() {
  return (
    <footer className="mt-20 border-t border-white/5 py-10 px-4 md:px-8 text-center text-sm text-white/50">
      <div className="max-w-[1600px] mx-auto flex flex-col md:flex-row md:justify-between items-center gap-4">
        <p>© 2026 StreamVault. Content provided by P.</p>
        <ul className="flex gap-6">
          <li className="hover:text-white cursor-pointer transition-colors">About</li>
          <li className="hover:text-white cursor-pointer transition-colors">Contact</li>
          <li className="hover:text-white cursor-pointer transition-colors">Privacy</li>
        </ul>
      </div>
    </footer>
  );
}
