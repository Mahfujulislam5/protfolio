import { useState } from "react";
import { auth } from "../../lib/firebase";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { useNavigate, Navigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { motion } from "motion/react";
import { ShieldAlert, ArrowRight, Lock } from "lucide-react";

export function AdminLogin() {
  const [error, setError] = useState("");
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  if (loading) return <div className="min-h-screen bg-[#030014] flex items-center justify-center"><div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin"></div></div>;
  if (user) return <Navigate to="/admin" replace />;

  const handleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({
        login_hint: 'mahfujul848@gmail.com'
      });
      await signInWithPopup(auth, provider);
      navigate("/admin");
    } catch (err: any) {
      setError(err.message);
    }
  }

  return (
    <div className="min-h-screen bg-[#030014] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Animated Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/20 rounded-full blur-[120px]"></div>
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-10 md:p-14 rounded-3xl max-w-md w-full flex flex-col items-center gap-8 text-center relative border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)]"
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-bl-full filter blur-2xl"></div>

        <div className="w-20 h-20 rounded-full glass border border-white/10 flex items-center justify-center relative">
          <div className="absolute inset-0 rounded-full border border-primary/50 animate-ping opacity-20"></div>
          <Lock className="w-8 h-8 text-primary shadow-primary" />
        </div>

        <div>
          <h1 className="text-3xl font-display font-bold mb-2">Control <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500">Center</span></h1>
          <p className="text-sm text-white/50 font-light">Super Admin Access Only</p>
        </div>
        
        {error && (
          <div className="w-full p-4 glass bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-sm flex items-start gap-3 text-left">
            <ShieldAlert className="w-5 h-5 shrink-0" />
            <p>{error}</p>
          </div>
        )}

        <button 
          onClick={handleLogin}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className="w-full py-4 bg-white text-black font-medium rounded-xl hover:bg-white/90 transition-all flex items-center justify-center gap-2 group shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_30px_rgba(255,255,255,0.2)]"
        >
          Sign In with Google 
          <motion.div animate={{ x: isHovered ? 4 : 0 }}>
            <ArrowRight className="w-4 h-4" />
          </motion.div>
        </button>

        <p className="text-xs text-white/30 font-medium tracking-wider">SECURE CONNECTION ESTABLISHED</p>
      </motion.div>
    </div>
  )
}
