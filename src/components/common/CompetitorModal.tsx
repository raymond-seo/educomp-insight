import { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { X, Loader2, Link, Tag, TrendingUp, Info } from 'lucide-react';

// onClose: 팝업창 닫는 함수, onSuccess: 등록 성공 시 데이터를 다시 불러오는 함수
export default function CompetitorModal({ onClose, onSuccess }: { onClose: () => void; onSuccess: () => void }) {
  const [saving, setSaving] = useState(false);
  
  // 1. 기본 정보 입력 상태 (state)
  const [name, setName] = useState('');
  const [logoUrl, setLogoUrl] = useState('');
  const [website, setWebsite] = useState('');
  const [description, setDescription] = useState('');
  const [targetAudience, setTargetAudience] = useState('');
  const [businessModel, setBusinessModel] = useState('');
  const [tags, setTags] = useState(''); // 쉼표로 구분할 태그

  // 2. 핵심 배틀카드 데이터 입력 상태 (state)
  const [howToWin, setHowToWin] = useState('');
  const [keyDifferentiators, setKeyDifferentiators] = useState('');
  const [compWeaknesses, setCompWeaknesses] = useState('');
  const [talkTracks, setTalkTracks] = useState('');

  // 3. 데이터를 Supabase에 저장하는 함수
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return alert('경쟁사 이름은 필수 입력 항목입니다.');
    
    setSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      const newCompetitor = {
        name: name.trim(),
        logo_url: logoUrl.trim(),
        website: website.trim(),
        description: description.trim(),
        target_audience: targetAudience.trim(),
        business_model: businessModel.trim(),
        // 태그는 쉼표로 구분해서 배열 형태로 변환
        tags: tags.split(',').map(tag => tag.trim()).filter(tag => tag), 
        
        how_to_win: howToWin.trim(),
        key_differentiators: keyDifferentiators.trim(),
        comp_weaknesses: compWeaknesses.trim(),
        talk_tracks: talkTracks.trim(),
        
        created_at: new Date(),
        updated_at: new Date(),
        updated_by: user?.id,
        created_by: user?.id
      };

      // Supabase 'competitors' 테이블에 데이터 넣기
      const { error } = await supabase.from('competitors').insert([newCompetitor]);
      if (error) throw error;

      alert('새로운 경쟁사가 성공적으로 등록되었습니다.');
      onSuccess(); // 목록 다시 불러오기
      onClose(); // 팝업창 닫기
    } catch (error) {
      console.error("Save failed", error);
      alert('등록 중 에러가 발생했습니다. 담당자에게 문의하세요.');
    } finally {
      setSaving(false);
    }
  };

  return (
    // 팝업창 배경 (어둡게 처리)
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-6 overflow-y-auto">
      {/* 팝업창 본체 */}
      <div className="bg-white w-full max-w-4xl rounded-[40px] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* 헤더 영역 */}
        <div className="p-10 border-b border-zinc-100 flex items-center justify-between shrink-0">
          <div>
            <h2 className="text-3xl font-black tracking-tighter mb-1">새 경쟁사 등록</h2>
            <p className="text-sm font-bold text-zinc-400">Coursera, LinkedIn Learning 등 주요 플랫폼 분석 데이터를 입력하세요.</p>
          </div>
          <button onClick={onClose} className="p-3 hover:bg-zinc-100 rounded-full transition-colors text-zinc-400">
            <X className="w-6 h-6" />
          </button>
        </div>
        
        {/* 실제 입력 영역 (스크롤 가능) */}
        <div className="p-10 overflow-y-auto flex-1">
          <form id="form-competitor" onSubmit={handleSubmit} className="space-y-12 pb-10">
            
            {/* 세션 1: 기본 회사 정보 */}
            <section className="space-y-8">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-zinc-100 rounded-xl flex items-center justify-center text-zinc-400">
                  <Info className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-bold tracking-tight">기본 회사 정보</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2 col-span-1">
                  <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider ml-1">회사명 (필수)</label>
                  <input required value={name} onChange={e => setName(e.target.value)} placeholder="예: Coursera" className="w-full p-4 bg-zinc-50 border border-transparent rounded-2xl focus:border-zinc-200 outline-none" />
                </div>
                <div className="space-y-2 col-span-1">
                  <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider ml-1">로고 URL (Picsum 등 이미지 주소)</label>
                  <input value={logoUrl} onChange={e => setLogoUrl(e.target.value)} placeholder="https://..." className="w-full p-4 bg-zinc-50 border border-transparent rounded-2xl focus:border-zinc-200 outline-none" />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2 col-span-1">
                  <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider ml-1">공식 웹사이트 URL</label>
                  <div className="relative">
                    <Link className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                    <input type="url" value={website} onChange={e => setWebsite(e.target.value)} placeholder="https://..." className="w-full pl-11 pr-4 py-4 bg-zinc-50 border border-transparent rounded-2xl focus:border-zinc-200 outline-none" />
                  </div>
                </div>
                <div className="space-y-2 col-span-1">
                  <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider ml-1">태그 (쉼표로 구분)</label>
                  <div className="relative">
                    <Tag className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                    <input value={tags} onChange={e => setTags(e.target.value)} placeholder="B2B, IT, 글로벌콘텐츠" className="w-full pl-11 pr-4 py-4 bg-zinc-50 border border-transparent rounded-2xl focus:border-zinc-200 outline-none" />
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider ml-1">회사 개요 (한 줄 설명)</label>
                <textarea rows={2} value={description} onChange={e => setDescription(e.target.value)} placeholder="회사의 주요 비즈니스 모델이나 특징" className="w-full p-4 bg-zinc-50 border border-transparent rounded-2xl focus:border-zinc-200 outline-none resize-none" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2 col-span-1">
                  <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider ml-1">핵심 타겟 고객층 (B2B/B2C)</label>
                  <input value={targetAudience} onChange={e => setTargetAudience(e.target.value)} placeholder="예: 글로벌 대기업 HRD 담당자" className="w-full p-4 bg-zinc-50 border border-transparent rounded-2xl focus:border-zinc-200 outline-none" />
                </div>
                <div className="space-y-2 col-span-1">
                  <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider ml-1">비즈니스 모델</label>
                  <input value={businessModel} onChange={e => setBusinessModel(e.target.value)} placeholder="예: 구독형 B2B 라이선스 (SaaS)" className="w-full p-4 bg-zinc-50 border border-transparent rounded-2xl focus:border-zinc-200 outline-none" />
                </div>
              </div>
            </section>

            {/* 세션 2: Competitive Battlecard (고도화 핵심 입력 항목) */}
            <section className="bg-zinc-950 p-10 rounded-[40px] shadow-xl space-y-8">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-zinc-800 rounded-xl flex items-center justify-center text-zinc-500">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-bold tracking-tight text-white">Competitive Battlecard Strategy</h3>
              </div>
              
              <div className="space-y-2">
                <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider ml-1">How to Win (승리 전략, 핵심 공략 포인트)</label>
                <textarea rows={3} value={howToWin} onChange={e => setHowToWin(e.target.value)} placeholder="이 경쟁사를 상대로 승리하기 위한 결정적인 영업 전략" className="w-full p-4 bg-zinc-900 text-white border border-zinc-700 rounded-2xl focus:ring-2 focus:ring-white focus:border-transparent outline-none transition-all resize-none font-medium" />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
                <div className="space-y-2 col-span-1">
                  <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider ml-1">Key Differentiators (우리 회사와 이 경쟁사의 결정적 차별점)</label>
                  <textarea rows={5} value={keyDifferentiators} onChange={e => setKeyDifferentiators(e.target.value)} placeholder="우리 회사만의 강점 나열" className="w-full p-4 bg-zinc-900 text-white border border-zinc-700 rounded-2xl focus:ring-2 focus:ring-white focus:border-transparent outline-none transition-all resize-none text-sm leading-relaxed" />
                </div>
                <div className="space-y-2 col-span-1">
                  <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider ml-1">Competitor Weaknesses (경쟁사 약점)</label>
                  <textarea rows={5} value={compWeaknesses} onChange={e => setCompWeaknesses(e.target.value)} placeholder="경쟁사가 가지지 못한 콘텐츠 풀이나 서비스 한계" className="w-full p-4 bg-zinc-900 text-white border border-zinc-700 rounded-2xl focus:ring-2 focus:ring-white focus:border-transparent outline-none transition-all resize-none text-sm leading-relaxed" />
                </div>
              </div>
              
              <div className="space-y-2 pt-4">
                <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider ml-1">Talk Tracks & Landmines to Lay (공격/방어 전략 및 유도 질문)</label>
                <textarea rows={4} value={talkTracks} onChange={e => setTalkTracks(e.target.value)} placeholder="고객 미팅 시 활용할 '공격 시나리오'와 '방어 시나리오'. 경쟁사의 약점을 드러내는 질문들." className="w-full p-4 bg-zinc-900 text-white border border-zinc-700 rounded-2xl focus:ring-2 focus:ring-white focus:border-transparent outline-none transition-all resize-none text-sm" />
              </div>
            </section>
          </form>
        </div>
        
        {/* 하단 버튼 영역 */}
        <div className="p-10 bg-zinc-50 border-t border-zinc-100 flex gap-4 shrink-0">
          <button type="submit" form="form-competitor" disabled={saving} className="flex-1 py-5 bg-blue-600 text-white rounded-3xl font-bold text-base hover:bg-blue-700 transition-all flex items-center justify-center gap-2 shadow-xl shadow-blue-600/20 disabled:opacity-50">
            {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <TrendingUp className="w-5 h-5" />}
            {saving ? '정보 저장 중...' : '분석 데이터 등록하기'}
          </button>
          <button type="button" onClick={onClose} className="px-12 py-5 bg-white border border-zinc-200 text-zinc-600 rounded-3xl font-bold hover:bg-zinc-100 transition-all">
            취소
          </button>
        </div>
        
      </div>
    </div>
  );
}