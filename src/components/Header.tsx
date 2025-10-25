import { Activity } from 'lucide-react';

interface HeaderProps {
  activeSection: string;
  onNavigate: (section: string) => void;
}

export default function Header({ activeSection, onNavigate }: HeaderProps) {
  return (
    <header className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md z-50 shadow-sm">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div
            className="flex items-center gap-2 cursor-pointer group"
            onClick={() => onNavigate('home')}
          >
            <div className="bg-gradient-to-br from-blue-500 to-cyan-400 p-2 rounded-lg group-hover:scale-110 transition-transform duration-300">
              <Activity className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
              MediScan
            </h1>
          </div>

          <nav className="flex gap-6">
            {['home', 'about', 'contact'].map((section) => (
              <button
                key={section}
                onClick={() => onNavigate(section)}
                className={`capitalize font-medium transition-all duration-300 hover:text-blue-600 relative ${
                  activeSection === section ? 'text-blue-600' : 'text-gray-600'
                }`}
              >
                {section}
                {activeSection === section && (
                  <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full" />
                )}
              </button>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
}
