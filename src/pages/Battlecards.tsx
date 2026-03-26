import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { LayoutDashboard, LogOut, Swords, Activity, Plus, Globe, ChevronRight, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import CompetitorModal from '../components/common/CompetitorModal';

export default function Battlecards() {
  const [userName, setUserName] = useState('');
  const [competitors, setCompetitors] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false); // 팝업창 열림/닫힘 상태
  const navigate = useNavigate();

  // 경쟁사 목록 데이터 불러오기 (성공 시 다시 불러오기 위해 별도 함수로 분리)
  const fetchCompetitors = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from('competitors')
      .select('*')
      .order('created_at', { ascending: false });
      
    if (!error && data) {
      setCompetitors(data);
    }
    setIsLoading(false);
  };

  // 사용자 정보 가져오기 및 초기 데이터 불러오기
  useEffect(() => {
    const fetchUserAndInitialData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserName(user.user_metadata?.full_name || user.email?.split('@')[0] || '사용자');
      }
      await fetchCompetitors(); // 초기 데이터 로딩
    };
    
    fetchUserAndInitialData();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  return (
    <div className="flex h-screen bg-zinc-50 overflow-hidden text-zinc-900">
      
      {/* 1. 왼쪽 사이드바 영역 */}
      <aside className="w-64 bg-white border-r border-zinc-200 flex flex-col shrink-0">
        <div className="p-6 cursor-pointer" onClick={() => navigate('/dashboard')}>
          <h1 className="text-xl font-black tracking-tighter text-zinc-900">EduComp Insight</h1>
        </div>
        
        <nav className="flex-1 px-4 space-y-2">
          <button 
            onClick={() => navigate('/dashboard')}
            className="w-full flex items-center gap-3 px-4 py-3 text-zinc-500 hover:bg-zinc-100 rounded-xl text-sm font-bold transition-colors"
          >
            <LayoutDashboard className="w-4 h-4" />
            대시보드
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 text-zinc-500 hover:bg-zinc-100 rounded-xl text-sm font-bold transition-colors">
            <Activity className="w-4 h-4" />
            인텔리전스 피드
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 bg-zinc-900 text-white rounded-xl text-sm font-bold shadow-md">
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

      {/* 2. 메인 콘텐츠 영역 (배틀카드 UI 고도화) */}
      <main className="flex-1 overflow-y-auto">
        <header className="sticky top-0 z-10 bg-zinc-50/80 backdrop-blur-md px-8 py-6 flex items-center justify-between border-b border-zinc-200">
          <div>
            <h2 className="text-2xl font-black tracking-tight mb-1">Competitive Battlecards</h2>
            <p className="text-xs font-bold text-zinc-500">영업 및 기획 전략 수립을 위한 핵심 비교 데이터</p>
          </div>
          <button 
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-5 py-3 bg-blue-600 text-white rounded-xl font-bold shadow-lg shadow-blue-600/20 hover:bg-blue-700 transition-colors active:scale-95"
          >
            <Plus className="w-4 h-4" />
            새 경쟁사 등록
          </button>
        </header>
        
        <div className="p-8 max-w-7xl mx-auto">
          {isLoading ? (
            <div className="flex justify-center py-20">
              <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : competitors.length === 0 ? (
            // 데이터가 없을 때 보여주는 빈 화면 가이드
            <div className="bg-white border border-zinc-200 rounded-[32px] p-16 text-center shadow-sm">
              <div className="w-20 h-20 bg-zinc-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <Swords className="w-10 h-10 text-zinc-300" />
              </div>
              <h3 className="text-xl font-black mb-2">등록된 배틀카드가 없습니다</h3>
              <p className="text-zinc-500 mb-8 max-w-md mx-auto leading-relaxed">
                우측 상단의 버튼을 눌러 Coursera, LinkedIn Learning 등 주요 B2B 교육 플랫폼 경쟁사를 등록하고 분석을 시작해보세요.
              </p>
              <button className="px-6 py-3 bg-zinc-900 text-white rounded-xl font-bold hover:bg-zinc-800 transition-colors">
                첫 번째 경쟁사 추가하기
              </button>
            </div>
          ) : (
            // 데이터가 있을 때 보여주는 배틀카드 그리드
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
              {competitors.map((comp) => (
                <div key={comp.id} className="bg-white rounded-[32px] p-8 border border-zinc-200 shadow-sm hover:border-blue-600 hover:shadow-xl transition-all group cursor-pointer flex flex-col h-full">
                  <div className="flex items-center gap-5 mb-8">
                    <div className="w-16 h-16 bg-zinc-50 rounded-2xl overflow-hidden border border-zinc-100 p-2 shrink-0">
                      {comp.logo_url ? (
                        <img src={comp.logo_url} alt={comp.name} className="w-full h-full object-contain" />
                      ) : (
                        <Globe className="w-full h-full text-zinc-300 p-2" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-2xl font-black tracking-tight truncate">{comp.name}</h3>
                      <p className="text-[10px] text-blue-600 font-bold uppercase tracking-widest truncate mt-1">
                        {comp.website ? comp.website.replace(/^https?:\/\//, '') : 'No Website'}
                      </p>
                    </div>
                  </div>
                  
                  <div className="space-y-6 flex-1 bg-zinc-50/50 rounded-2xl p-6 border border-zinc-100/50">
                    <div>
                      <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-2 flex items-center gap-1">
                        <TrendingUp className="w-3 h-3" /> How to Win (공략 전략)
                      </p>
                      <p className="text-sm font-bold text-zinc-800 line-clamp-2 leading-relaxed">
                        {comp.how_to_win || '등록된 공략 전략이 없습니다.'}
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-2">Core Target (핵심 타겟)</p>
                      <p className="text-sm text-zinc-600 font-medium truncate">
                        {comp.target_audience || '정보 없음'}
                      </p>
                    </div>
                  </div>
                  
                  <div className="mt-6 pt-6 border-t border-zinc-100 flex items-center justify-between">
                    <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                      상세 분석 보기
                    </span>
                    <div className="w-8 h-8 rounded-full bg-zinc-100 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
                      <ChevronRight className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
       </div>
      </main>
      
      {/* 등록하기 팝업창 (모달) */}
      {showAddModal && (
        <CompetitorModal 
          onClose={() => setShowAddModal(false)} // 닫기 버튼 눌렀을 때
          onSuccess={fetchCompetitors} // 등록 성공 시 목록 다시 불러오기
        />
      )}
    </div>
  );
}