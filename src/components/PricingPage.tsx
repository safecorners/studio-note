import React from 'react';
import { Check, X } from 'lucide-react';
import { ActiveView } from '../types';

interface PricingPageProps {
  onNavigate: (view: ActiveView) => void;
  onSelectPlan: (plan: 'free' | 'pro' | 'enterprise') => void;
}

export default function PricingPage({ onNavigate, onSelectPlan }: PricingPageProps) {
  const handleSelectPlan = (plan: 'free' | 'pro' | 'enterprise') => {
    onSelectPlan(plan);
    // If selecting Pro, let's navigate to Payment Confirmation to show the full purchase success loop!
    if (plan === 'pro') {
      onNavigate('payment-confirmation');
    } else {
      onNavigate('dashboard');
    }
  };

  return (
    <div id="pricing-container" className="bg-[#09090b] min-h-screen flex flex-col font-sans text-[#fafafa] relative selection:bg-brand-primary/30 selection:text-white">
      {/* Top Navbar */}
      <header id="pricing-header" className="bg-[#09090b] border-b border-[#27272a] flex justify-between items-center w-full px-6 py-4 sticky top-0 z-50 backdrop-blur-md">
        <div className="max-w-7xl mx-auto flex justify-between items-center w-full">
          <div className="flex items-center gap-8">
            <button 
              id="logo-pricing" 
              onClick={() => onNavigate('landing')}
              className="text-xl font-bold tracking-tighter text-white hover:text-brand-primary transition-colors cursor-pointer"
            >
              Escualo
            </button>
            <nav className="hidden md:flex items-center gap-6">
              <button onClick={() => onNavigate('landing')} className="text-[#a1a1aa] font-medium text-sm hover:text-white transition-colors cursor-pointer">주요 기능</button>
              <button onClick={() => onNavigate('pricing')} className="text-brand-primary font-bold text-sm border-b-2 border-brand-primary pb-1">요금제</button>
              <button onClick={() => onNavigate('dashboard')} className="text-[#a1a1aa] font-medium text-sm hover:text-white transition-colors cursor-pointer">문서 및 대시보드</button>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={() => onNavigate('login')} className="text-sm font-medium text-[#a1a1aa] hover:text-white cursor-pointer select-none">로그인</button>
            <button onClick={() => onNavigate('login')} className="bg-brand-primary text-[#0a0012] font-semibold text-xs px-4 py-2 rounded-lg hover:opacity-90 transition-opacity cursor-pointer">시작하기</button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-grow flex flex-col items-center justify-center px-6 py-16">
        {/* Pitch text */}
        <div className="text-center mb-16 max-w-2xl">
          <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight mb-4">규모에 최적화된 정밀한 요금제.</h1>
          <p className="text-[#a1a1aa] text-lg font-light leading-relaxed">
            개발자와 기업 팀을 위해 설계된 투명한 요금제. 무료로 가볍게 시작하고, 더 강력한 성능이 필요할 때 언제든 업그레이드하세요.
          </p>
        </div>

        {/* Pricing tier layouts */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl items-stretch">
          
          {/* Free Tier card */}
          <div className="bg-[#121215] border border-[#27272a] rounded-xl p-8 flex flex-col hover:bg-[#18181b] transition-all duration-300">
            <div className="mb-8">
              <h2 className="text-xl font-bold text-white mb-2">무료 요금제</h2>
              <div className="flex items-baseline gap-1 mt-4">
                <span className="text-4xl font-bold text-white tracking-tight">$0</span>
                <span className="text-[#a1a1aa] text-xs font-mono">/월</span>
              </div>
              <p className="text-[#a1a1aa] text-xs mt-4 lead-relaxed h-10">
                마크다운 인터페이스와 개인 노트를 가볍게 기록하고 공유하는 데 완벽합니다.
              </p>
            </div>

            <ul className="space-y-4 flex-grow mb-8 text-[#fafafa] text-xs">
              <li className="flex items-center gap-3">
                <span className="flex-shrink-0 w-5 h-5 rounded-full bg-brand-accent/10 border border-brand-accent/20 flex items-center justify-center text-brand-accent">
                  <Check className="w-3.5 h-3.5" />
                </span>
                <span>최대 3개의 활성 프로젝트</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="flex-shrink-0 w-5 h-5 rounded-full bg-brand-accent/10 border border-brand-accent/20 flex items-center justify-center text-brand-accent">
                  <Check className="w-3.5 h-3.5" />
                </span>
                <span>기본 디렉터리 검색 지원</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="flex-shrink-0 w-5 h-5 rounded-full bg-brand-accent/10 border border-brand-accent/20 flex items-center justify-center text-brand-accent">
                  <Check className="w-3.5 h-3.5" />
                </span>
                <span>커뮤니티 대시보드 기술 지원</span>
              </li>
              <li className="flex items-center gap-3 text-[#71717a] opacity-50">
                <span className="flex-shrink-0 w-5 h-5 rounded-full bg-[#18181b] border border-[#27272a] flex items-center justify-center">
                  <X className="w-3.5 h-3.5 text-[#71717a]" />
                </span>
                <span>무제한 클라우드 첨부파일</span>
              </li>
            </ul>

            <button 
              id="free-tier-choose"
              onClick={() => handleSelectPlan('free')}
              className="w-full border border-[#27272a] hover:border-[#a78bfa] text-white hover:bg-[#121215] transition-all py-3 rounded-lg text-xs font-semibold select-none cursor-pointer active:scale-95"
            >
              무료로 시작하기
            </button>
          </div>

          {/* Pro Tier (Popular Highlight option) */}
          <div className="bg-[#121215] border-2 border-brand-primary rounded-xl p-8 flex flex-col relative transform md:-translate-y-4 shadow-[0_15px_30px_rgba(167,139,250,0.15)] bg-gradient-to-b from-[#18181b] via-[#121215] to-[#121215]">
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-brand-primary text-[#0a0012] text-[9px] font-bold px-3 py-1 rounded-full tracking-wider uppercase">
              가장 인기 있음
            </div>

            <div className="mb-8">
              <h2 className="text-xl font-bold text-brand-primary mb-2">Pro 요금제</h2>
              <div className="flex items-baseline gap-1 mt-4">
                <span className="text-4xl font-bold text-white tracking-tight">$8</span>
                <span className="text-[#a1a1aa] text-xs font-mono">/월</span>
              </div>
              <p className="text-[#a1a1aa] text-xs mt-4 lead-relaxed h-10 font-light">
                클라우드 동기화 및 대용량 원격 저장소가 필요한 전문 개발자를 위한 최선의 선택.
              </p>
            </div>

            <ul className="space-y-4 flex-grow mb-8 text-[#fafafa] text-xs font-light">
              <li className="flex items-center gap-3">
                <span className="flex-shrink-0 w-5 h-5 rounded-full bg-brand-accent/10 border border-brand-accent/20 flex items-center justify-center text-brand-accent">
                  <Check className="w-3.5 h-3.5" />
                </span>
                <span>무제한 디렉터리 프로젝트 구성</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="flex-shrink-0 w-5 h-5 rounded-full bg-brand-accent/10 border border-brand-accent/20 flex items-center justify-center text-brand-accent">
                  <Check className="w-3.5 h-3.5" />
                </span>
                <span>고급 지적 검색 및 글로벌 전역 인덱싱</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="flex-shrink-0 w-5 h-5 rounded-full bg-brand-accent/10 border border-brand-accent/20 flex items-center justify-center text-brand-accent">
                  <Check className="w-3.5 h-3.5" />
                </span>
                <span>우선순위 고속 실시간 이메일 지원</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="flex-shrink-0 w-5 h-5 rounded-full bg-brand-accent/10 border border-brand-accent/20 flex items-center justify-center text-brand-accent">
                  <Check className="w-3.5 h-3.5" />
                </span>
                <span>개인 도메인 연결 및 웹 배포용 라우팅</span>
              </li>
            </ul>

            <button 
              id="pro-tier-choose"
              onClick={() => handleSelectPlan('pro')}
              className="w-full bg-brand-primary hover:bg-[#bbf7d0] hover:text-[#001a12] text-[#0a0012] transition-colors py-3 rounded-lg text-xs font-bold shadow-[0_0_15px_rgba(167,139,250,0.3)] cursor-pointer active:scale-95"
            >
              프로 요금제 선택하기
            </button>
          </div>

          {/* Enterprise Tier card */}
          <div className="bg-[#121215] border border-[#27272a] rounded-xl p-8 flex flex-col hover:bg-[#18181b] transition-all duration-300">
            <div className="mb-8">
              <h2 className="text-xl font-bold text-white mb-2">엔터프라이즈</h2>
              <div className="flex items-baseline gap-1 mt-4">
                <span className="text-4xl font-bold text-white tracking-tight">별도 문의</span>
              </div>
              <p className="text-[#a1a1aa] text-xs mt-4 lead-relaxed h-10 font-light">
                전용 고유 자원 배정, 가용성 보장 협약(SLA), 다자간 보안 협업 제어 시스템.
              </p>
            </div>

            <ul className="space-y-4 flex-grow mb-8 text-[#fafafa] text-xs">
              <li className="flex items-center gap-3">
                <span className="flex-shrink-0 w-5 h-5 rounded-full bg-brand-accent/10 border border-brand-accent/20 flex items-center justify-center text-brand-accent">
                  <Check className="w-3.5 h-3.5" />
                </span>
                <span>Pro 요금제 모든 기능 기본 포함</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="flex-shrink-0 w-5 h-5 rounded-full bg-brand-accent/10 border border-brand-accent/20 flex items-center justify-center text-brand-accent">
                  <Check className="w-3.5 h-3.5" />
                </span>
                <span>기업 전담 리드 아키텍처 지원 엔지니어</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="flex-shrink-0 w-5 h-5 rounded-full bg-brand-accent/10 border border-brand-accent/20 flex items-center justify-center text-brand-accent">
                  <Check className="w-3.5 h-3.5" />
                </span>
                <span>SSO, SAML 통합 및 최고 수준 하이 보안 토큰 체인</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="flex-shrink-0 w-5 h-5 rounded-full bg-brand-accent/10 border border-brand-accent/20 flex items-center justify-center text-brand-accent">
                  <Check className="w-3.5 h-3.5" />
                </span>
                <span>99.99% 시스템 가동률 보장 SLA 계약 체결</span>
              </li>
            </ul>

            <button 
              id="enterprise-tier-choose"
              onClick={() => handleSelectPlan('enterprise')}
              className="w-full border border-[#27272a] hover:border-brand-primary text-white hover:bg-[#121215] transition-all py-3 rounded-lg text-xs font-semibold cursor-pointer active:scale-95"
            >
              영업팀에 문의하기
            </button>
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="bg-[#09090b] border-t border-[#27272a] w-full py-8 px-6 flex flex-col md:flex-row justify-between items-center gap-4 mt-auto">
        <div className="text-sm font-bold text-white tracking-tighter">Escualo</div>
        <div className="flex items-center gap-6 text-xs text-[#a1a1aa]">
          <a href="#" className="hover:text-brand-primary transition-colors">개인정보 처리방침</a>
          <a href="#" className="hover:text-brand-primary transition-colors">이용 약관</a>
          <a href="#" className="hover:text-brand-primary transition-colors">운영 상태</a>
          <a href="#" className="hover:text-brand-primary transition-colors">Twitter</a>
          <a href="#" className="hover:text-brand-primary transition-colors">GitHub</a>
        </div>
        <div className="text-xs text-[#71717a]">© 2026 Escualo. Inspired by Obsidian</div>
      </footer>
    </div>
  );
}
