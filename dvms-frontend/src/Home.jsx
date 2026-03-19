import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { isLoggedIn, logoutUser } from "./Services/authService";

const stats = [
  { value: "500+", label: "Villages Connected" },
  { value: "1M+", label: "Citizens Served" },
  { value: "50K+", label: "Applications Processed" },
  { value: "95%", label: "Satisfaction Rate" },
];

const schemes = [
  {
    icon: "🌾",
    title: "PM Kisan Samman Nidhi",
    desc: "Direct income support of ₹6,000/year to farmer families",
    tag: "Agriculture",
    color: "from-emerald-50 to-green-100 border-emerald-200",
    tagColor: "bg-emerald-100 text-emerald-700",
  },
  {
    icon: "🏠",
    title: "Pradhan Mantri Awas Yojana",
    desc: "Financial assistance for construction of pucca houses",
    tag: "Housing",
    color: "from-amber-50 to-yellow-100 border-amber-200",
    tagColor: "bg-amber-100 text-amber-700",
  },
  {
    icon: "💧",
    title: "Jal Jeevan Mission",
    desc: "Tap water connection to every rural household by 2024",
    tag: "Infrastructure",
    color: "from-sky-50 to-blue-100 border-sky-200",
    tagColor: "bg-sky-100 text-sky-700",
  },
  {
    icon: "📚",
    title: "Samagra Shiksha Abhiyan",
    desc: "Holistic education from pre-school to senior secondary level",
    tag: "Education",
    color: "from-violet-50 to-purple-100 border-violet-200",
    tagColor: "bg-violet-100 text-violet-700",
  },
  {
    icon: "🏥",
    title: "Ayushman Bharat",
    desc: "Health cover of ₹5 lakh per family per year for poor families",
    tag: "Healthcare",
    color: "from-rose-50 to-pink-100 border-rose-200",
    tagColor: "bg-rose-100 text-rose-700",
  },
  {
    icon: "⚡",
    title: "PM Saubhagya Yojana",
    desc: "Universal household electrification across rural India",
    tag: "Energy",
    color: "from-orange-50 to-amber-100 border-orange-200",
    tagColor: "bg-orange-100 text-orange-700",
  },
];

const announcements = [
  {
    date: "Feb 20, 2026",
    title: "New digital literacy camps in 50 Gram Panchayats",
    type: "New",
  },
  {
    date: "Feb 18, 2026",
    title: "Last date for PM Kisan registration extended to March 31",
    type: "Important",
  },
  {
    date: "Feb 15, 2026",
    title: "Panchayat elections scheduled for April 2026",
    type: "Update",
  },
  {
    date: "Feb 10, 2026",
    title: "Free health check-up camps starting from March 1",
    type: "New",
  },
];

const services = [
  { icon: "📋", title: "Apply for Certificates", desc: "Birth, Death, Income, Caste" },
  { icon: "💼", title: "Government Schemes", desc: "Explore & apply for benefits" },
  { icon: "📢", title: "Announcements", desc: "Village notices & updates" },
  { icon: "🗳️", title: "Panchayat Info", desc: "Members, meetings, budgets" },
  { icon: "📊", title: "Land Records", desc: "Access digital land records" },
  { icon: "🤝", title: "Grievance Portal", desc: "Register and track complaints" },
];

