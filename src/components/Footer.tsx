import { AlertTriangle } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gradient-to-r from-gray-50 to-blue-50 border-t border-gray-200 py-8 mt-20">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-center gap-3 text-gray-600">
          <AlertTriangle className="w-5 h-5 text-amber-500" />
          <p className="text-sm md:text-base text-center">
            <strong>Disclaimer:</strong> For informational purposes only. Not a substitute for professional medical advice.
          </p>
        </div>
        <div className="text-center mt-4 text-gray-500 text-sm">
          © {new Date().getFullYear()} MediScan. Always consult with a healthcare professional.
        </div>
      </div>
    </footer>
  );
}
