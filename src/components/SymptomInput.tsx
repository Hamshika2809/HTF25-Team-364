


import { useState } from 'react';
import { Search, Loader2 } from 'lucide-react';

interface SymptomInputProps {
  onSubmit: (symptoms: string) => void;
  loading: boolean;
}

export default function SymptomInput({ onSubmit, loading }: SymptomInputProps) {
  const [symptoms, setSymptoms] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (symptoms.trim()) {
      onSubmit(symptoms);
    }
  };




  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="text-center mb-8 animate-fade-in">
        <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-600 bg-clip-text text-transparent">
          Describe Your Symptoms
        </h2>
        <p className="text-gray-600 text-lg">
          Tell us what you're experiencing, and we'll help identify possible conditions
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="relative group">
          <textarea
            value={symptoms}
            onChange={(e) => setSymptoms(e.target.value)}
            placeholder="Describe your symptoms in detail... (e.g., 'I have a headache, fever, and sore throat for 2 days')"
            className="w-full h-48 px-6 py-4 text-lg rounded-2xl border-2 border-gray-200 focus:border-blue-400 focus:ring-4 focus:ring-blue-100 outline-none transition-all duration-300 resize-none bg-white shadow-lg group-hover:shadow-xl placeholder-gray-400"
            disabled={loading}
          />
          <div className="absolute bottom-4 right-4 text-sm text-gray-400">
            {symptoms.length} characters
          </div>
        </div>

        <button
          type="submit"
          disabled={loading || !symptoms.trim()}
          className="w-full py-4 px-8 bg-gradient-to-r from-blue-500 to-cyan-400 text-white text-lg font-semibold rounded-2xl shadow-lg hover:shadow-2xl hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 transition-all duration-300 flex items-center justify-center gap-3 group"
        >
          {loading ? (
            <>
              <Loader2 className="w-6 h-6 animate-spin" />
              Analyzing Symptoms...
            </>
          ) : (
            <>
              <Search className="w-6 h-6 group-hover:scale-110 transition-transform" />
              Analyze Symptoms
            </>
          )}
        </button>
      </form>

      <div className="mt-8 p-6 bg-blue-50 rounded-2xl border-2 border-blue-100">
        <h3 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-blue-500"></span>
          Tips for Better Results
        </h3>
        <ul className="space-y-1 text-sm text-gray-600">
          <li>• Be as specific as possible about your symptoms</li>
          <li>• Include when symptoms started and their severity</li>
          <li>• Mention any related factors like activities or food</li>
          <li>• Note if symptoms are getting better or worse</li>
        </ul>
      </div>
    </div>
  );
}
