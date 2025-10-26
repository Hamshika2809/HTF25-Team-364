import { Heart, Shield, Zap, Users } from 'lucide-react';

export default function About() {
  const features = [
    {
      icon: Heart,
      title: 'AI-Powered Analysis',
      description: 'Advanced algorithms analyze your symptoms to provide accurate preliminary assessments.',
      color: 'from-red-400 to-pink-500',
    },
    {
      icon: Shield,
      title: 'Privacy First',
      description: 'Your health data is protected with enterprise-grade security and encryption.',
      color: 'from-blue-400 to-cyan-500',
    },
    {
      icon: Zap,
      title: 'Instant Results',
      description: 'Get immediate insights about possible conditions and recommended next steps.',
      color: 'from-yellow-400 to-orange-500',
    },
    {
      icon: Users,
      title: 'Expert Guidance',
      description: 'Connect with nearby healthcare facilities for professional medical care.',
      color: 'from-green-400 to-emerald-500',
    },
  ];

  return (
    <div className="w-full max-w-6xl mx-auto animate-fade-in">
      <div className="text-center mb-12">
        <h2 className="text-5xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
          About MediScan
        </h2>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
          MediScan is your trusted companion for understanding health symptoms and connecting with care.
          We combine cutting-edge AI technology with compassionate guidance to help you make informed health decisions.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 mb-12">
        {features.map((feature, index) => (
          <div
            key={index}
            className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border-2 border-gray-100"
            style={{
              animation: `fadeInUp 0.6s ease-out forwards`,
              animationDelay: `${index * 0.1}s`,
              opacity: 0,
            }}
          >
            <div className={`inline-block p-4 rounded-2xl bg-gradient-to-br ${feature.color} mb-4`}>
              <feature.icon className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-3">{feature.title}</h3>
            <p className="text-gray-600 leading-relaxed">{feature.description}</p>
          </div>
        ))}
      </div>

      <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-3xl p-10 border-2 border-blue-100">
        <h3 className="text-3xl font-bold text-gray-800 mb-6 text-center">Our Mission</h3>
        <p className="text-lg text-gray-700 leading-relaxed text-center max-w-4xl mx-auto mb-6">
          We believe everyone deserves access to reliable health information. MediScan bridges the gap between
          experiencing symptoms and seeking professional care, providing you with the knowledge and confidence to
          take the next step in your health journey.
        </p>
        <div className="flex justify-center">
          <div className="inline-block px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-400 text-white font-semibold rounded-full">
            Empowering Health Decisions Since 2025
          </div>
        </div>
      </div>
    </div>
  );
}
