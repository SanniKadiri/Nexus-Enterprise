
import React, { useState } from 'react';
import { Button, Input } from '../components/UI';
import { ArrowRight } from 'lucide-react';

interface LoginProps {
  onSuccess: () => void;
}

export const Login: React.FC<LoginProps> = ({ onSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate network request
    setTimeout(() => {
      setLoading(false);
      onSuccess();
    }, 1500);
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row font-sans">
      {/* Left: Brand Area */}
      <div className="md:w-1/2 bg-brand-yellow border-r-2 border-black p-12 flex flex-col justify-between relative overflow-hidden">
        <div className="relative z-10">
          <div className="w-12 h-12 bg-black text-white flex items-center justify-center font-black text-2xl border-2 border-white mb-8">N</div>
          <h1 className="text-6xl font-black leading-none mb-4 tracking-tighter">ENTER<br/>THE<br/>NEXUS.</h1>
          <p className="text-xl font-bold max-w-md">Secure access point for enterprise administration.</p>
        </div>

        <div className="relative z-10 font-mono text-sm space-y-2 mt-12">
           <div className="flex gap-4">
             <span className="opacity-50">LATENCY</span>
             <span className="font-bold">24ms</span>
           </div>
           <div className="flex gap-4">
             <span className="opacity-50">REGION</span>
             <span className="font-bold">US-EAST-1</span>
           </div>
           <div className="flex gap-4">
             <span className="opacity-50">ENCRYPTION</span>
             <span className="font-bold">AES-256</span>
           </div>
        </div>
        
        {/* Decorative Background Grid */}
        <div className="absolute inset-0 grid-bg opacity-20 pointer-events-none"></div>
      </div>

      {/* Right: Form Area */}
      <div className="md:w-1/2 bg-white p-12 flex items-center justify-center">
        <div className="w-full max-w-md space-y-8 animate-fade-in-up">
           <div>
             <h2 className="text-3xl font-black uppercase mb-2">AuthenticatE</h2>
             <p className="text-gray-500">Please credentials to access your workspace.</p>
           </div>

           <form onSubmit={handleSubmit} className="space-y-6">
             <Input 
               label="Work Email" 
               placeholder="name@company.com" 
               type="email" 
               value={email}
               onChange={(e) => setEmail(e.target.value)}
               required
             />
             
             <Input 
               label="Password" 
               placeholder="••••••••••••" 
               type="password" 
               value={password}
               onChange={(e) => setPassword(e.target.value)}
               required
             />

             <div className="flex items-center justify-between">
               <label className="flex items-center gap-2 cursor-pointer">
                 <div className="w-5 h-5 border-2 border-black flex items-center justify-center">
                    {/* Checkbox simulation */}
                    <div className="w-3 h-3 bg-black"></div>
                 </div>
                 <span className="text-xs font-bold uppercase">Remember Device</span>
               </label>
               <a href="#" className="text-xs font-bold uppercase hover:text-brand-yellow transition-colors bg-black text-white px-1">Reset Password</a>
             </div>

             <Button className="w-full" size="lg" disabled={loading}>
               {loading ? 'AUTHENTICATING...' : 'ACCESS DASHBOARD'}
               {!loading && <ArrowRight className="ml-2" size={20} />}
             </Button>
           </form>

           <div className="pt-8 border-t-2 border-gray-100 text-center">
             <p className="text-xs text-gray-400 font-mono">
               BY ACCESSING THIS SYSTEM YOU AGREE TO MONITORING AND LOGGING.
             </p>
           </div>
        </div>
      </div>
    </div>
  );
};
