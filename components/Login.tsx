
import React, { useState } from 'react';
import { Smartphone, Lock, ChevronRight } from 'lucide-react';

interface LoginProps {
  onLogin: () => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRequestOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setStep('otp');
      setLoading(false);
    }, 1000);
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      localStorage.setItem('agent_auth', 'true');
      onLogin();
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl overflow-hidden">
        <div className="bg-gold-gradient p-12 text-center text-slate-900">
          <h1 className="text-4xl font-serif font-bold mb-2">UBUXA</h1>
          <p className="text-sm font-medium uppercase tracking-widest opacity-80">Agent Portal</p>
        </div>
        
        <div className="p-8 lg:p-12">
          {step === 'phone' ? (
            <form onSubmit={handleRequestOtp} className="space-y-6">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-slate-900">Welcome Back</h2>
                <p className="text-slate-500 mt-2">Enter your phone number to continue</p>
              </div>
              
              <div className="relative">
                <Smartphone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <input 
                  type="tel" 
                  required
                  placeholder="Phone Number" 
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
              
              <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-slate-900 text-white py-4 rounded-2xl font-bold flex items-center justify-center space-x-2 hover:bg-slate-800 transition-colors disabled:opacity-50"
              >
                {loading ? "Sending..." : "Request OTP"}
                {!loading && <ChevronRight size={20} />}
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-6">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-slate-900">Verify Code</h2>
                <p className="text-slate-500 mt-2">Enter the 6-digit code sent to {phone}</p>
              </div>
              
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <input 
                  type="text" 
                  required
                  placeholder="Enter OTP" 
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all tracking-[0.5em] text-center text-xl font-bold"
                  value={otp}
                  maxLength={6}
                  onChange={(e) => setOtp(e.target.value)}
                />
              </div>
              
              <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-gold-gradient text-slate-900 py-4 rounded-2xl font-bold hover:opacity-90 transition-all disabled:opacity-50"
              >
                {loading ? "Verifying..." : "Sign In"}
              </button>
              
              <button 
                type="button" 
                onClick={() => setStep('phone')}
                className="w-full text-slate-500 text-sm font-medium hover:text-slate-900"
              >
                Change Phone Number
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
