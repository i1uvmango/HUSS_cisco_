import Link from 'next/link';

export default function Home() {
  const features = [
    {
      icon: '💬',
      title: 'AI 감정 상담',
      description: '따뜻한 AI와 대화하며 마음속 이야기를 나눌 수 있어요',
    },
    {
      icon: '🔒',
      title: '프라이버시 보호',
      description: '대화 원문은 저장되지 않아요. 요약 데이터만 안전하게 보관됩니다',
    },
    {
      icon: '👩‍⚕️',
      title: '전문 상담사 연결',
      description: 'AI와 대화 후 원하시면 전문 상담사와 화상 상담을 받을 수 있어요',
    },
    {
      icon: '🌍',
      title: '분쟁지역 청소년 지원',
      description: '어려운 환경에 있는 청소년들에게 심리적 안정을 제공합니다',
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 px-6 overflow-hidden">
        {/* Background decorations */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-indigo-500/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl"></div>

        <div className="max-w-6xl mx-auto text-center relative z-10">
          <div className="inline-block mb-6 px-4 py-2 rounded-full glass text-sm text-indigo-300">
            🌟 분쟁지역 청소년을 위한 심리 지원 서비스
          </div>

          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            <span className="gradient-text">마음쉼터</span>에서
            <br />
            <span className="text-white">편안하게 쉬어가세요</span>
          </h1>

          <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-10">
            AI와 대화하며 감정을 정리하고, 필요하면 전문 상담사와 연결됩니다.
            <br />
            당신의 이야기는 소중하게 보호됩니다.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/chat" className="btn-primary text-lg px-8 py-4">
              💜 상담 시작하기
            </Link>
            <Link href="#features" className="btn-secondary text-lg px-8 py-4">
              서비스 알아보기
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              안전하고 <span className="gradient-text">따뜻한</span> 공간
            </h2>
            <p className="text-gray-400 max-w-xl mx-auto">
              마음쉼터는 청소년의 심리적 안정을 위해 설계되었습니다
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {features.map((feature, idx) => (
              <div
                key={idx}
                className="card group animate-fadeIn"
                style={{ animationDelay: `${idx * 100}ms` }}
              >
                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              어떻게 <span className="gradient-text">이용하나요?</span>
            </h2>
          </div>

          <div className="flex flex-col md:flex-row gap-8 items-center justify-center">
            {[
              { step: '1', title: 'AI와 대화', desc: '편안하게 마음속 이야기를 나눠요' },
              { step: '2', title: '감정 요약', desc: 'AI가 대화를 분석하여 감정을 정리해요' },
              { step: '3', title: '상담 연결', desc: '필요시 전문 상담사와 화상 상담을 받아요' },
            ].map((item, idx) => (
              <div key={idx} className="flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-500 to-pink-500 flex items-center justify-center text-2xl font-bold mb-4">
                  {item.step}
                </div>
                <h3 className="text-lg font-bold mb-2">{item.title}</h3>
                <p className="text-gray-400 text-sm">{item.desc}</p>
                {idx < 2 && (
                  <div className="hidden md:block absolute transform translate-x-32 text-gray-600 text-2xl">
                    →
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="card bg-gradient-to-br from-indigo-900/50 to-pink-900/50 text-center py-12">
            <h2 className="text-3xl font-bold mb-4">
              지금 바로 시작해보세요
            </h2>
            <p className="text-gray-300 mb-8">
              어려운 감정, 혼자 안고 있지 마세요. 마음쉼터가 함께합니다.
            </p>
            <Link href="/chat" className="btn-primary text-lg px-8 py-4 inline-block">
              💜 무료로 상담 시작하기
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-zinc-800">
        <div className="max-w-6xl mx-auto text-center text-gray-500 text-sm">
          <p>© 2025 마음쉼터. All rights reserved.</p>
          <p className="mt-2">분쟁지역 청소년 심리 지원 프로젝트</p>
        </div>
      </footer>
    </div>
  );
}
