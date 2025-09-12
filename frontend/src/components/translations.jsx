import { useState } from 'react';
import { Link } from 'react-router-dom';


// Translation data
const translations = {
  en: {
    navbar: {
      title: "GrowTogether",
      chatbot: "Chatbot",
      features: "Features",
      contact: "Contact"
    },
    hero: {
      badge: "AI-Powered Agricultural Assistant",
      title: "Helping Farmers",
      titleAccent: "with AI",
      subtitle: "Ask questions, get crop advice, weather updates, and government schemes instantly with our intelligent farming assistant",
      cta: "Try Chatbot Now",
      learnMore: "Learn More"
    },
    features: {
      title: "Powerful Features",
      subtitle: "Everything you need to make informed farming decisions",
      chatbot: {
        title: "AI Chatbot",
        desc: "Instant answers to all your farming queries with intelligent conversation"
      },
      crops: {
        title: "Crop Suggestions",
        desc: "Smart crop recommendations based on soil type, season, and climate"
      },
      weather: {
        title: "Weather Updates",
        desc: "Real-time weather forecasts and alerts for your farming region"
      },
      schemes: {
        title: "Govt Schemes",
        desc: "Easy access to government agricultural schemes and subsidies"
      }
    },
    stats: {
      farmers: "Farmers Helped",
      queries: "Queries Solved",
      support: "AI Support"
    }
  },
  hi: {
    navbar: {
      title: "GrowTogether",
      chatbot: "चैटबॉट",
      features: "विशेषताएं",
      contact: "संपर्क"
    },
    hero: {
      badge: "AI-संचालित कृषि सहायक",
      title: "किसानों की मदद",
      titleAccent: "AI के साथ",
      subtitle: "हमारे बुद्धिमान कृषि सहायक के साथ तुरंत प्रश्न पूछें, फसल की सलाह, मौसम अपडेट और सरकारी योजनाएं प्राप्त करें",
      cta: "अभी चैटबॉट आजमाएं",
      learnMore: "और जानें"
    },
    features: {
      title: "शक्तिशाली विशेषताएं",
      subtitle: "सूचित कृषि निर्णय लेने के लिए आवश्यक सब कुछ",
      chatbot: {
        title: "AI चैटबॉट",
        desc: "बुद्धिमान बातचीत के साथ आपके सभी कृषि प्रश्नों के तुरंत उत्तर"
      },
      crops: {
        title: "फसल सुझाव",
        desc: "मिट्टी के प्रकार, मौसम और जलवायु के आधार पर स्मार्ट फसल सिफारिशें"
      },
      weather: {
        title: "मौसम अपडेट",
        desc: "आपके कृषि क्षेत्र के लिए वास्तविक समय मौसम पूर्वानुमान और अलर्ट"
      },
      schemes: {
        title: "सरकारी योजनाएं",
        desc: "सरकारी कृषि योजनाओं और सब्सिडी तक आसान पहुंच"
      }
    },
    stats: {
      farmers: "किसानों की सहायता की",
      queries: "प्रश्न हल किए",
      support: "AI सहायता"
    }
  },
  pa: {
    navbar: {
      title: "GrowTogether",
      chatbot: "ਚੈਟਬੋਟ",
      features: "ਵਿਸ਼ੇਸ਼ਤਾਵਾਂ",
      contact: "ਸੰਪਰਕ"
    },
    hero: {
      badge: "AI-ਸੰਚਾਲਿਤ ਖੇਤੀਬਾੜੀ ਸਹਾਇਕ",
      title: "ਕਿਸਾਨਾਂ ਦੀ ਮਦਦ",
      titleAccent: "AI ਨਾਲ",
      subtitle: "ਸਾਡੇ ਬੁੱਧੀਮਾਨ ਖੇਤੀਬਾੜੀ ਸਹਾਇਕ ਨਾਲ ਤੁਰੰਤ ਸਵਾਲ ਪੁੱਛੋ, ਫਸਲ ਦੀ ਸਲਾਹ, ਮੌਸਮ ਅਪਡੇਟ ਅਤੇ ਸਰਕਾਰੀ ਸਕੀਮਾਂ ਪ੍ਰਾਪਤ ਕਰੋ",
      cta: "ਹੁਣ ਚੈਟਬੋਟ ਅਜ਼ਮਾਓ",
      learnMore: "ਹੋਰ ਜਾਣੋ"
    },
    features: {
      title: "ਸ਼ਕਤੀਸ਼ਾਲੀ ਵਿਸ਼ੇਸ਼ਤਾਵਾਂ",
      subtitle: "ਸੂਚਿਤ ਖੇਤੀਬਾੜੀ ਫੈਸਲੇ ਲੈਣ ਲਈ ਤੁਹਾਨੂੰ ਲੋੜੀਂਦਾ ਸਭ ਕੁਝ",
      chatbot: {
        title: "AI ਚੈਟਬੋਟ",
        desc: "ਬੁੱਧੀਮਾਨ ਗੱਲਬਾਤ ਨਾਲ ਤੁਹਾਡੇ ਸਾਰੇ ਖੇਤੀਬਾੜੀ ਸਵਾਲਾਂ ਦੇ ਤੁਰੰਤ ਜਵਾਬ"
      },
      crops: {
        title: "ਫਸਲ ਸੁਝਾਅ",
        desc: "ਮਿੱਟੀ ਦੀ ਕਿਸਮ, ਮੌਸਮ ਅਤੇ ਜਲਵਾਯੂ ਦੇ ਅਧਾਰ ਤੇ ਸਮਾਰਟ ਫਸਲ ਸਿਫਾਰਸ਼ਾਂ"
      },
      weather: {
        title: "ਮੌਸਮ ਅਪਡੇਟ",
        desc: "ਤੁਹਾਡੇ ਖੇਤੀਬਾੜੀ ਖੇਤਰ ਲਈ ਰੀਅਲ-ਟਾਈਮ ਮੌਸਮ ਪੂਰਵਾਨੁਮਾਨ ਅਤੇ ਚੇਤਾਵਨੀ"
      },
      schemes: {
        title: "ਸਰਕਾਰੀ ਸਕੀਮਾਂ",
        desc: "ਸਰਕਾਰੀ ਖੇਤੀਬਾੜੀ ਸਕੀਮਾਂ ਅਤੇ ਸਬਸਿਡੀ ਤੱਕ ਆਸਾਨ ਪਹੁੰਚ"
      }
    },
    stats: {
      farmers: "ਕਿਸਾਨਾਂ ਦੀ ਮਦਦ ਕੀਤੀ",
      queries: "ਸਵਾਲ ਹੱਲ ਕੀਤੇ",
      support: "AI ਸਹਾਇਤਾ"
    }
  },
  te: {
    navbar: {
      title: "GrowTogether",
      chatbot: "చాట్‌బాట్",
      features: "లక్షణాలు",
      contact: "సంప్రదించండి"
    },
    hero: {
      badge: "AI-శక్తితో నడిచే వ్యవసాయ సహాయకుడు",
      title: "రైతులకు సహాయం",
      titleAccent: "AI తో",
      subtitle: "మా తెలివైన వ్యవసాయ సహాయకుడితో తక్షణమే ప్రశ్నలు అడగండి, పంట సలహాలు, వాతావరణ నవీకరణలు మరియు ప్రభుత్వ పథకాలను పొందండి",
      cta: "ఇప్పుడే చాట్‌బాట్ ప్రయత్నించండి",
      learnMore: "మరింత తెలుసుకోండి"
    },
    features: {
      title: "శక్తివంతమైన లక్షణాలు",
      subtitle: "సమాచార వ్యవసాయ నిర్ణయాలు తీసుకోవడానికి మీకు అవసరమైన ప్రతిదీ",
      chatbot: {
        title: "AI చాట్‌బాట్",
        desc: "తెలివైన సంభాషణతో మీ అన్ని వ్యవసాయ ప్రశ్నలకు తక్షణ సమాధానాలు"
      },
      crops: {
        title: "పంట సూచనలు",
        desc: "మట్టి రకం, కాలం మరియు వాతావరణం ఆధారంగా స్మార్ట్ పంట సిఫార్సులు"
      },
      weather: {
        title: "వాతావరణ నవీకరణలు",
        desc: "మీ వ్యవసాయ ప్రాంతానికి నిజ-సమయ వాతావరణ అంచనాలు మరియు హెచ్చరికలు"
      },
      schemes: {
        title: "ప్రభుత్వ పథకాలు",
        desc: "ప్రభుత్వ వ్యవసాయ పథకాలు మరియు రాయితీలకు సులభ ప్రవేశం"
      }
    },
    stats: {
      farmers: "రైతులకు సహాయం చేశారు",
      queries: "ప్రశ్నలు పరిష్కరించబడ్డాయి",
      support: "AI మద్దతు"
    }
  }
};

