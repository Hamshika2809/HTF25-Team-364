import { useState } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import SymptomInput from './components/SymptomInput';
import ResultsPanel from './components/ResultsPanel';
import HospitalMap from './components/HospitalMap';
import Chatbot from './components/Chatbot';
import About from './components/About';
import Contact from './components/Contact';
import { supabase } from './lib/supabase';

interface Condition {
  name: string;
  confidence: number;
  severity: string;
  remedies: string[];
}

function App() {
  const [activeSection, setActiveSection] = useState('home');
  const [conditions, setConditions] = useState<Condition[]>([]);
  const [loading, setLoading] = useState(false);
  const [showHospitals, setShowHospitals] = useState(false);

  const handleSymptomSubmit = async (symptoms: string) => {
    setLoading(true);
    try {
      const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/analyze-symptoms`;
      const headers = {
        'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
      };

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers,
        body: JSON.stringify({ symptoms }),
      });

      if (!response.ok) {
        throw new Error('Failed to analyze symptoms');
      }

      const data = await response.json();
      setConditions(data.conditions);

      await supabase.from('symptom_analyses').insert({
        symptoms,
        conditions: data.conditions,
      });
    } catch (error) {
      console.error('Error analyzing symptoms:', error);
      setConditions([
        {
          name: 'Analysis Error',
          confidence: 0,
          severity: 'low',
          remedies: ['Please try again or consult a healthcare professional'],
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setConditions([]);
  };

  const handleFindHospitals = () => {
    setShowHospitals(true);
  };

  const renderContent = () => {
    if (activeSection === 'about') {
      return <About />;
    }

    if (activeSection === 'contact') {
      return <Contact />;
    }

    return (
      <div className="w-full">
        {conditions.length === 0 ? (
          <SymptomInput onSubmit={handleSymptomSubmit} loading={loading} />
        ) : (
          <ResultsPanel
            conditions={conditions}
            onReset={handleReset}
            onFindHospitals={handleFindHospitals}
          />
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header activeSection={activeSection} onNavigate={setActiveSection} />

      <main className="flex-1 container mx-auto px-6 py-24 flex items-center justify-center">
        {renderContent()}
      </main>

      <Footer />
      <Chatbot onSymptomSubmit={handleSymptomSubmit} />

      {showHospitals && <HospitalMap onClose={() => setShowHospitals(false)} />}
    </div>
  );
}

export default App;
