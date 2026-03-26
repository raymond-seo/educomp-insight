import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { 
  LayoutDashboard, LogOut, Swords, Activity, 
  Plus, Search, ExternalLink, Clock, Tag, AlertCircle 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Feed() {
  const [userName, setUserName] = useState('');
  const [intelList, setIntelList] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      // 1. 사용자 정보 가져오기
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserName(user.user_metadata?.full_name || user.email?.split('@')[0] || '사용자');
      }

      // 2. 인텔리전스 데이터 가져오기 (경쟁사 이름까지 합쳐서 가져옵니다)
      const { data, error } = await supabase
        .from('intelligence')
        .select(`
          *,
          competitors ( name, logo_url )
        `)
        .order('created_at', { ascending: false });
        
      if (!error && data) {
        setIntelList(data);
      }
      setIsLoading(false);
    };
    
    fetchData();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  return (
    <div className="flex h-screen bg-zinc-50 overflow-hidden text-zinc-900">
      {/* 사이드바 */}
      <aside className="w-64 bg-white border-r border-zinc-200 flex flex-col shrink-0">
        <div className="p-6 cursor-pointer" onClick={() => navigate('/dashboard')}>
          <h1 className="text-xl font-black tracking-tighter text-zinc-900">EduComp Insight</h1>
        </div>
        <nav className="flex-1 px-4 space-y-2">
          <button onClick={() => navigate('/dashboard')} className="w-full flex items-center gap-3 px-4 py-3 text-zinc-500 hover:bg-zinc-100 rounded-xl text-sm font-bold transition-colors">
            <LayoutDashboard className="w-4 h-4" /> 대시보드
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 bg-zinc-900 text-white rounded-xl text-sm font-bold shadow-md">
            <Activity className="w-4 h-4" /> 인텔리전스 피드
          </button>
          <button onClick={() => navigate('/battlecards')} className="w-full flex items-center gap-3 px-4 py-3 text-zinc-500 hover:bg-zinc-100 rounded-xl text-sm font-bold transition-colors">
            <Swords className="w-4 h-4" /> 배틀카드
          </button>
        </nav>
        <div className="p-6 border-t border-zinc-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-zinc-200 rounded-full flex items-center justify-center font-bold text-xs text-zinc-600">
                {userName.charAt(0).toUpperCase()}
              </div>
              <span className="text-sm font-bold truncate max-w-[100px]">{userName}</span>
            </div>
            <button onClick={handleLogout} className="text-zinc-400 hover:text-red-500 transition-colors">
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </aside>

      {/* 메인 콘텐츠 */}
      <main className="flex-1 overflow-y-auto">
        <header className="sticky top-0 z-10 bg-zinc-50/80 backdrop-blur-md px-8 py-6 flex items-center justify-between border-b border-zinc-200">
          <div>
            <h2 className="text-2xl font-black tracking-tight mb-1">Intelligence Feed</h2>
            <p className="text-xs font-bold text-zinc-500">실시간 경쟁사 동향 및 시장 리서치 아카이브</p>
          </div>
          <button className="flex items-center gap-2 px-5 py-3 bg-blue-600 text-white rounded-xl font-bold shadow-lg shadow-blue-600/20 hover:bg-blue-700 transition-colors">
            <Plus className="w-4 h-4" /> 정보 추가
          </button>
        </header>

        <div className="p-8 max-w-5xl mx-auto">
          {isLoading ? (
            <div className="text-center py-20">로딩 중...</div>
          ) : intelList.length === 0 ? (
            <div className="bg-white border border-zinc-200 rounded-[32px] p-16 text-center shadow-sm">
              <Activity className="w-12 h-12 text-zinc-200 mx-auto mb-4" />
              <h3 className="text-xl font-black mb-2">아직 수집된 정보가 없습니다.</h3>
              <p className="text-zinc-500">우측 상단 '정보 추가'를 눌러 첫 번째 인텔리전스를 등록해보세요.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6">
              {intelList.map((intel) => (
                <div key={intel.id} className="bg-white p-8 rounded-[32px] border border-zinc-100 shadow-sm hover:shadow-md transition-shadow group">
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-zinc-50 rounded-xl overflow-hidden border border-zinc-100 p-1">
                        <img src={intel.competitors?.logo_url || "https://picsum.photos/200"} alt="" className="w-full h-full object-contain" />
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-1">{intel.competitors?.name}</p>
                        <h4 className="text-xl font-bold tracking-tight group-hover:text-blue-600 transition-colors">{intel.title}</h4>
                      </div>
                    </div>
                    {intel.priority === 'High' && (
                      <span className="px-3 py-1 bg-red-50 text-red-600 rounded-full text-[10px] font-black uppercase tracking-wider flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" /> Urgent
                      </span>
                    )}
                  </div>
                  <p className="text-zinc-600 leading-relaxed mb-8 whitespace-pre-wrap">{intel.content}</p>
                  <div className="flex items-center justify-between pt-6 border-t border-zinc-50">
                    <div className="flex items-center gap-6">
                      <div className="flex items-center gap-2 text-zinc-400">
                        <Tag className="w-3 h-3" />
                        <span className="text-[10px] font-black uppercase tracking-widest">{intel.category}</span>
                      </div>
                      <div className="flex items-center gap-2 text-zinc-400">
                        <Clock className="w-3 h-3" />
                        <span className="text-[10px] font-black uppercase tracking-widest">{new Date(intel.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                    {intel.source_url && (
                      <a href={intel.source_url} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-sm font-bold text-blue-600 hover:underline">
                        출처 확인 <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}