// Language options with flags
const languages = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'hi', name: 'हिंदी', flag: '🇮🇳' },
  { code: 'pa', name: 'ਪੰਜਾਬੀ', flag: '🇮🇳' },
  { code: 'te', name: 'తెలుగు', flag: '🇮🇳' }
];

function LanguageSelector({ currentLang, onLanguageChange }){
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 bg-green-900/50 backdrop-blur-xl border border-white/20 rounded-full px-4 py-2 text-white hover:bg-green-900/70 transition-all duration-300 hover:scale-105"
      >
        <span className="text-lg">{languages.find(lang => lang.code === currentLang)?.flag}</span>
        <span className="hidden sm:inline">{languages.find(lang => lang.code === currentLang)?.name}</span>
        <svg className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute top-full mt-2 right-0 bg-green-900/50 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl overflow-hidden z-50 min-w-[200px]">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => {
                onLanguageChange(lang.code);
                setIsOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-green-900/70 transition-colors ${
                currentLang === lang.code ? 'bg-green-900/70 text-yellow-300' : 'text-white/80'
              }`}
            >
              <span className="text-lg">{lang.flag}</span>
              <span>{lang.name}</span>
              {currentLang === lang.code && (
                <svg className="w-4 h-4 ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function MultilingualDemo() {
  const [currentLang, setCurrentLang] = useState('en');
  const t = translations[currentLang];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-800 via-yellow-600 to-orange-400 relative overflow-hidden">
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
      <div className="relative z-10">

        {/* Navbar */}
        <header className="bg-green-900/70 backdrop-blur-xl border-b border-white/20 text-white p-6 shadow-2xl">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-green-600 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <h1 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-yellow-300 via-green-200 to-white bg-clip-text text-transparent">
                {t.navbar.title}
              </h1>
            </div>
            <div className="flex items-center gap-4">
              <nav className="hidden md:flex gap-6">
                <a href="chatbot" className="px-4 py-2 rounded-full bg-green-900/50 hover:bg-green-900/70 transition-all duration-300 hover:scale-105 border border-white/20 backdrop-blur-sm">
                  {t.navbar.chatbot}
                </a>
                <a href="#features" className="px-4 py-2 rounded-full bg-green-900/50 hover:bg-green-900/70 transition-all duration-300 hover:scale-105 border border-white/20 backdrop-blur-sm">
                  {t.navbar.features}
                </a>
                <a href="#contact" className="px-4 py-2 rounded-full bg-green-900/50 hover:bg-green-900/70 transition-all duration-300 hover:scale-105 border border-white/20 backdrop-blur-sm">
                  {t.navbar.contact}
                </a>
              </nav>
              <LanguageSelector currentLang={currentLang} onLanguageChange={setCurrentLang} />
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <section className="text-center py-20 px-6">
          <div className="max-w-5xl mx-auto">
            <div className="mb-8">
              <div className="inline-flex items-center gap-2 bg-green-900/50 backdrop-blur-xl border border-white/20 rounded-full px-6 py-3 mb-6 shadow-xl">
                <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
                <span className="text-white/90 text-sm font-medium">{t.hero.badge}</span>
              </div>
            </div>

            <h2 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-yellow-300 via-green-200 to-white bg-clip-text text-transparent leading-tight">
              {t.hero.title}
              <br />
              <span className="bg-gradient-to-r from-yellow-400 to-green-600 bg-clip-text text-transparent">
                {t.hero.titleAccent}
              </span>
            </h2>

            <p className="text-lg md:text-xl mb-10 text-white/80 max-w-3xl mx-auto leading-relaxed">
              {t.hero.subtitle}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <Link to="/chatbot" className="group bg-gradient-to-r from-yellow-400 to-green-600 hover:from-yellow-500 hover:to-green-700 text-white px-8 py-4 rounded-full font-semibold shadow-2xl hover:shadow-yellow-500/25 transition-all duration-300 hover:scale-110 flex items-center gap-3">
                {t.hero.cta}
              </Link>
              <button className="bg-green-900/50 backdrop-blur-xl border border-white/20 text-white px-8 py-4 rounded-full font-semibold hover:bg-green-900/70 transition-all duration-300 hover:scale-105 hover:shadow-xl">
                {t.hero.learnMore}
              </button>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap justify-center gap-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-300 mb-1">10K+</div>
                <div className="text-white/60 text-sm">{t.stats.farmers}</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-300 mb-1">50K+</div>
                <div className="text-white/60 text-sm">{t.stats.queries}</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-300 mb-1">24/7</div>
                <div className="text-white/60 text-sm">{t.stats.support}</div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-20 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h3 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-yellow-300 via-green-200 to-white bg-clip-text text-transparent">
                {t.features.title}
              </h3>
              <p className="text-white/70 text-lg max-w-2xl mx-auto">
                {t.features.subtitle}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { title: t.features.chatbot.title, description: t.features.chatbot.desc, icon: "💬" },
                { title: t.features.crops.title, description: t.features.crops.desc, icon: "🌾" },
                { title: t.features.weather.title, description: t.features.weather.desc, icon: "🌤️" },
                { title: t.features.schemes.title, description: t.features.schemes.desc, icon: "🏛️" },
              ].map((feature, index) => (
                <div key={index} className="bg-green-900/50 backdrop-blur-xl border border-white/20 p-8 rounded-3xl shadow-2xl hover:shadow-3xl transition-all duration-500 hover:scale-105 group animate-fade-in">
                  <div className="text-4xl mb-6 text-center">{feature.icon}</div>
                  <h4 className="font-bold text-xl mb-4 text-yellow-300">{feature.title}</h4>
                  <p className="text-white/80 leading-relaxed">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Footer */}
       
      </div>

    </div>
  );
}