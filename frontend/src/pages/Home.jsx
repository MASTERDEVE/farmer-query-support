import React from "react";
import MultilingualDemo from "../components/translations";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-800 via-yellow-600 to-orange-400 relative overflow-hidden text-white">

      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        {/* Sun */}
        <div className="absolute top-10 right-10 w-40 h-40 bg-yellow-400/50 rounded-full blur-3xl animate-pulse"></div>
        {/* Clouds */}
        <div className="absolute top-1/4 left-1/4 w-64 h-32 bg-white/30 rounded-full blur-2xl animate-pulse animation-delay-1000"></div>
        <div className="absolute top-1/3 right-1/4 w-80 h-40 bg-white/20 rounded-full blur-2xl animate-pulse animation-delay-2000"></div>
        {/* Crop fields effect */}
        <div className="absolute bottom-0 left-0 w-full h-1/2 bg-green-900/40 blur-xl animate-pulse"></div>
      </div>

      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-grid-white/10"></div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col min-h-screen">

        {/* Navbar */}
        <MultilingualDemo />

        {/* Hero Section */}
        <section className="py-20 px-6">
          <div className="max-w-4xl mx-auto text-center">
            <div className="bg-black/30 backdrop-blur-xl border border-white/20 rounded-3xl p-12 shadow-2xl animate-fade-in">
              <h3 className="text-4xl md:text-5xl font-extrabold mb-4 bg-gradient-to-r from-yellow-300 via-green-200 to-white bg-clip-text text-transparent">
                Grow Smarter, Farm Better
              </h3>
              <p className="text-white/90 text-lg mb-8 max-w-2xl mx-auto font-medium">
                Harness the power of AI to get precise crop advice, weather alerts, and market insights for maximum yield.
              </p>
              <a
                href="chatbot"
                className="inline-flex items-center gap-3 bg-gradient-to-r from-yellow-400 to-green-600 hover:from-yellow-500 hover:to-green-700 text-white px-10 py-4 rounded-full font-bold shadow-2xl hover:shadow-yellow-400/50 transition-all duration-300 hover:scale-105 group"
              >
                <svg className="w-6 h-6 group-hover:rotate-12 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Start Farming Smarter
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </a>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 px-6">
          <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-10 text-center">
            <div className="bg-green-900/50 backdrop-blur-xl border border-white/20 rounded-2xl p-8 shadow-xl animate-fade-in">
              <h4 className="font-bold text-xl mb-2 text-yellow-300">Crop Advice</h4>
              <p className="text-white/80">AI-driven tips for planting, fertilization, and harvesting to maximize your yield.</p>
            </div>
            <div className="bg-green-900/50 backdrop-blur-xl border border-white/20 rounded-2xl p-8 shadow-xl animate-fade-in ">
              <h4 className="font-bold text-xl mb-2 text-yellow-300">Weather Alerts</h4>
              <p className="text-white/80">Receive timely weather forecasts to protect your crops from natural risks.</p>
            </div>
            <div className="bg-green-900/50 backdrop-blur-xl border border-white/20 rounded-2xl p-8 shadow-xl animate-fade-in ">
              <h4 className="font-bold text-xl mb-2 text-yellow-300">Market Insights</h4>
              <p className="text-white/80">Track market prices and demand trends to make smarter selling decisions.</p>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer id="contact" className="bg-green-900/70 backdrop-blur-xl border-t border-white/20 text-white p-8 mt-auto">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-yellow-400 to-green-600 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <div>
                <p className="font-semibold">Team Nova</p>
                <p className="text-white/60 text-sm">Hackathon 2025</p>
              </div>
            </div>

            <div className="flex items-center gap-6">
              <a href="mailto:example@email.com" className="flex items-center gap-2 text-white/70 hover:text-white transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
               shiny.foundergalaxy@gmail.com
              </a>
            </div>
          </div>

          <div className="border-t border-white/20 mt-6 pt-6 text-center">
            <p className="text-white/70 text-sm">
              © 2025 Farmer Query Support. Helping farmers grow smarter and sustainable.
            </p>
          </div>
        </footer>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .animate-fade-in {
          animation: fade-in 1s ease-out forwards;
        }

        .animation-delay-1000 {
          animation-delay: 1000ms;
        }

        .animation-delay-2000 {
          animation-delay: 2000ms;
        }

        .animation-delay-3000 {
          animation-delay: 3000ms;
        }

        .bg-grid-white\\/10 {
          background-image: radial-gradient(circle, rgba(255, 255, 255, 0.1) 1px, transparent 1px);
          background-size: 20px 20px;
        }
      `}</style>
    </div>
  );
}

