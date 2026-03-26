import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { LayoutDashboard, LogOut, Swords, Activity } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const [userName, setUserName] = useState('');
  const navigate = useNavigate();

  // 현재 로그인한 사용자의 이름 가져오기
  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserName(user.user_metadata?.full_name || user.email?.split('@')[0] || '사용자');
      }
    };
    getUser();
  }, []);

  // 로그아웃 함수
  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <div className="flex h-screen bg-zinc-50 overflow-hidden text-zinc-900">
      
      {/* 1. 왼쪽 사이드바 영역 */}
      <aside className="w-64 bg-white border-r border-zinc-200 flex flex-col">
        <div className="p-6">
          <h1 className="text-xl font-black tracking-tighter text-zinc-900">EduComp Insight</h1>
        </div>
        
        <nav className="flex-1 px-4 space-y-2">
          <button className="w-full flex items-center gap-3 px-4 py-3 bg-zinc-900 text-white rounded-xl text-sm font-bold shadow-md">
            <LayoutDashboard className="w-4 h-4" />
            대시보드
          </button>
          <button 
            onClick={() => navigate('/feed')}
            className="w-full flex items-center gap-3 px-4 py-3 text-zinc-500 hover:bg-zinc-100 rounded-xl text-sm font-bold transition-colors"
          >
            <Activity className="w-4 h-4" />
            인텔리전스 피드
          </button>
          <button 
            onClick={() => navigate('/battlecards')}
            className="w-full flex items-center gap-3 px-4 py-3 text-zinc-500 hover:bg-zinc-100 rounded-xl text-sm font-bold transition-colors"
          >
            <Swords className="w-4 h-4" />
            배틀카드
          </button>
        </nav>

        <div className="p-6 border-t border-zinc-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-zinc-200 rounded-full flex items-center justify-center font-bold text-xs text-zinc-600">
                {userName ? userName.charAt(0).toUpperCase() : 'U'}
              </div>
              <span className="text-sm font-bold truncate max-w-[100px]">{userName}</span>
            </div>
            <button onClick={handleLogout} className="text-zinc-400 hover:text-red-500 transition-colors">
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </aside>

      {/* 2. 오른쪽 메인 콘텐츠 영역 */}
      <main className="flex-1 overflow-y-auto">
        <header className="px-8 py-6 flex items-center justify-between">
          <h2 className="text-2xl font-black tracking-tight">대시보드</h2>
        </header>
        
        <div className="p-8 max-w-7xl mx-auto space-y-6">
          <div className="p-8 bg-white border border-zinc-200 rounded-3xl shadow-sm">
            <h3 className="text-lg font-bold mb-2">환영합니다, {userName}님! 👋</h3>
            <p className="text-zinc-500">
              경쟁사 분석 플랫폼의 뼈대가 성공적으로 연결되었습니다.<br/>
              왼쪽 메뉴를 클릭하면 화면이 바뀌도록 하나씩 기능을 추가해 나갈 예정입니다.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}