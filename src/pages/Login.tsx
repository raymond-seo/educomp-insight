import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { BarChart3, User, Loader2 } from 'lucide-react';

export default function Login() {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      // Supabase 이메일 로그인 실행
      const { error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });
      
      if (error) throw error;
    } catch (error) {
      console.error("로그인 에러:", error);
      alert("로그인 중 문제가 발생했습니다. 관리자에게 문의하세요.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-50 p-6">
      <div className="w-full max-w-md bg-white rounded-3xl p-10 shadow-xl shadow-zinc-200/50 border border-zinc-100 text-center">
        
        {/* 로고 영역 */}
        <div className="w-16 h-16 bg-zinc-900 rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-lg shadow-zinc-900/20">
          <BarChart3 className="w-8 h-8 text-white" />
        </div>
        
        {/* 타이틀 및 설명 */}
        <h1 className="text-3xl font-bold text-zinc-900 mb-2 tracking-tight">EduComp Insight</h1>
        <p className="text-zinc-500 mb-10 leading-relaxed">
          국내외 교육 플랫폼 경쟁사 분석 도구입니다.<br/>
          팀 협업을 위해 사내 구글 계정으로 로그인해 주세요.
        </p>
        
       {/* 로그인 양식 */}
        <form onSubmit={handleLogin} className="space-y-4 text-left">
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest ml-1">Email Address</label>
            <input 
              type="email" 
              required 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@company.com" 
              className="w-full p-4 bg-zinc-50 border border-zinc-200 rounded-2xl outline-none focus:border-zinc-900 transition-all" 
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest ml-1">Password</label>
            <input 
              type="password" 
              required 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••" 
              className="w-full p-4 bg-zinc-50 border border-zinc-200 rounded-2xl outline-none focus:border-zinc-900 transition-all" 
            />
          </div>
          <button 
            type="submit"
            disabled={isLoading}
            className="w-full py-5 bg-zinc-900 text-white rounded-2xl font-bold shadow-xl shadow-zinc-900/10 hover:bg-zinc-800 transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <User className="w-5 h-5" />}
            {isLoading ? '로그인 중...' : '로그인'}
          </button>
        </form>
        
        {/* 하단 안내 문구 */}
        <p className="mt-8 text-xs text-zinc-400">
          접근 권한이 없으신 경우 담당자에게 문의 바랍니다.
        </p>
        
      </div>
    </div>
  );
}