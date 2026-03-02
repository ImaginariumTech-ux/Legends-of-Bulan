'use client';

import { useState, useRef, useEffect } from "react";
import Image from "next/image";

export default function Home() {
  const [isMuted, setIsMuted] = useState(true); // Must start muted for browser to allow autoplay
  const videoRef = useRef<HTMLVideoElement>(null);
  const [scrollY, setScrollY] = useState(0);

  // Typewriter Story Logic for Hero
  const [currentSegment, setCurrentSegment] = useState(0);
  const [typedText, setTypedText] = useState("");
  const [isTypingStarted, setIsTypingStarted] = useState(false);
  const [isSegmentVisible, setIsSegmentVisible] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const storySegments = [
    "Based on a prophesy,",
    "Akosua leads a group of chosen warriors known as the marked ones,",
    "United together to challenge the despotic Emperor of Bulan,",
    "The god-king, Jabari,",
    "And bring his reign to an end,",
    "In the war to end all wars.",
    "A warrior banished for treason",
    "An accused sorcerer escaping execution",
    "A disgraced arrowhead assassin on a botched mercenary mission",
    "One permanent outsider",
    "A former guardian",
    "A mad fighter",
    "A notorious trickster with a ransom on his head",
    "LOGO_REVEAL"
  ];

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });

    // Auto-start hero typing after preloader
    const timeout = setTimeout(() => setIsTypingStarted(true), 1500);

    // Helper to unmute on first interaction
    const unmuteOnInteraction = () => {
      if (videoRef.current) {
        videoRef.current.muted = false;
        setIsMuted(false);
      }
      window.removeEventListener("click", unmuteOnInteraction);
      window.removeEventListener("keydown", unmuteOnInteraction);
      window.removeEventListener("scroll", unmuteOnInteraction);
      window.removeEventListener("touchstart", unmuteOnInteraction);
    };

    // Attempt autoplay with audio immediately; fall back to muted
    const tryAutoplayWithAudio = async () => {
      if (!videoRef.current) return;
      videoRef.current.muted = false;
      try {
        await videoRef.current.play();
        setIsMuted(false); // browser allowed it — audio is live
      } catch {
        // Browser blocked unmuted autoplay — play muted and wait for gesture
        videoRef.current.muted = true;
        setIsMuted(true);
        window.addEventListener("click", unmuteOnInteraction);
        window.addEventListener("keydown", unmuteOnInteraction);
        window.addEventListener("scroll", unmuteOnInteraction);
        window.addEventListener("touchstart", unmuteOnInteraction);
      }
    };

    tryAutoplayWithAudio();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("click", unmuteOnInteraction);
      window.removeEventListener("keydown", unmuteOnInteraction);
      window.removeEventListener("scroll", unmuteOnInteraction);
      window.removeEventListener("touchstart", unmuteOnInteraction);
      clearTimeout(timeout);
    };
  }, []);

  useEffect(() => {
    if (!isTypingStarted) return;

    const fullText = storySegments[currentSegment];

    // Special handling for logo reveal - no typing, just show
    if (fullText === "LOGO_REVEAL") {
      setTypedText("LOGO_REVEAL");
      const timer = setTimeout(() => {
        setIsSegmentVisible(false);
        const nextTimer = setTimeout(() => {
          setCurrentSegment(0);
          setTypedText("");
          setIsSegmentVisible(true);
        }, 1000);
        return () => clearTimeout(nextTimer);
      }, 4000); // Logo stay time
      return () => clearTimeout(timer);
    }

    if (typedText.length < fullText.length) {
      const timer = setTimeout(() => {
        setTypedText(fullText.slice(0, typedText.length + 1));
      }, 50);
      return () => clearTimeout(timer);
    } else {
      const timer = setTimeout(() => {
        setIsSegmentVisible(false);
        const nextTimer = setTimeout(() => {
          const nextIndex = (currentSegment + 1) % storySegments.length;
          setCurrentSegment(nextIndex);
          setTypedText("");
          setIsSegmentVisible(true);
        }, 1000);
        return () => clearTimeout(nextTimer);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isTypingStarted, typedText, currentSegment]);

  const toggleSound = () => {
    if (videoRef.current) {
      const newMuted = !isMuted;
      videoRef.current.muted = newMuted;
      setIsMuted(newMuted);
    }
  };

  const handleInteraction = () => {
    if (videoRef.current) {
      videoRef.current.muted = false;
      videoRef.current.play();
      setIsMuted(false);
    }
  };

  const renderHighlightedText = (text: string) => {
    if (text === "LOGO_REVEAL") return null;
    const highlights = [
      "Akosua", "marked ones", "Emperor of Bulan", "god-king", "Jabari", "war to end all wars",
      "Gisgo", "Fijabi", "Heba", "Hauwa", "Khalifa", "Londisizwe",
      "Earth", "Fire", "Lightning", "Water", "Sound", "Sunlight", "Wind", "Alchemy", "Magic", "Nature"
    ];

    let result: (string | React.ReactNode)[] = [text];

    highlights.forEach(term => {
      const newResult: (string | React.ReactNode)[] = [];
      result.forEach(part => {
        if (typeof part === 'string') {
          const split = part.split(term);
          split.forEach((s, i) => {
            newResult.push(s);
            if (i < split.length - 1) {
              newResult.push(<span key={term + i} className="text-primary font-bold shadow-[0_0_10px_rgba(245,158,11,0.3)]">{term}</span>);
            }
          });
        } else {
          newResult.push(part);
        }
      });
      result = newResult;
    });

    return result;
  };

  return (
    <main className="relative min-h-screen bg-black text-foreground selection:bg-primary/30 overflow-x-hidden">
      {/* Background Cinematic Atmosphere */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div
          className="absolute inset-0 w-full h-full will-change-transform"
          style={{ transform: `translateY(${scrollY * 0.15}px)` }}
        >
          <video
            ref={videoRef}
            autoPlay
            muted
            loop
            playsInline
            className="absolute inset-0 w-full h-full object-cover opacity-60 scale-110"
          >
            <source src="https://res.cloudinary.com/dt2vu9jje/video/upload/f_auto,q_auto/v1772454188/The_Legends_of_Bulan_-_Teaser_Magic_Carpet_Studios_t0phpo.mp4" type="video/mp4" />
          </video>
        </div>

        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/40 to-black/80" />

        <div
          className="absolute top-0 left-1/4 w-[800px] h-[800px] bg-amber-500/10 rounded-full blur-[160px] animate-pulse-glow will-change-transform"
          style={{ transform: `translateY(${scrollY * -0.1}px)` }}
        />
        <div
          className="absolute bottom-[-10%] right-1/4 w-[600px] h-[600px] bg-amber-600/5 rounded-full blur-[140px] will-change-transform"
          style={{ transform: `translateY(${scrollY * 0.05}px)` }}
        />

        <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-amber-400/20 to-transparent translate-y-[-100%] animate-shimmer" style={{ animationDuration: '8s' }} />
      </div>

      {/* Navigation */}
      <nav className="relative z-10 flex items-center justify-between px-8 md:px-16 py-8 bg-transparent">
        <div className="relative w-32 h-12">
          <Image
            src="/lob.png"
            alt="LOB Logo"
            fill
            className="object-contain filter brightness-125"
          />
        </div>

        <button
          onClick={() => setIsFormOpen(true)}
          className="px-6 py-2 border border-white/10 rounded-full cinematic-text text-[9px] tracking-[0.3em] hover:bg-white/5 transition-all text-white"
        >
          Create with us
        </button>
      </nav>

      {/* Hero Content */}
      <section className="relative z-10 flex flex-col items-center justify-center min-h-[90vh] px-6 text-center">
        <div
          className="space-y-12 max-w-5xl animate-in fade-in duration-1000 ease-out will-change-transform"
          style={{ transform: `translateY(${scrollY * -0.2}px)`, opacity: 1 - scrollY / 800 }}
        >
          <div className="space-y-8">
            <h2 className="cinematic-text text-[10px] tracking-[0.5em] text-amber-500/50 block drop-shadow-[0_0_15px_rgba(245,158,11,0.3)] max-w-2xl mx-auto uppercase">
              THE PROPHECY OF BULAN
            </h2>

            <div className="relative flex justify-center items-center h-48 md:h-64">
              {typedText === "LOGO_REVEAL" ? (
                <div className={`relative w-[400px] h-[150px] md:w-[700px] md:h-[250px] transition-all duration-1500 ease-in-out ${isSegmentVisible ? 'opacity-100 scale-125' : 'opacity-0 scale-100'}`}>
                  <Image
                    src="/lob.png"
                    alt="LOB Logo Reveal"
                    fill
                    className="object-contain filter brightness-150 drop-shadow-[0_0_50px_rgba(245,158,11,0.6)]"
                  />
                </div>
              ) : (
                <p className={`text-2xl md:text-5xl font-light leading-relaxed tracking-wide text-white transition-opacity duration-1000 ease-in-out ${isSegmentVisible ? 'opacity-100' : 'opacity-0'}`}>
                  {renderHighlightedText(typedText)}
                  <span className="inline-block w-[3px] h-[0.8em] bg-primary ml-2 animate-pulse align-middle" />
                </p>
              )}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-8 pt-12">
            <button
              onClick={() => { handleInteraction(); setIsFormOpen(true); }}
              className="group relative px-12 py-4 overflow-hidden rounded-full bg-white text-black font-bold cinematic-text text-xs tracking-[0.4em] transition-transform hover:scale-105 active:scale-95 shadow-[0_0_30px_rgba(255,255,255,0.2)]"
            >
              <span className="relative z-10">Create with us</span>
              <div className="absolute inset-0 bg-amber-500 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
            </button>
            <a
              href="https://www.youtube.com/watch?v=15Zfj4qgLB0"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 text-white p-4 group"
            >
              <div className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center group-hover:bg-white/10 transition-colors">
                <div className="w-0 h-0 border-t-[6px] border-t-transparent border-l-[10px] border-l-white border-b-[6px] border-b-transparent ml-1" />
              </div>
              <span className="cinematic-text text-[10px] tracking-[0.4em]">Watch Trailer</span>
            </a>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div
          className="absolute bottom-12 flex flex-col items-center gap-4 animate-bounce"
          style={{ opacity: 0.4 - scrollY / 400 }}
        >
          <span className="cinematic-text text-[8px] tracking-[0.5em] text-white/60">Explore more</span>
          <div className="w-[1px] h-12 bg-gradient-to-b from-white/40 to-transparent" />
        </div>
      </section>

      {/* Signature Quote Section */}
      <section className="relative z-10 py-32 px-6 flex items-center justify-center">
        <div
          className="max-w-4xl mx-auto text-center will-change-transform transition-all duration-1000"
          style={{
            transform: `translateY(${(scrollY - 400) * -0.05}px)`,
            opacity: Math.min(1, Math.max(0, (scrollY - 200) / 400))
          }}
        >
          <p className="text-2xl md:text-4xl text-white font-light leading-relaxed tracking-wider italic opacity-90">
            "All wars are fought twice, <br className="hidden md:block" />
            <span className="text-primary font-bold not-italic">first in the mind</span> and then in the battlefield."
          </p>
          <div className="mt-12 flex justify-center">
            <div className="w-24 h-[1px] bg-gradient-to-r from-transparent via-primary to-transparent" />
          </div>
        </div>
      </section>

      {/* Cast Narratives Section */}
      <CastSection />

      {/* Movie Credits Section */}
      <CreditsSection />

      {/* Contact Section */}
      <ContactSection onOpenForm={() => setIsFormOpen(true)} />

      {/* Contact Form Modal */}
      {isFormOpen && <ContactForm onClose={() => setIsFormOpen(false)} />}

      {/* Floating Audio Toggle */}
      <div className="fixed bottom-8 right-8 z-50">
        {/* Pulsating rings — only when muted */}
        {isMuted && (
          <>
            <span className="absolute inset-0 rounded-full bg-amber-400/30 animate-ping" style={{ animationDuration: '1.2s' }} />
            <span className="absolute inset-[-8px] rounded-full border border-amber-400/40 animate-ping" style={{ animationDuration: '1.6s', animationDelay: '0.2s' }} />
            <span className="absolute inset-[-16px] rounded-full border border-amber-400/20 animate-ping" style={{ animationDuration: '2s', animationDelay: '0.4s' }} />
          </>
        )}
        <button
          onClick={toggleSound}
          aria-label="Toggle Audio"
          className={`relative flex items-center gap-3 px-4 py-3 rounded-full backdrop-blur-md border transition-all duration-500 group
            ${isMuted
              ? 'bg-gradient-to-br from-amber-500/30 via-yellow-600/20 to-amber-900/30 border-amber-400/50 shadow-[0_0_24px_rgba(245,158,11,0.45)] hover:shadow-[0_0_36px_rgba(245,158,11,0.65)]'
              : 'bg-black/40 border-white/10 hover:bg-white/5 shadow-[0_0_12px_rgba(34,197,94,0.2)]'
            }`}
        >
          {/* Icon */}
          <div className="relative w-6 h-6 flex items-center justify-center flex-shrink-0">
            {isMuted ? (
              /* Speaker with X */
              <svg viewBox="0 0 24 24" className="w-5 h-5 text-amber-300 drop-shadow-[0_0_6px_rgba(245,158,11,0.8)]" fill="currentColor">
                <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM19 12c0 3.53-2.61 6.44-6 6.94V20.9c4.01-.5 7.11-3.86 7.11-8.9 0-5.04-3.1-8.4-7.11-8.9v2.01c3.39.49 6 3.39 6 6.89z" />
                <line x1="1" y1="1" x2="23" y2="23" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
              </svg>
            ) : (
              /* Audio bars */
              <div className="flex items-end gap-[2px] h-4">
                <div className="w-[3px] rounded-sm bg-amber-400 animate-[bounce_0.5s_infinite_alternate]" style={{ animationDelay: '0s', height: '40%' }} />
                <div className="w-[3px] rounded-sm bg-amber-400 animate-[bounce_0.5s_infinite_alternate]" style={{ animationDelay: '0.15s', height: '70%' }} />
                <div className="w-[3px] rounded-sm bg-amber-400 animate-[bounce_0.5s_infinite_alternate]" style={{ animationDelay: '0.3s', height: '100%' }} />
                <div className="w-[3px] rounded-sm bg-amber-400 animate-[bounce_0.5s_infinite_alternate]" style={{ animationDelay: '0.15s', height: '70%' }} />
                <div className="w-[3px] rounded-sm bg-amber-400 animate-[bounce_0.5s_infinite_alternate]" style={{ animationDelay: '0s', height: '40%' }} />
              </div>
            )}
          </div>

          {/* Label */}
          <span className={`cinematic-text text-[8px] tracking-[0.25em] uppercase transition-all duration-300
            ${isMuted ? 'text-amber-300 opacity-90' : 'text-white opacity-40 group-hover:opacity-100'}`}>
            {isMuted ? "Tap for Audio" : "Audio On"}
          </span>
        </button>
      </div>

      {/* Cinematic Vignette */}
      <div className="fixed inset-0 pointer-events-none shadow-[inset_0_0_200px_rgba(0,0,0,0.8)] z-50" />
    </main>
  );
}

function CastSection() {
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const sectionRef = useRef<HTMLElement>(null);
  const [isInView, setIsInView] = useState(false);

  const detailedBios = [
    {
      name: "Akosua",
      title: "Arrowhead Assassin of Ashanti",
      elements: "Earth, Vegetation",
      abilities: "Exceptional agility and ability to make and use weapons and traps",
      image: "/AKOUSA.jpeg"
    },
    {
      name: "Gisgo",
      title: "Skull crushing Rock of Carthage",
      elements: "Master of terrains and navigation, unaffected by magic",
      abilities: "Incredible strength and brute force",
      image: "/GISCO.jpeg"
    },
    {
      name: "Fijabi",
      title: "Fiery Thunderstorm",
      elements: "Lightning, fire, water, electro-magnetism",
      abilities: "Ability to command storms and lightning, ability to control metal objects",
      image: ""
    },
    {
      name: "Heba",
      title: "The Guardian of Giza",
      elements: "Earth, Fire, Sound",
      abilities: "Incredibly brilliant and swift, can levitate rocks",
      image: ""
    },
    {
      name: "Hauwa",
      title: "Zealot of Zazzau",
      elements: "Sunlight, wind",
      abilities: "Incredible speed, magical fiery bow and Stealth",
      image: "/HAUWA.jpeg"
    },
    {
      name: "Khalifa",
      title: "Trickster of Timbuktu",
      elements: "Alchemy, Magic",
      abilities: "Incredible antics, master of deception, camouflage and illusion",
      image: "/KHADAFI.jpeg"
    },
    {
      name: "Londisizwe",
      title: "Fireball of Zulu Kingdom",
      elements: "Earth, Nature",
      abilities: "Power of foresight, ability to read ancient writings, omens. Legendary fighting skills",
      image: "/LONDIWE.jpeg"
    }
  ];

  const highlights = [
    "Akosua", "Gisgo", "Fijabi", "Heba", "Hauwa", "Khalifa", "Londisizwe",
    "Earth", "Fire", "Lightning", "Water", "Sound", "Sunlight", "Wind", "Alchemy", "Magic", "Nature", "Vegetation"
  ];

  const renderHighlightedBio = (text: string) => {
    let result: (string | React.ReactNode)[] = [text];
    highlights.forEach(term => {
      const newResult: (string | React.ReactNode)[] = [];
      result.forEach(part => {
        if (typeof part === 'string') {
          const split = part.split(term);
          split.forEach((s, i) => {
            newResult.push(s);
            if (i < split.length - 1) {
              newResult.push(<span key={term + i} className="text-primary font-bold">{term}</span>);
            }
          });
        } else {
          newResult.push(part);
        }
      });
      result = newResult;
    });
    return result;
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isInView) return;

    const interval = setInterval(() => {
      setIsVisible(false);
      setTimeout(() => {
        setCurrentTextIndex((prev) => (prev + 1) % detailedBios.length);
        setIsVisible(true);
      }, 1000);
    }, 5000); // Slightly more time for reading detailed bios

    return () => clearInterval(interval);
  }, [isInView, detailedBios.length]);

  return (
    <section
      ref={sectionRef}
      className="relative z-10 py-24 px-8 min-h-[70vh] flex flex-col items-center justify-center text-center overflow-hidden bg-black"
    >
      {/* Character Backgrounds Layer */}
      <div className="absolute inset-0 z-0">
        {detailedBios.map((char, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1500 ease-in-out ${index === currentTextIndex ? 'opacity-40 scale-105' : 'opacity-0 scale-100'}`}
          >
            {char.image && (
              <Image
                src={char.image}
                alt="Character Background"
                fill
                className="object-cover"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-black" />
          </div>
        ))}
      </div>

      <div className="relative z-10 w-full max-w-5xl mx-auto space-y-12">
        <h3 className="cinematic-text text-[10px] tracking-[0.5em] text-primary/40 uppercase">
          Legendary Bios
        </h3>

        <div className={`transition-all duration-1000 ease-in-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="space-y-6">
            <h4 className="text-4xl md:text-7xl font-black tracking-tighter text-white">
              {renderHighlightedBio(detailedBios[currentTextIndex].name)}
            </h4>
            <div className="space-y-4 max-w-3xl mx-auto">
              <p className="cinematic-text text-amber-500/80 text-xs md:text-sm tracking-[0.3em] uppercase italic">
                {detailedBios[currentTextIndex].title}
              </p>
              <div className="w-12 h-[1px] bg-primary mx-auto opacity-50" />
              <p className="text-lg md:text-xl text-white/90 font-light leading-relaxed">
                Elements: {renderHighlightedBio(detailedBios[currentTextIndex].elements)}
              </p>
              <p className="text-base md:text-lg text-white/60 font-light leading-relaxed italic">
                {detailedBios[currentTextIndex].abilities}
              </p>
            </div>
          </div>
        </div>

        <div className="pt-16 flex items-center justify-center gap-4 text-white">
          <div className="w-12 h-[1px] bg-white/10" />
          <span className="cinematic-text text-[8px] tracking-[0.3em] text-white/30">7 Warriors. One Fate.</span>
          <div className="w-12 h-[1px] bg-white/10" />
        </div>
      </div>
    </section>
  );
}

function ContactSection({ onOpenForm }: { onOpenForm: () => void }) {
  return (
    <section className="relative z-10 py-32 md:py-48 px-8 bg-black flex flex-col items-center justify-center text-center">
      <div className="max-w-3xl mx-auto space-y-12">
        <p className="text-xl md:text-3xl text-white/90 font-light leading-relaxed tracking-wide balance-text">
          Are you a writer, animator or investor and you’d like to contribute or be a part of this ground breaking African film, please fill the form below to contact us.
        </p>

        <button
          onClick={onOpenForm}
          className="group relative px-12 py-4 overflow-hidden rounded-full bg-primary text-black font-bold cinematic-text text-xs tracking-[0.4em] transition-transform hover:scale-105 active:scale-95 shadow-[0_0_30px_rgba(245,158,11,0.3)]"
        >
          <span className="relative z-10">Create with us</span>
          <div className="absolute inset-0 bg-white translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
        </button>
      </div>
    </section>
  );
}

function ContactForm({ onClose }: { onClose: () => void }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  // Form state
  const [fields, setFields] = useState({ name: '', email: '', role: 'write', message: '' });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  // Trigger open animation on mount
  useEffect(() => {
    const frame = requestAnimationFrame(() => setIsOpen(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  const handleClose = () => {
    setIsClosing(true);
    setIsOpen(false);
    setTimeout(onClose, 800);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFields(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMsg('');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(fields),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Submission failed.');
      setStatus('success');
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : 'Something went wrong.');
      setStatus('error');
    }
  };

  const scrollStyle: React.CSSProperties = {
    transform: isOpen && !isClosing ? 'scaleY(1)' : 'scaleY(0.03)',
    transformOrigin: 'center center',
    transition: isClosing
      ? 'transform 0.6s cubic-bezier(0.7, 0, 0.84, 0)'
      : 'transform 0.75s cubic-bezier(0.16, 1, 0.3, 1)',
    willChange: 'transform',
  };

  const contentStyle: React.CSSProperties = {
    opacity: isOpen && !isClosing ? 1 : 0,
    transform: isOpen && !isClosing ? 'translateY(0px)' : 'translateY(12px)',
    transition: isClosing
      ? 'opacity 0.2s ease-in, transform 0.2s ease-in'
      : 'opacity 0.4s 0.65s ease-out, transform 0.4s 0.65s ease-out',
    pointerEvents: isClosing ? 'none' : 'auto',
  };

  const overlayStyle: React.CSSProperties = {
    opacity: isOpen && !isClosing ? 1 : 0,
    transition: 'opacity 0.4s ease-out',
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-md" style={overlayStyle} onClick={handleClose} />

      <div className="relative w-full max-w-2xl min-h-[600px] flex items-center justify-center">
        {/* Scroll — unrolls from centre */}
        <div className="absolute inset-0 z-0" style={scrollStyle}>
          <div className="absolute inset-x-0 top-0 h-6 bg-gradient-to-b from-black/15 to-transparent z-10 pointer-events-none" />
          <div className="absolute inset-x-0 bottom-0 h-6 bg-gradient-to-t from-black/15 to-transparent z-10 pointer-events-none" />
          <Image src="/11468999.png" alt="Scroll Background" fill className="object-contain drop-shadow-[0_0_60px_rgba(0,0,0,0.7)]" />
        </div>

        {/* Content — fades in after scroll opens */}
        <div className="relative z-10 w-full max-w-sm px-10 pt-40 pb-32" style={contentStyle}>
          <button type="button" onClick={handleClose} className="absolute top-28 right-8 text-black/40 hover:text-black transition-colors p-2">✕</button>

          {status === 'success' ? (
            /* ── Success state ── */
            <div className="text-center space-y-6 text-stone-900 font-serif py-8">
              <div className="text-4xl">✦</div>
              <h3 className="text-lg font-bold tracking-wide">Your decree has been received.</h3>
              <p className="text-sm opacity-70 leading-relaxed">We will reach out to you on your path to Bulan.</p>
              <button
                onClick={handleClose}
                className="mt-4 px-8 py-3 bg-stone-900 text-white text-[10px] uppercase tracking-[0.4em] font-bold hover:bg-black transition-all shadow-lg"
              >
                Close
              </button>
            </div>
          ) : (
            /* ── Form state ── */
            <form onSubmit={handleSubmit} className="space-y-5 text-stone-900 font-serif">
              <div className="space-y-1">
                <label className="text-[10px] uppercase tracking-widest opacity-60 font-bold block">Name</label>
                <input
                  name="name" type="text" value={fields.name} onChange={handleChange}
                  className="w-full bg-transparent border-b border-stone-800/20 px-0 py-1 focus:outline-none focus:border-stone-800/40 transition-colors placeholder:text-stone-800/30 text-sm"
                  placeholder="Your Name" required
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase tracking-widest opacity-60 font-bold block">Email</label>
                <input
                  name="email" type="email" value={fields.email} onChange={handleChange}
                  className="w-full bg-transparent border-b border-stone-800/20 px-0 py-1 focus:outline-none focus:border-stone-800/40 transition-colors placeholder:text-stone-800/30 text-sm"
                  placeholder="Email Address" required
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase tracking-widest opacity-60 font-bold block">How would you like to work with us?</label>
                <select
                  name="role" value={fields.role} onChange={handleChange}
                  className="w-full bg-transparent border-b border-stone-800/20 px-0 py-1 focus:outline-none focus:border-stone-800/40 transition-colors appearance-none cursor-pointer text-sm"
                >
                  <option value="write">Write</option>
                  <option value="animate">Animate</option>
                  <option value="invest">Invest</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase tracking-widest opacity-60 font-bold block">Let us know about you</label>
                <textarea
                  name="message" value={fields.message} onChange={handleChange} rows={3}
                  className="w-full bg-white/5 border border-stone-800/10 p-2 focus:outline-none focus:bg-white/10 transition-colors placeholder:text-stone-800/30 text-xs resize-none"
                  placeholder="Tell us your story..." required
                />
              </div>

              {status === 'error' && (
                <p className="text-red-700 text-xs text-center">{errorMsg}</p>
              )}

              <div className="pt-4 flex justify-center">
                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="px-8 py-3 bg-stone-900 text-white text-[10px] uppercase tracking-[0.4em] font-bold hover:bg-black transition-all shadow-lg active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {status === 'loading' ? (
                    <>
                      <span className="inline-block w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Sending…
                    </>
                  ) : 'Send Decree'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}





function CreditsSection() {
  return (
    <section className="relative z-10 py-20 md:py-32 px-8 bg-black flex flex-col items-center justify-center text-center">
      <div className="max-w-4xl mx-auto space-y-20">
        <div className="space-y-4">
          <h5 className="cinematic-text text-[9px] tracking-[0.4em] text-white/40 uppercase">Produced by</h5>
          <p className="text-2xl md:text-4xl font-black tracking-tight text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]">
            Magic Carpet Studios
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-32 pt-8">
          <div className="space-y-4 text-center md:text-right">
            <h5 className="cinematic-text text-[9px] tracking-[0.4em] text-white/40 uppercase">Executive Producer</h5>
            <p className="text-xl md:text-2xl font-bold text-white tracking-wide">
              Ferdy Ladi Adimefe
            </p>
          </div>

          <div className="space-y-4 text-center md:text-left">
            <h5 className="cinematic-text text-[9px] tracking-[0.4em] text-white/40 uppercase">Director</h5>
            <p className="text-xl md:text-2xl font-bold text-white tracking-wide">
              Duru Azubuike
            </p>
          </div>
        </div>

        <div className="pt-32 opacity-20">
          <div className="w-16 h-[1px] bg-white mx-auto mb-8" />
          <p className="cinematic-text text-[8px] tracking-[1em] uppercase text-white">
            LEGENDS OF BULAN
          </p>
        </div>
      </div>
    </section>
  );
}
