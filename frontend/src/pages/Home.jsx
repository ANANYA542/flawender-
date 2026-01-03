import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle, BarChart3, Users, Shield } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import heroDashboard from '../assets/hero-dashboard.png';

const Home = () => {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            
            <div className="relative z-10">
              <h1 className="text-5xl lg:text-7xl font-extrabold text-gray-900 tracking-tight leading-[1.1] mb-8">
                Validate your startup idea in <span className="text-blue-600">seconds</span> with AI
              </h1>
              <p className="text-xl text-gray-600 mb-10 leading-relaxed max-w-lg">
                Get instant, unbiased feedback on your business model, market fit, and pitch. Join a community of founders building the future.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/evaluate" className="inline-flex justify-center items-center px-8 py-4 bg-blue-600 text-white rounded-xl font-semibold shadow-lg shadow-blue-600/30 hover:bg-blue-700 transition-all transform hover:-translate-y-1">
                  Analyze My Idea
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
                <Link to="/feed" className="inline-flex justify-center items-center px-8 py-4 bg-gray-50 text-gray-900 rounded-xl font-semibold hover:bg-gray-100 transition-colors border border-gray-200">
                  See Example Report
                </Link>
              </div>
              <p className="mt-6 text-sm text-gray-400 flex items-center">
                 <Shield className="h-4 w-4 mr-2" /> Your data is private and secure
              </p>
            </div>

            <div className="relative lg:h-[600px] w-full bg-gray-900 rounded-2xl shadow-2xl border border-gray-800 overflow-hidden transform rotate-1 hover:rotate-0 transition-transform duration-500">
              <img src={heroDashboard} alt="AI Analytics Dashboard" className="w-full h-full object-cover opacity-90 hover:opacity-100 transition-opacity" />
            </div>

          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-10 border-y border-gray-100 bg-gray-50/50">
        <div className="max-w-7xl mx-auto px-4 text-center">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-6">Trusted by founders from</p>
            <div className="flex flex-wrap justify-center gap-x-12 gap-y-8 grayscale opacity-60">
                <span className="font-bold text-xl text-gray-600">YCombinator</span>
                <span className="font-bold text-xl text-gray-600">TechStars</span>
                <span className="font-bold text-xl text-gray-600">500Startups</span>
                <span className="font-bold text-xl text-gray-600">SeedCamp</span>
            </div>
        </div>
      </section>

      {/* How it Works */}
      <section id="how-it-works" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto mb-16">
                <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl mb-4">How it works</h2>
                <p className="text-lg text-gray-600">Go from idea to validated plan in four simple steps using our AI engine.</p>
            </div>
            
            <div className="grid md:grid-cols-4 gap-8">
                {[
                    { title: "1. Submit", desc: "Share your elevator pitch and target market details.", icon: <Users className="h-6 w-6 text-blue-600"/> },
                    { title: "2. Evaluate", desc: "Our AI analyzes market trends and viability instantly.", icon: <BarChart3 className="h-6 w-6 text-blue-600"/> },
                    { title: "3. Discuss", desc: "Get qualitative feedback from experienced peers.", icon: <Users className="h-6 w-6 text-blue-600"/> },
                    { title: "4. Improve", desc: "Refine your strategy based on data-driven insights.", icon: <CheckCircle className="h-6 w-6 text-blue-600"/> },
                ].map((step, idx) => (
                    <div key={idx} className="p-6 rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                        <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mb-6">
                            {step.icon}
                        </div>
                        <h3 className="font-bold text-lg text-gray-900 mb-2">{step.title}</h3>
                        <p className="text-sm text-gray-500 leading-relaxed">{step.desc}</p>
                    </div>
                ))}
            </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default Home;
