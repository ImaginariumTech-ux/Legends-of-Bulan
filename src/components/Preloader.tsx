'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

export default function Preloader() {
    const [loading, setLoading] = useState(true);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        const timer = setTimeout(() => {
            setLoading(false);
        }, 2500); // 2.5 seconds for a cinematic feel

        return () => clearTimeout(timer);
    }, []);

    if (!mounted) return null;

    return (
        <div
            className={`fixed inset-0 z-[10000] flex flex-col items-center justify-center bg-black transition-all duration-1000 ease-in-out ${loading ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none scale-110'
                }`}
        >
            <div className="relative w-48 h-48 md:w-64 md:h-64 animate-pulse-glow">
                <Image
                    src="/lob.png"
                    alt="LOB Logo"
                    fill
                    className="object-contain filter contrast-125 brightness-110"
                    priority
                />
            </div>

            <div className="mt-12 space-y-4 text-center">
                {/* <p className="text-shimmer cinematic-text text-sm tracking-[0.3em]">
                    Initializing Experience
                </p> */}
                <div className="w-48 h-[1px] bg-gradient-to-r from-transparent via-amber-500/50 to-transparent mx-auto overflow-hidden">
                    <div className="w-full h-full bg-amber-500 animate-shimmer" />
                </div>
            </div>
        </div>
    );
}
