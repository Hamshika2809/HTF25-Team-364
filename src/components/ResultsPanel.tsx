import ConditionCard from './ConditionCard';
import { MapPin, RefreshCw } from 'lucide-react';

interface Condition {
  name: string;
  confidence: number;
  severity: string;
  remedies: string[];
}

interface ResultsPanelProps {
  conditions: Condition[];
  onReset: () => void;
  onFindHospitals: () => void;
}

export default function ResultsPanel({ conditions, onReset, onFindHospitals }: ResultsPanelProps) {
  return (
    <div className="w-full max-w-6xl mx-auto animate-fade-in">
      <div className="text-center mb-8">
        <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
          Analysis Results
        </h2>
        <p className="text-gray-600 text-lg">
          Based on your symptoms, here are possible conditions
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-8">
        {conditions.map((condition, index) => (
          <ConditionCard key={index} condition={condition} index={index} />
        ))}
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <button
          onClick={onFindHospitals}
          className="px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-400 text-white font-semibold rounded-2xl shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 flex items-center justify-center gap-3 group"
        >
          <MapPin className="w-5 h-5 group-hover:scale-110 transition-transform" />
          Find Nearby Hospitals
        </button>

        <button
          onClick={onReset}
          className="px-8 py-4 bg-gradient-to-r from-gray-500 to-gray-600 text-white font-semibold rounded-2xl shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 flex items-center justify-center gap-3 group"
        >
          <RefreshCw className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" />
          New Analysis
        </button>
      </div>

      <div className="mt-8 p-6 bg-amber-50 rounded-2xl border-2 border-amber-200">
        <p className="text-center text-gray-700">
          <strong>Important:</strong> These results are AI-generated suggestions. Please consult a healthcare professional for accurate diagnosis and treatment.
        </p>
      </div>
    </div>
  );
}
