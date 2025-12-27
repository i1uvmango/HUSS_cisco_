import Link from 'next/link';

export default function Home() {
  return (
    <div style={{ minHeight: '100vh' }}>
      {/* Hero Section - Full Screen with Single CTA */}
      <section style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
        background: 'linear-gradient(180deg, #e8f4fc 0%, #d4e8f5 50%, #c0dced 100%)'
      }}>
        {/* Background decorations */}
        <div style={{
          position: 'absolute',
          top: '10%',
          left: '10%',
          width: '300px',
          height: '300px',
          backgroundColor: 'rgba(107, 155, 210, 0.15)',
          borderRadius: '50%',
          filter: 'blur(80px)'
        }}></div>
        <div style={{
          position: 'absolute',
          bottom: '10%',
          right: '10%',
          width: '400px',
          height: '400px',
          backgroundColor: 'rgba(168, 213, 186, 0.15)',
          borderRadius: '50%',
          filter: 'blur(80px)'
        }}></div>

        <div style={{ textAlign: 'center', position: 'relative', zIndex: 10, padding: '0 2rem' }}>
          {/* Logo with Cisco badge */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
            <h1 style={{
              fontSize: 'clamp(2.5rem, 8vw, 4.5rem)',
              fontWeight: 'bold',
              lineHeight: '1.2',
              margin: 0,
              padding: '0.1em 0.2em',
              background: 'linear-gradient(90deg, #3b82f6, #10b981)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>
              Bridge-X
            </h1>
            <span style={{
              fontSize: '0.75rem',
              color: '#0076D5',
              fontWeight: '600',
              padding: '0.25rem 0.5rem',
              border: '1px solid #0076D5',
              borderRadius: '4px',
              whiteSpace: 'nowrap'
            }}>
              with Cisco
            </span>
          </div>

          <p style={{
            fontSize: '1.25rem',
            color: '#5a7a8a',
            maxWidth: '500px',
            margin: '0 auto 3rem',
            lineHeight: '1.8',
            fontWeight: '400'
          }}>
            Always here to listen and talk.
            <br />
            Always on your side.
          </p>

          <Link
            href="/chat"
            style={{
              display: 'inline-block',
              background: 'linear-gradient(135deg, #3b82f6, #10b981)',
              color: 'white',
              padding: '1rem 2.5rem',
              borderRadius: '50px',
              fontSize: '1.125rem',
              fontWeight: '600',
              textDecoration: 'none',
              boxShadow: '0 4px 20px rgba(59, 130, 246, 0.3)',
              transition: 'all 0.3s ease'
            }}
          >
            🌉 상담 시작하기
          </Link>
        </div>
      </section>

      {/* Meet Bridge-X Section */}
      <section style={{ padding: '5rem 1.5rem', background: 'linear-gradient(180deg, #f0f9ff 0%, #ffffff 100%)' }}>
        <div style={{ maxWidth: '72rem', margin: '0 auto' }}>
          {/* Main Title */}
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h2 style={{ fontSize: 'clamp(1.875rem, 5vw, 2.5rem)', fontWeight: 'bold', marginBottom: '1.5rem', color: '#374151' }}>
              <span style={{
                background: 'linear-gradient(90deg, #3b82f6, #10b981)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>Bridge-X</span>를 소개합니다
            </h2>
            <p style={{ fontSize: '1.1rem', color: '#6b7280', maxWidth: '700px', margin: '0 auto', lineHeight: '1.9' }}>
              Bridge-X는 이 서비스가 무엇을 연결하고, 어떤 가능성을 향해 나아가는지를 담은 이름입니다.
              <br />
              전쟁으로 단절된 난민 청소년들이 다시 세상과, 그리고 자신의 미래와 이어질 수 있도록 돕는
              <br />
              <strong style={{ color: '#10b981' }}>연결의 시작점</strong>을 의미합니다.
            </p>
          </div>

          {/* Bridge & X Explanation */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', marginTop: '3rem', alignItems: 'stretch' }}>
            {/* Bridge Card */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.8)',
              borderRadius: '1rem',
              padding: '2rem',
              border: '1px solid rgba(59, 130, 246, 0.2)',
              boxShadow: '0 4px 20px rgba(59, 130, 246, 0.1)',
              display: 'flex',
              flexDirection: 'column'
            }}>
              <h3 style={{
                fontSize: '2rem',
                fontWeight: 'bold',
                marginBottom: '1rem',
                color: '#3b82f6'
              }}>Bridge</h3>
              <p style={{ color: '#6b7280', lineHeight: '1.9', fontSize: '0.95rem', flex: 1 }}>
                Bridge는 단절을 넘어 연결로 나아가는 <strong style={{ color: '#3b82f6' }}>다리</strong>를 뜻합니다.
                <br /><br />
                전쟁으로 인해 무너진 일상과 관계, 그리고 심리적 안정 사이를 잇는 가교로서, 불안한 현재의 마음에서 평온한 미래의 일상으로 건너갈 수 있도록 돕는
                <strong style={{ color: '#374151' }}> 정서적·심리적 연결과 회복</strong>을 상징합니다.
              </p>
            </div>

            {/* X Card */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.8)',
              borderRadius: '1rem',
              padding: '2rem',
              border: '1px solid rgba(16, 185, 129, 0.2)',
              boxShadow: '0 4px 20px rgba(16, 185, 129, 0.1)',
              display: 'flex',
              flexDirection: 'column'
            }}>
              <h3 style={{
                fontSize: '2rem',
                fontWeight: 'bold',
                marginBottom: '1rem',
                color: '#10b981'
              }}>X</h3>
              <p style={{ color: '#6b7280', lineHeight: '1.9', fontSize: '0.95rem', flex: 1 }}>
                X는 <strong style={{ color: '#10b981' }}>미지수이자 확장</strong>의 의미를 담고 있습니다.
                <br /><br />
                난민 청소년 한 명 한 명이 지닌 무한한 가능성과 잠재력을 뜻하며, 동시에 핵심 기술 기반인 Cisco Webe<strong style={{ color: '#0076D5' }}>x</strong>의 마지막 글자 'X'를 차용해 이 서비스가 <strong style={{ color: '#374151' }}>Cisco의 신뢰할 수 있는 기술</strong> 위에서 구현되었음을 나타냅니다.
              </p>
            </div>
          </div>

          {/* Tagline */}
          <div style={{ textAlign: 'center', marginTop: '3rem' }}>
            <p style={{
              fontSize: '1.5rem',
              fontWeight: 'bold',
              background: 'linear-gradient(90deg, #3b82f6, #10b981)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              marginBottom: '0.5rem'
            }}>Bridge-X</p>
            <p style={{ color: '#6b7280', fontSize: '1.1rem' }}>
              단절을 넘어, 가능성으로 이어지는 연결.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ padding: '2rem 1.5rem', borderTop: '1px solid #e5e7eb', background: '#ffffff' }}>
        <div style={{ maxWidth: '72rem', margin: '0 auto', textAlign: 'center', color: '#9ca3af', fontSize: '0.875rem' }}>
          <p>© 2025 Bridge-X. All rights reserved.</p>
          <p style={{ marginTop: '0.5rem' }}>분쟁지역 청소년 심리 지원 프로젝트</p>
        </div>
      </footer>
    </div>
  );
}
