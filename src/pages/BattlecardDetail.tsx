import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { 
  ArrowLeft, Globe, Target, Lightbulb, 
  AlertTriangle, MessageSquare, ShieldCheck, 
  ExternalLink, Calendar, User, TrendingUp
} from 'lucide-react';

export default function BattlecardDetail() {
  const { id } = useParams(); // URL에서 경쟁사 ID 추출
  const navigate = useNavigate();
  const [comp, setComp] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDetail = async () => {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('competitors')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error("데이터 로드 실패:", error);
        alert("데이터를 불러올 수 없습니다.");
        navigate('/battlecards');
      } else {
        setComp(data);
      }
      setIsLoading(false);
    };

    fetchDetail();
  }, [id, navigate]);

  if (isLoading) return <div className="min-h-screen flex items-center justify-center bg-zinc-50">로딩 중...</div>;
  if (!comp) return null;

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900 pb-20">
      {/* 상단 네비게이션 헤더 */}
      <header className="sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b border-zinc-200 px-8 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <button 
            onClick={() => navigate('/battlecards')}
            className="flex items-center gap-2 text-zinc-500 hover:text-zinc-900 font-bold transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            목록으로 돌아가기
          </button>
          <div className="flex items-center gap-4 text-xs font-bold text-zinc-400">
            <span className="flex items-center gap-1"><Calendar className="w-3 h-3"/> 업데이트: {new Date(comp.updated_at).toLocaleDateString()}</span>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-8 mt-12">
        {/* 1. 핵심 요약 섹션 */}
        <section className="bg-white rounded-[40px] p-12 border border-zinc-200 shadow-sm mb-10 flex flex-col md:flex-row gap-12 items-start">
          <div className="w-32 h-32 bg-zinc-50 rounded-[32px] border border-zinc-100 p-4 shrink-0 flex items-center justify-center shadow-inner">
            {comp.logo_url ? <img src={comp.logo_url} alt="" className="w-full h-full object-contain" /> : <Globe className="w-12 h-12 text-zinc-200" />}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-4 mb-4">
              <h1 className="text-5xl font-black tracking-tighter">{comp.name}</h1>
              {comp.website && (
                <a href={comp.website} target="_blank" rel="noreferrer" className="p-2 bg-zinc-100 rounded-full hover:bg-zinc-200 transition-colors">
                  <ExternalLink className="w-5 h-5 text-zinc-500" />
                </a>
              )}
            </div>
            <p className="text-xl text-zinc-500 font-medium leading-relaxed max-w-3xl mb-8">
              {comp.description || "등록된 회사 설명이 없습니다."}
            </p>
            <div className="flex flex-wrap gap-3">
              {comp.tags?.map((tag: string) => (
                <span key={tag} className="px-4 py-2 bg-blue-50 text-blue-600 rounded-full text-sm font-bold border border-blue-100">#{tag}</span>
              ))}
            </div>
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* 2. 핵심 전략 카드 (좌측 2열 차지) */}
          <div className="lg:col-span-2 space-y-10">
            {/* How to Win 섹션 */}
            <div className="bg-zinc-900 rounded-[40px] p-10 text-white shadow-2xl shadow-zinc-900/20">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 bg-zinc-800 rounded-xl flex items-center justify-center text-yellow-400 shadow-lg">
                  <TrendingUp className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-black tracking-tight uppercase italic">How To Win</h3>
              </div>
              <p className="text-xl font-bold leading-relaxed text-zinc-100 whitespace-pre-wrap">
                {comp.how_to_win || "등록된 전략이 없습니다."}
              </p>
            </div>

            {/* Talk Tracks 섹션 */}
            <div className="bg-white rounded-[40px] p-10 border border-zinc-200 shadow-sm">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
                  <MessageSquare className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-black tracking-tight">Sales Talk Tracks</h3>
              </div>
              <div className="bg-zinc-50 rounded-3xl p-8 border border-zinc-100">
                <p className="text-lg font-bold text-zinc-800 leading-loose whitespace-pre-wrap italic">
                  "{comp.talk_tracks || "영업 시나리오를 입력해 주세요."}"
                </p>
              </div>
            </div>
          </div>

          {/* 3. 분석 요약 (우측 1열 차지) */}
          <div className="space-y-10">
            {/* 타겟 & 모델 정보 */}
            <div className="bg-white rounded-[40px] p-8 border border-zinc-200 shadow-sm">
              <div className="space-y-8">
                <div>
                  <h4 className="flex items-center gap-2 text-xs font-black text-zinc-400 uppercase tracking-widest mb-4">
                    <Target className="w-4 h-4" /> Core Target
                  </h4>
                  <p className="text-lg font-bold">{comp.target_audience || "-"}</p>
                </div>
                <div className="pt-8 border-t border-zinc-100">
                  <h4 className="flex items-center gap-2 text-xs font-black text-zinc-400 uppercase tracking-widest mb-4">
                    <ShieldCheck className="w-4 h-4" /> Business Model
                  </h4>
                  <p className="text-lg font-bold">{comp.business_model || "-"}</p>
                </div>
              </div>
            </div>

            {/* 경쟁사 약점 섹션 */}
            <div className="bg-red-50 rounded-[40px] p-8 border border-red-100">
              <div className="flex items-center gap-3 mb-6">
                <AlertTriangle className="w-6 h-6 text-red-500" />
                <h3 className="text-xl font-black text-red-900 tracking-tight">Competitor Weaknesses</h3>
              </div>
              <p className="text-red-800 font-bold leading-relaxed">
                {comp.comp_weaknesses || "입력된 약점 정보가 없습니다."}
              </p>
            </div>

            {/* 차별점 섹션 */}
            <div className="bg-blue-50 rounded-[40px] p-8 border border-blue-100">
              <div className="flex items-center gap-3 mb-6">
                <Lightbulb className="w-6 h-6 text-blue-500" />
                <h3 className="text-xl font-black text-blue-900 tracking-tight">Differentiators</h3>
              </div>
              <p className="text-blue-800 font-bold leading-relaxed">
                {comp.key_differentiators || "입력된 차별화 포인트가 없습니다."}
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}