export default function Home() {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [loggedIn, setLoggedIn] = useState(() => isLoggedIn());
  const statsRef = useRef(null);
  const [statsVisible, setStatsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setStatsVisible(true);
      },
      { threshold: 0.3 }
    );
    if (statsRef.current) observer.observe(statsRef.current);
    return () => observer.disconnect();
  }, []);
  
  const handleLogout = () => {
    logoutUser();         // clears localStorage internally
    setLoggedIn(false);
    navigate("/login", { replace: true });
  };
  return (
    <div className="min-h-screen bg-stone-50 font-sans">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800&family=DM+Sans:wght@300;400;500;600&display=swap');
        * { font-family: 'DM Sans', sans-serif; }
        .display-font { font-family: 'Playfair Display', serif; }
        .hero-gradient {
          background: linear-gradient(135deg, rgba(20,83,45,0.88) 0%, rgba(20,83,45,0.65) 40%, rgba(0,0,0,0.2) 100%);
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-up   { animation: fadeUp 0.7s 0.00s ease both; }
        .animate-fade-up-2 { animation: fadeUp 0.7s 0.15s ease both; }
        .animate-fade-up-3 { animation: fadeUp 0.7s 0.30s ease both; }
        .animate-fade-up-4 { animation: fadeUp 0.7s 0.45s ease both; }
        .card-hover { transition: transform 0.25s ease, box-shadow 0.25s ease; }
        .card-hover:hover { transform: translateY(-4px); box-shadow: 0 20px 40px -10px rgba(0,0,0,0.12); }
      `}</style>

      {/* ── Navbar ── */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-white/95 backdrop-blur-md shadow-sm border-b border-stone-100"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-green-800 rounded-lg flex items-center justify-center shadow-md">
                <span className="text-white text-lg">🏡</span>
              </div>
              <div>
                <span
                  className={`display-font font-bold text-lg leading-none ${
                    scrolled ? "text-green-900" : "text-white"
                  }`}
                >
                  DVMS
                </span>
                <p
                  className={`text-[10px] leading-tight ${
                    scrolled ? "text-stone-500" : "text-green-100"
                  }`}
                >
                  Digital Village Management
                </p>
              </div>
            </div>

            {/* Desktop Links */}
            <div className="hidden md:flex items-center gap-8">
              {["Home", "Schemes", "Announcements"].map((item) => (
                <a
                  key={item}
                  href="#"
                  className={`text-sm font-medium transition-colors hover:text-amber-500 ${
                    scrolled ? "text-stone-700" : "text-white/90"
                  }`}
                >
                  {item}
                </a>
              ))}
              {loggedIn ? (
                <button
                  type="button"
                  onClick={handleLogout}
                  className={`text-sm font-medium transition-colors hover:text-amber-500 ${
                    scrolled ? "text-stone-700" : "text-white/90"
                  }`}
                >
                  Logout
                </button>
              ) : (
                <>
                  <Link
                    to="/login"
                    className={`text-sm font-medium transition-colors hover:text-amber-500 ${
                      scrolled ? "text-stone-700" : "text-white/90"
                    }`}
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="bg-amber-500 hover:bg-amber-400 text-green-950 font-semibold text-sm px-4 py-2 rounded-lg transition-colors"
                  >
                    Register
                  </Link>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2"
              onClick={() => setMobileMenuOpen((v) => !v)}
              aria-label="Toggle menu"
            >
              <div
                className={`w-5 h-0.5 mb-1 transition-all ${
                  scrolled ? "bg-stone-700" : "bg-white"
                }`}
              />
              <div
                className={`w-5 h-0.5 mb-1 transition-all ${
                  scrolled ? "bg-stone-700" : "bg-white"
                }`}
              />
              <div
                className={`w-5 h-0.5 transition-all ${
                  scrolled ? "bg-stone-700" : "bg-white"
                }`}
              />
            </button>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden bg-white border-t border-stone-100 py-4 px-2 space-y-2">
              {["Home", "Schemes", "Announcements"].map((item) => (
                <a
                  key={item}
                  href="#"
                  className="block text-stone-700 text-sm font-medium px-3 py-2 rounded-lg hover:bg-stone-50"
                >
                  {item}
                </a>
              ))}
              {loggedIn ? (
                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full text-left block text-stone-700 text-sm font-medium px-3 py-2 rounded-lg hover:bg-stone-50"
                >
                  Logout
                </button>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="block text-stone-700 text-sm font-medium px-3 py-2 rounded-lg hover:bg-stone-50"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="block text-center bg-amber-500 hover:bg-amber-400 text-green-950 font-semibold text-sm px-3 py-2 rounded-lg transition-colors"
                  >
                    Register
                  </Link>
                </>
              )}
            </div>
          )}
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        <div className="absolute inset-0 bg-green-900">
          <div className="absolute inset-0 opacity-20"
            style={{
              backgroundImage:
                "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
            }}
          />
        </div>
        <div className="hero-gradient absolute inset-0" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
          <div className="max-w-2xl">
            <div className="animate-fade-up inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5 mb-6">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              <span className="text-white/90 text-xs font-medium">
                Government of India Initiative
              </span>
            </div>

            <h1 className="animate-fade-up-2 display-font text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
              Digital Village <br />
              <span className="text-amber-400">Management</span> <br />
              System
            </h1>

            <p className="animate-fade-up-3 text-green-100 text-lg leading-relaxed mb-8 max-w-xl">
              Empowering rural India with seamless access to government services,
              schemes, and panchayat information — all in one place.
            </p>

            <div className="animate-fade-up-4 flex flex-wrap gap-4">
              <Link
                to="/register"
                className="bg-amber-500 hover:bg-amber-400 text-green-950 font-bold px-6 py-3 rounded-xl transition-colors shadow-lg shadow-amber-500/30"
              >
                Get Started Free
              </Link>
              <a
                href="#services"
                className="bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 text-white font-semibold px-6 py-3 rounded-xl transition-colors"
              >
                Explore Services
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats ── */}
      <section ref={statsRef} className="bg-green-800 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            {stats.map((s, i) => (
              <div key={i}>
                <p
                  className={`display-font text-3xl sm:text-4xl font-bold text-amber-400 transition-all duration-700 ${
                    statsVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                  }`}
                  style={{ transitionDelay: `${i * 100}ms` }}
                >
                  {s.value}
                </p>
                <p className="text-green-200 text-sm mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Services ── */}
      <section id="services" className="py-20 bg-stone-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-amber-600 text-sm font-semibold tracking-wider uppercase">
              What We Offer
            </span>
            <h2 className="display-font text-3xl sm:text-4xl font-bold text-green-900 mt-2">
              Our Services
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {services.map((s, i) => (
              <div
                key={i}
                className="card-hover bg-white border border-stone-100 rounded-2xl p-6 cursor-pointer"
              >
                <div className="text-3xl mb-4">{s.icon}</div>
                <h3 className="font-bold text-stone-800 mb-1">{s.title}</h3>
                <p className="text-stone-500 text-sm">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Schemes ── */}
      <section className="py-20 bg-white" id="schemes">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
            <div>
              <span className="text-amber-600 text-sm font-semibold tracking-wider uppercase">
                Benefits
              </span>
              <h2 className="display-font text-3xl sm:text-4xl font-bold text-green-900 mt-2">
                Government Schemes
              </h2>
            </div>
            <a
              href="#"
              className="self-start sm:self-auto text-green-800 hover:text-amber-600 font-semibold text-sm border-b-2 border-green-800 hover:border-amber-600 transition-colors"
            >
              View All Schemes →
            </a>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {schemes.map((scheme, i) => (
              <div
                key={i}
                className={`card-hover bg-linear-to-br ${scheme.color} border rounded-2xl p-6 cursor-pointer`}
              >
                <div className="flex items-start gap-4">
                  <div className="text-3xl shrink-0">{scheme.icon}</div>
                  <div className="flex-1 min-w-0">
                    <span
                      className={`inline-block text-xs font-semibold px-2.5 py-0.5 rounded-full mb-2 ${scheme.tagColor}`}
                    >
                      {scheme.tag}
                    </span>
                    <h3 className="font-bold text-stone-800 text-sm leading-snug mb-1">
                      {scheme.title}
                    </h3>
                    <p className="text-stone-500 text-xs leading-relaxed">{scheme.desc}</p>
                  </div>
                </div>
                <div className="mt-4 flex justify-end">
                  <span className="text-xs text-stone-400 font-medium hover:text-green-700 cursor-pointer transition-colors">
                    Apply now →
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Announcements + CTA ── */}
      <section className="py-20 bg-stone-50" id="announcements">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
            {/* Announcements */}
            <div className="lg:col-span-3">
              <span className="text-amber-600 text-sm font-semibold tracking-wider uppercase">
                Latest
              </span>
              <h2 className="display-font text-3xl font-bold text-green-900 mt-2 mb-8">
                Announcements
              </h2>

              <div className="space-y-4">
                {announcements.map((a, i) => {
                  const [mon, day, year] = a.date.split(" ");
                  return (
                    <div
                      key={i}
                      className="card-hover flex items-start gap-4 p-4 rounded-2xl border border-stone-100 hover:border-green-200 bg-white cursor-pointer"
                    >
                      <div className="shrink-0 text-center w-10">
                        <p className="text-xs text-stone-400">{mon}</p>
                        <p className="font-bold text-green-800 text-lg leading-none">
                          {day.replace(",", "")}
                        </p>
                        <p className="text-xs text-stone-400">{year}</p>
                      </div>
                      <div className="w-px bg-stone-200 self-stretch" />
                      <div className="flex-1">
                        <span
                          className={`text-xs font-semibold px-2 py-0.5 rounded-full mr-2 ${
                            a.type === "New"
                              ? "bg-green-100 text-green-700"
                              : a.type === "Important"
                              ? "bg-red-100 text-red-600"
                              : "bg-blue-100 text-blue-600"
                          }`}
                        >
                          {a.type}
                        </span>
                        <p className="text-stone-700 font-medium text-sm mt-2 leading-snug">
                          {a.title}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              <a
                href="#"
                className="inline-block mt-6 text-green-800 hover:text-amber-600 font-semibold text-sm border-b-2 border-green-800 hover:border-amber-600 transition-colors"
              >
                All Announcements →
              </a>
            </div>

            {/* CTA + Helpline */}
            <div className="lg:col-span-2 flex flex-col gap-5">
              <div className="bg-green-800 rounded-3xl p-8 text-white flex-1 relative overflow-hidden">
                <div className="absolute -right-8 -top-8 w-40 h-40 bg-white/5 rounded-full" />
                <div className="absolute -right-4 top-16 w-24 h-24 bg-amber-500/20 rounded-full" />
                <div className="relative z-10">
                  <div className="text-4xl mb-4">🌿</div>
                  <h3 className="display-font text-2xl font-bold mb-3 leading-tight">
                    Register as a Citizen Today
                  </h3>
                  <p className="text-green-200 text-sm leading-relaxed mb-6">
                    Join over 1 million citizens already accessing government services
                    digitally. Your panchayat is waiting.
                  </p>
                  <Link
                    to="/register"
                    className="block w-full bg-amber-500 hover:bg-amber-400 text-green-950 font-bold text-center py-3 rounded-xl transition-colors"
                  >
                    Create Free Account
                  </Link>
                  <p className="text-green-400 text-xs text-center mt-3">
                    No documents needed to get started
                  </p>
                </div>
              </div>

              <div className="bg-amber-50 border border-amber-100 rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-2xl">📞</span>
                  <div>
                    <p className="font-bold text-green-900 text-sm">Helpline</p>
                    <p className="text-amber-700 font-semibold text-lg leading-none">
                      1800-XXX-XXXX
                    </p>
                  </div>
                </div>
                <p className="text-stone-500 text-xs">
                  Free helpline available Mon–Sat, 9 AM to 6 PM in 12 regional languages
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="bg-green-950 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
            <div className="lg:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-9 h-9 bg-green-700 rounded-lg flex items-center justify-center">
                  <span className="text-lg">🏡</span>
                </div>
                <span className="display-font text-lg font-bold">DVMS</span>
              </div>
              <p className="text-green-300 text-sm leading-relaxed max-w-sm">
                Empowering rural India through digital governance. A Government of India
                initiative for seamless panchayat services.
              </p>
            </div>
            <div>
              <p className="font-semibold text-sm mb-4 text-amber-400">Quick Links</p>
              <div className="space-y-2">
                {["Home", "Schemes", "Certificates", "Announcements", "Grievances"].map(
                  (link) => (
                    <a
                      key={link}
                      href="#"
                      className="block text-green-300 hover:text-white text-sm transition-colors"
                    >
                      {link}
                    </a>
                  )
                )}
              </div>
            </div>
            <div>
              <p className="font-semibold text-sm mb-4 text-amber-400">Support</p>
              <div className="space-y-2">
                {["Help Center", "Contact Us", "Privacy Policy", "Terms of Service", "RTI"].map(
                  (link) => (
                    <a
                      key={link}
                      href="#"
                      className="block text-green-300 hover:text-white text-sm transition-colors"
                    >
                      {link}
                    </a>
                  )
                )}
              </div>
            </div>
          </div>

          <div className="border-t border-green-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-green-400 text-xs">
              © 2026 Ministry of Panchayati Raj, Government of India. All rights reserved.
            </p>
            <div className="flex items-center gap-2">
              <span className="text-green-400 text-xs">Made with</span>
              <span className="text-red-400">♥</span>
              <span className="text-green-400 text-xs">for rural India</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
