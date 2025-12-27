'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navbar() {
    const pathname = usePathname();

    const navLinks = [
        { href: '/', label: 'Home' },
        { href: '/chat', label: 'Counseling' },
        { href: '/admin', label: 'Admin' },
    ];

    return (
        <nav style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            zIndex: 50,
            background: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(10px)',
            borderBottom: '1px solid rgba(0, 0, 0, 0.05)'
        }}>
            <div style={{ maxWidth: '80rem', margin: '0 auto', padding: '1rem 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', textDecoration: 'none' }}>
                    <div style={{
                        width: '2.5rem',
                        height: '2.5rem',
                        borderRadius: '0.75rem',
                        background: 'linear-gradient(135deg, #3b82f6, #10b981)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 2px 10px rgba(59, 130, 246, 0.3)'
                    }}>
                        <span style={{ fontSize: '1.25rem' }}>🌉</span>
                    </div>
                    <span style={{
                        fontSize: '1.25rem',
                        fontWeight: 'bold',
                        background: 'linear-gradient(90deg, #3b82f6, #10b981)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text'
                    }}>Bridge-X</span>
                    <span style={{
                        fontSize: '0.625rem',
                        color: '#0076D5',
                        fontWeight: '600',
                        padding: '0.15rem 0.4rem',
                        border: '1px solid #0076D5',
                        borderRadius: '3px',
                        whiteSpace: 'nowrap'
                    }}>with Cisco</span>
                </Link>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    {navLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            style={{
                                padding: '0.5rem 1rem',
                                borderRadius: '0.5rem',
                                transition: 'all 0.3s ease',
                                textDecoration: 'none',
                                fontSize: '0.875rem',
                                fontWeight: 500,
                                color: pathname === link.href ? '#3b82f6' : '#64748b',
                                background: pathname === link.href ? 'rgba(59, 130, 246, 0.1)' : 'transparent',
                                border: pathname === link.href ? '1px solid rgba(59, 130, 246, 0.2)' : '1px solid transparent'
                            }}
                        >
                            {link.label}
                        </Link>
                    ))}
                </div>
            </div>
        </nav>
    );
}
