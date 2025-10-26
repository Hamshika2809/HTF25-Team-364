import { useState } from 'react';
import { AlertCircle, ChevronDown, ChevronUp } from 'lucide-react';

interface Condition {
  name: string;
  confidence: number;
  severity: string;
  remedies: string[];
}

interface ConditionCardProps {
  condition: Condition;
  index: number;
}

export default function ConditionCard({ condition, index }: ConditionCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);

  const getSeverityColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'low':
        return 'from-green-400 to-emerald-500';
      case 'medium':
        return 'from-yellow-400 to-orange-500';
      case 'high':
        return 'from-red-400 to-rose-500';
      default:
        return 'from-blue-400 to-cyan-500';
    }
  };

  const getSeverityBg = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'low':
        return 'bg-green-50 border-green-200';
      case 'medium':
        return 'bg-yellow-50 border-yellow-200';
      case 'high':
        return 'bg-red-50 border-red-200';
      default:
        return 'bg-blue-50 border-blue-200';
    }
  };

  return (
    <div
      className="perspective-1000"
      style={{
        animation: `fadeInUp 0.5s ease-out forwards`,
        animationDelay: `${index * 0.1}s`,
        opacity: 0,
      }}
    >
      <div
        className={`relative bg-white rounded-2xl shadow-lg border-2 transition-transform duration-500 cursor-pointer ${getSeverityBg(
          condition.severity
        )}`}
        style={{
          transformStyle: 'preserve-3d',
          transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
        }}
        onClick={() => setIsFlipped(!isFlipped)}
      >
        {/* Front */}
        <div
          className="p-6 backface-hidden"
          style={{ backfaceVisibility: 'hidden' }}
        >
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg bg-gradient-to-br ${getSeverityColor(condition.severity)}`}>
                <AlertCircle className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-800">{condition.name}</h3>
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-600">Confidence</span>
                <span className="text-sm font-bold text-gray-800">{condition.confidence}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
                <div
                  className={`h-full bg-gradient-to-r ${getSeverityColor(condition.severity)} transition-all duration-1000 rounded-full`}
                  style={{ width: `${condition.confidence}%` }}
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-sm font-medium text-gray-600">Severity</span>
              <span
                className={`px-3 py-1 rounded-full text-xs font-bold uppercase bg-gradient-to-r ${getSeverityColor(
                  condition.severity
                )} text-white`}
              >
                {condition.severity}
              </span>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-gray-200 flex items-center justify-center text-sm text-gray-500">
            <span>Click to view remedies</span>
            <ChevronDown className="w-4 h-4 ml-1 transition-transform" />
          </div>
        </div>

        {/* Back */}
        <div
          className="p-6 backface-hidden"
          style={{
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
          }}
        >
          <h4 className="text-lg font-bold text-gray-800 mb-4">General Safe Remedies</h4>
          <ul className="space-y-2">
            {condition.remedies.map((remedy, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span
                  className={`mt-1.5 w-1.5 h-1.5 rounded-full bg-gradient-to-r ${getSeverityColor(condition.severity)}`}
                />
                <span className="text-sm text-gray-700">{remedy}</span>
              </li>
            ))}
          </ul>

          <div className="mt-6 pt-4 border-t border-gray-200 flex items-center justify-center text-sm text-gray-500">
            <span>Click to go back</span>
            <ChevronUp className="w-4 h-4 ml-1 transition-transform" />
          </div>
        </div>
      </div>
    </div>
  );
}
