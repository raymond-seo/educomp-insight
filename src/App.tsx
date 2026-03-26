import { useEffect, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { supabase } from './lib/supabase';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Battlecards from './pages/Battlecards';

function App() {
  const [session, setSession] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 1. 처음 화면을 열었을 때 현재 로그인 상태를 확인합니다.
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setIsLoading(false);
    });

    // 2. 로그인하거나 로그아웃할 때 상태가 변하는 것을 감지합니다.
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  // 데이터를 불러오는 동안 보여줄 로딩 화면입니다.
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50">
        <p className="text-zinc-500 font-medium">로딩 중...</p>
      </div>
    );
  }

  return (
    <Routes>
      {/* 로그인이 안 되어 있다면 무조건 Login 페이지를 보여줍니다. */}
      {!session ? (
        <Route path="*" element={<Login />} />
      ) : (
        /* 로그인이 성공했다면 메인 서비스 화면들을 연결합니다. */
        <>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/battlecards" element={<Battlecards />} />
          <Route path="*" element={<Dashboard />} />
        </>
      )}
    </Routes>
  );
}

export default App;