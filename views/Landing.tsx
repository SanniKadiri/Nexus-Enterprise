
import React, { useEffect, useState } from 'react';
import { Button } from '../components/UI';
import { ArrowRight, Check, Globe, Shield, Zap, ChevronDown } from 'lucide-react';

interface LandingProps {
  onLogin: () => void;
}

export const Landing: React.FC<LandingProps> = ({ onLogin }) => {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen flex flex-col font-sans bg-white overflow-x-hidden">
      {/* Header */}
      <header className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrollY > 50 ? 'bg-white/90 backdrop-blur border-b border-black py-3' : 'bg-transparent py-6'}`}>
        <div className="container mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-3 group cursor-pointer">
            <div className="w-10 h-10 bg-brand-yellow flex items-center justify-center font-black text-2xl border-2 border-black shadow-[3px_3px_0px_0px_#000] group-hover:translate-x-[2px] group-hover:translate-y-[2px] group-hover:shadow-none transition-all">
              N
            </div>
            <span className="font-black text-2xl tracking-tighter italic">NEXUS</span>
          </div>
          
          <nav className="hidden md:flex items-center gap-8 text-sm font-bold tracking-wide">
            <a href="#" className="relative group overflow-hidden">
              <span className="block group-hover:-translate-y-full transition-transform duration-300">SOLUTIONS</span>
              <span className="absolute top-full left-0 block group-hover:-translate-y-full transition-transform duration-300 text-brand-yellow bg-black px-1">SOLUTIONS</span>
            </a>
            <a href="#" className="relative group overflow-hidden">
              <span className="block group-hover:-translate-y-full transition-transform duration-300">CASE STUDIES</span>
              <span className="absolute top-full left-0 block group-hover:-translate-y-full transition-transform duration-300 text-brand-yellow bg-black px-1">CASE STUDIES</span>
            </a>
            <a href="#" className="relative group overflow-hidden">
              <span className="block group-hover:-translate-y-full transition-transform duration-300">PRICING</span>
              <span className="absolute top-full left-0 block group-hover:-translate-y-full transition-transform duration-300 text-brand-yellow bg-black px-1">PRICING</span>
            </a>
          </nav>

          <Button onClick={onLogin} variant="primary" size="sm">
            CLIENT PORTAL
          </Button>
        </div>
      </header>

      {/* Hero Section with Parallax */}
      <main className="flex-grow">
        <section className="relative pt-40 pb-32 px-6 border-b-2 border-black bg-brand-gray overflow-hidden grid-bg">
          <div className="container mx-auto max-w-7xl grid md:grid-cols-12 gap-12 items-center relative z-10">
            
            {/* Text Content */}
            <div className="md:col-span-7" style={{ transform: `translateY(${scrollY * 0.2}px)` }}>
              <div className="mb-6 inline-flex items-center gap-2 px-3 py-1 border-2 border-black bg-white font-mono text-xs font-bold uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                v2.5 System Operational
              </div>
              
              <h1 className="text-7xl md:text-9xl font-black leading-[0.85] tracking-tighter mb-8 text-black">
                <span className="reveal-mask"><span className="block animate-[reveal_0.8s_cubic-bezier(0.77,0,0.175,1)_0.1s_forwards] translate-y-full">SCALING</span></span>
                <span className="reveal-mask"><span className="block animate-[reveal_0.8s_cubic-bezier(0.77,0,0.175,1)_0.2s_forwards] translate-y-full text-transparent bg-clip-text bg-gradient-to-br from-brand-yellow to-orange-500">WITHOUT</span></span>
                <span className="reveal-mask"><span className="block animate-[reveal_0.8s_cubic-bezier(0.77,0,0.175,1)_0.3s_forwards] translate-y-full">LIMITS.</span></span>
              </h1>
              
              <p className="text-xl md:text-2xl text-gray-600 mb-10 max-w-xl leading-relaxed font-medium animate-[fadeInUp_0.8s_0.6s_forwards] opacity-0">
                The brutally efficient SaaS boilerplate for enterprises that demand performance, multi-tenancy, and AI-driven insights.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 animate-[fadeInUp_0.8s_0.8s_forwards] opacity-0">
                <Button onClick={onLogin} size="lg" className="group bg-brand-yellow border-black text-black hover:bg-black hover:text-white">
                  START BUILDING
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
                <Button variant="outline" size="lg" className="bg-white">
                  VIEW DOCUMENTATION
                </Button>
              </div>
            </div>
            
            {/* Abstract Visual Parallax */}
            <div className="md:col-span-5 relative hidden md:block" style={{ transform: `translateY(${scrollY * -0.1}px)` }}>
              <div className="relative w-full aspect-square border-4 border-black bg-white p-8 shadow-[20px_20px_0px_0px_rgba(0,0,0,1)] transition-transform duration-500 hover:scale-[1.02]">
                <div className="absolute top-4 right-4 flex gap-2">
                   <div className="w-4 h-4 rounded-full border-2 border-black bg-red-500"></div>
                   <div className="w-4 h-4 rounded-full border-2 border-black bg-brand-yellow"></div>
                   <div className="w-4 h-4 rounded-full border-2 border-black bg-green-500"></div>
                </div>
                
                <div className="mt-8 space-y-4 font-mono text-sm">
                  <div className="p-4 bg-gray-100 border-2 border-black flex justify-between items-center">
                    <span>STATUS_CHECK</span>
                    <span className="text-green-600 font-bold">PASS</span>
                  </div>
                  <div className="p-4 bg-brand-black text-white border-2 border-black flex justify-between items-center relative -right-4 shadow-[8px_8px_0px_0px_#FFD600]">
                    <span>AI_INFERENCE</span>
                    <span className="animate-pulse">PROCESSING...</span>
                  </div>
                  <div className="p-4 bg-white border-2 border-black flex justify-between items-center">
                    <span>UPTIME</span>
                    <span className="font-bold">99.99%</span>
                  </div>
                </div>

                <div className="absolute bottom-8 left-8 right-8">
                  <div className="text-xs font-bold text-gray-400 mb-2">LIVE METRICS</div>
                  <div className="flex items-end gap-1 h-24">
                    {[40, 70, 45, 90, 60, 80, 50].map((h, i) => (
                      <div key={i} style={{ height: `${h}%` }} className="flex-1 bg-brand-yellow border border-black hover:bg-black transition-colors duration-300"></div>
                    ))}
                  </div>
                </div>
              </div>
              
              {/* Decor elements */}
              <div className="absolute -z-10 -bottom-10 -left-10 w-full h-full border-2 border-dashed border-gray-400"></div>
            </div>
          </div>
        </section>

        {/* Infinite Marquee */}
        <section className="py-10 border-b-2 border-black bg-brand-yellow overflow-hidden">
           <div className="flex w-full whitespace-nowrap overflow-hidden">
             <div className="animate-marquee flex min-w-full items-center justify-around gap-20 px-10">
               {['ACME CORP', 'NEXUS IND', 'GLOBAL TECH', 'FUTURE SYSTEMS', 'CYBERDYNE', 'MASSIVE DYNAMIC', 'UMBRELLA CORP'].map((brand, i) => (
                 <span key={i} className="text-4xl font-black tracking-widest text-brand-black opacity-80 uppercase">{brand}</span>
               ))}
               {['ACME CORP', 'NEXUS IND', 'GLOBAL TECH', 'FUTURE SYSTEMS', 'CYBERDYNE', 'MASSIVE DYNAMIC', 'UMBRELLA CORP'].map((brand, i) => (
                 <span key={`dup-${i}`} className="text-4xl font-black tracking-widest text-brand-black opacity-80 uppercase">{brand}</span>
               ))}
             </div>
           </div>
        </section>

        {/* Core Capabilities Grid */}
        <section className="py-32 bg-black text-white relative">
          <div className="container mx-auto px-6">
             <div className="flex flex-col md:flex-row justify-between items-end mb-20 border-b border-gray-800 pb-8">
                <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter">Core<br/><span className="text-brand-yellow">Capabilities</span></h2>
                <p className="text-gray-400 max-w-md text-right mt-8 md:mt-0 font-mono">Designed for scalability, security, and developer experience.</p>
             </div>
             
             <div className="grid md:grid-cols-3 gap-8">
                {[
                  { icon: Globe, title: "Global Scale", desc: "Edge-cached content delivery with sub-50ms latency worldwide." },
                  { icon: Shield, title: "Ironclad Security", desc: "SOC2 compliant architecture with automated penetration testing." },
                  { icon: Zap, title: "Generative AI", desc: "Native Gemini integration for advanced business intelligence." }
                ].map((f, i) => (
                  <div key={i} className="group relative p-8 border-2 border-gray-800 bg-gray-900 hover:bg-brand-yellow hover:border-brand-yellow transition-colors duration-300">
                    <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                      <ArrowRight className="text-black" />
                    </div>
                    <f.icon className="w-12 h-12 mb-8 text-brand-yellow group-hover:text-black transition-colors" />
                    <h3 className="text-2xl font-bold mb-4 group-hover:text-black transition-colors">{f.title}</h3>
                    <p className="text-gray-400 group-hover:text-black/80 leading-relaxed transition-colors">{f.desc}</p>
                    
                    <div className="w-full h-1 bg-gray-800 mt-8 group-hover:bg-black transition-colors"></div>
                  </div>
                ))}
             </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-32 bg-white border-b border-black px-6">
          <div className="container mx-auto max-w-4xl text-center">
            <h2 className="text-5xl md:text-6xl font-black mb-8 tracking-tighter">READY TO DEPLOY?</h2>
            <p className="text-xl text-gray-500 mb-12">Join the next generation of enterprise software. Start your trial today.</p>
            <div className="flex justify-center gap-6">
              <Button size="lg" className="px-12 py-6 text-xl" onClick={onLogin}>
                GET ACCESS NOW
              </Button>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-white py-12 px-6 font-mono text-sm">
        <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0 flex items-center gap-2">
            <div className="w-4 h-4 bg-brand-yellow border border-black"></div>
            <span className="font-bold">NEXUS SYSTEMS &copy; 2024</span>
          </div>
          <div className="flex gap-8 uppercase tracking-wider">
            <a href="#" className="hover:bg-black hover:text-white px-1">Privacy</a>
            <a href="#" className="hover:bg-black hover:text-white px-1">Terms</a>
            <a href="#" className="hover:bg-black hover:text-white px-1">Twitter</a>
          </div>
        </div>
      </footer>
    </div>
  );
};
