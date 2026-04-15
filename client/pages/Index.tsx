import {
  AlignLeft,
  X,
  ExternalLink,
  Github,
  Linkedin,
  Mail,
  GraduationCap,
  BookOpen,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";
import { lenis } from "@/lib/lenis";
import { motion } from "framer-motion";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { Project, PROJECTS } from "@/lib/data";
import { useNavigate } from "react-router-dom";

const NAV_LINKS = [
  { href: "#projects", label: "Projects" },
  { href: "#skills", label: "Skills" },
  { href: "#achievements", label: "Achievements" },
  { href: "#contact", label: "Contact" },
];

function Nav() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [active, setActive] = useState<string>(NAV_LINKS[0].href);
  const [scrolled, setScrolled] = useState(false);
  const [indicator, setIndicator] = useState<{
    left: number;
    top: number;
    width: number;
    height: number;
  }>({ left: 0, top: 0, width: 0, height: 32 });
  const linkRefs = useRef(new Map<string, HTMLAnchorElement | null>());
  const suppressObserver = useRef(false);

  const updateIndicator = () => {
    const el = linkRefs.current.get(active);
    if (!el) return;
    const a = el as HTMLAnchorElement;
    setIndicator({
      left: a.offsetLeft,
      top: a.offsetTop,
      width: a.offsetWidth,
      height: a.offsetHeight,
    });
  };

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 450;
      setScrolled(isScrolled);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // --- UPDATED useEffect for Scroll-Spy ---
  useEffect(() => {
    const onScroll = ({ scroll }: { scroll: number }) => {
      if (suppressObserver.current) return;

      const offset = 140;
      const y = scroll + offset; // Use 'scroll' from Lenis
      let current = NAV_LINKS[0].href;

      for (const l of NAV_LINKS) {
        const el = document.querySelector(l.href) as HTMLElement | null;
        if (el && el.offsetTop <= y) {
          current = l.href;
        }
      }

      const isAtBottom =
        window.innerHeight + scroll >= document.body.offsetHeight - 2;
      if (isAtBottom) {
        current = NAV_LINKS[NAV_LINKS.length - 1].href;
      }

      setActive(current);
    };

    // Subscribe to the Lenis scroll event
    lenis.on("scroll", onScroll);

    // Cleanup function to unsubscribe
    return () => {
      lenis.off("scroll", onScroll);
    };
  }, []);

  useEffect(() => {
    updateIndicator();
    const onResize = () => updateIndicator();
    window.addEventListener("resize", onResize);
    const i = window.setTimeout(updateIndicator, 50);
    return () => {
      window.removeEventListener("resize", onResize);
      window.clearTimeout(i);
    };
  }, [active]);

  // --- UPDATED onNavClick to use Lenis ---
  const onNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    suppressObserver.current = true;
    setActive(href);

    lenis.scrollTo(href, { offset: -100, duration: 1.5 });

    window.history.replaceState(null, "", href);
    requestAnimationFrame(updateIndicator);
    window.setTimeout(() => {
      suppressObserver.current = false;
    }, 900);
  };

  const handleMobileLinkClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string,
  ) => {
    onNavClick(e, href);
    setIsMenuOpen(false);
  };

  return (
    <>
      <header className="fixed top-7 left-0 right-0 z-50">
        <nav
          className={cn(
            "mx-auto w-[95%] py-1 max-w-7xl rounded-full border border-white/10 bg-gradient-to-b from-white/5 to-white/[0.03] backdrop-blur-lg shadow-neon-purple transition-colors duration-300",
            scrolled && "bg-card/80 border-transparent",
          )}
        >
          <div className="flex items-center justify-between px-4 xxxsm:py-2 xxsm:py-3">
            <a
              href="#"
              className="pl-4 font-display text-sm xxxsm:text-base xxsm:text-xl tracking-wider text-white"
            >
              Priyanshu.
            </a>
            <div className="relative hidden md:block">
              <ul
                id="nav-links-container"
                className="relative flex items-center gap-2 pr-1"
              >
                <div
                  className="pointer-events-none absolute left-0 top-0 rounded-full bg-white/10 ring-1 ring-white/20 transition-[transform,width,height] duration-300 ease-out will-change-transform"
                  style={{
                    transform: `translate(${indicator.left}px, ${indicator.top}px)`,
                    width: indicator.width,
                    height: indicator.height,
                  }}
                />
                {NAV_LINKS.map((l) => {
                  const isActive = active === l.href;
                  return (
                    <li key={l.href}>
                      <a
                        ref={(node) => linkRefs.current.set(l.href, node)}
                        href={l.href}
                        onClick={(e) => onNavClick(e, l.href)}
                        aria-current={isActive ? "page" : undefined}
                        className={cn(
                          "relative z-10 px-3 py-2 rounded-full text-md transition-colors",
                          isActive
                            ? "text-white"
                            : "text-zinc-300 hover:text-white",
                        )}
                      >
                        {l.label}
                      </a>
                    </li>
                  );
                })}
              </ul>
            </div>
            <div className="flex items-center gap-2">
              {/* HIRE ME BUTTON (Always visible) */}
              <a
                href="#contact"
                onClick={(e) => onNavClick(e, "#contact")}
                className={cn(
                  "rounded-full px-5 py-2 xxxsm:text-[13px] xxsm:text-[15px] font-medium text-white",
                  "bg-gradient-to-r from-neon-purple via-neon-blue to-neon-pink bg-[length:250%_200%]",
                  "transition-all duration-500 ease-in-out",
                  "hover:bg-[position:80%_0%]",
                )}
              >
                Hire Me
              </a>

              {/* HAMBURGER BUTTON (Visible only on mobile) */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden p-2 rounded-full text-white hover:bg-white/10 focus:outline-none"
                aria-label="Toggle menu"
              >
                {isMenuOpen ? <X size={24} /> : <AlignLeft size={24} />}
              </button>
            </div>
          </div>
        </nav>
      </header>
      <div
        className={cn(
          "md:hidden fixed bottom-0 left-0 right-0 z-40 w-full",
          "bg-card/80 backdrop-blur-lg rounded-t-2xl border-x border-t border-white/10 shadow-lg",
          "transition-transform duration-300 ease-in-out",
          isMenuOpen
            ? "translate-y-0"
            : "translate-y-full pointer-events-none",
        )}
      >
        <ul className="flex flex-col items-center gap-2 p-4 pt-6 pb-safe">
          {NAV_LINKS.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                onClick={(e) => handleMobileLinkClick(e, l.href)}
                className="block w-full text-center text-zinc-300 hover:text-white px-4 py-2 rounded-md"
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

function Hero() {
  const handleScroll = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string,
  ) => {
    e.preventDefault();
    lenis.scrollTo(href, { offset: -100, duration: 1.5 });
  };

  return (
    <section className="relative overflow-hidden pt-32 sm:pt-36 pb-20 bg-hero-gradient">
      <div className="pointer-events-none absolute inset-0 -z-10 [background:radial-gradient(700px_300px_at_50%_-10%,hsl(var(--neon-purple)/.12),transparent),radial-gradient(700px_300px_at_80%_30%,hsl(var(--neon-blue)/.12),transparent)] [mask-image:radial-gradient(ellipse_at_center,black,transparent_65%)]" />

      {/* Full-width wrapper: no Tailwind `container`, so no breakpoint max-width jumps */}
      <div className="w-full">
        {/* 12-col grid to control left offset + content width as percentages */}
        <div className="grid grid-cols-12 gap-x-4 md:gap-x-6">
          {/* Left gutter kept small above 638px to reduce big empty space */}
          <div className="col-span-1 sm:col-span-1 md:col-span-1 lg:col-span-1 xl:col-span-1" />

          {/* Content area: splits into left text and right Identity Module */}
          <div className="col-span-10 sm:col-span-10 md:col-span-10 flex flex-col-reverse md:flex-row items-center md:items-start justify-between w-full">

            {/* Text Column */}
            <div className="w-full md:w-[55%] lg:w-[60%] flex flex-col mt-6 md:mt-0">
              <h1 className="font-hero xxxsm:text-3xl xxsm:text-4xl xsm:text-5xl bmd:text-6xl bbmd:text-7xl font-extrabold md:mt-10 leading-[1.1] pb-2 bg-gradient-to-r from-white via-zinc-300 to-white bg-clip-text text-transparent">
                Priyanshu Singh Chauhan
              </h1>

              <p className="xxxsm:text-[14px] xxsm:text-sm md:text-base uppercase pb-2 xxxsm:tracking-[0.10em] xxsm:tracking-[0.15em] md:tracking-[0.2em] text-zinc-400">
                WEB DEVELOPER
              </p>

              <p className="mt-4 text-zinc-300 xxxsm:text-sm xxsm:text-base max-w-xl">
                I build fast, elegant web experiences with modern stacks and a
                focus on performance, accessibility, and delightful UX.
              </p>

              <div className="mt-8 flex xxxsm:flex-col xxsm:flex-row xxxsm:w-fit gap-3">
                <a
                  href="#projects"
                  onClick={(e) => handleScroll(e, "#projects")}
                  className="rounded-full px-6 py-3 xxxsm:text-[13px] xxsm:text-sm font-semibold text-zinc-900 bg-white hover:bg-zinc-200 transition-colors"
                >
                  Explore My Work
                </a>

                <a
                  href="/Resume.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full px-6 py-3 xxxsm:text-[13px] xxsm:text-sm font-semibold text-white bg-gradient-to-r from-neon-purple/80 via-neon-blue/70 to-neon-pink/80 bg-[length:200%_200%] transition-all duration-500 ease-in-out hover:bg-[position:100%_0%]"
                >
                  View Resume
                </a>
              </div>

              <div className="mt-10 ml-1 flex gap-4 text-zinc-400">
                <a
                  href="https://github.com/priyanshusc"
                  target="_blank"
                  aria-label="GitHub"
                  className="hover:text-white transition-colors"
                >
                  <Github />
                </a>
                <a
                  href="https://www.linkedin.com/in/priyanshusinghchauhan"
                  target="_blank"
                  aria-label="LinkedIn"
                  className="hover:text-white transition-colors"
                >
                  <Linkedin />
                </a>
                <a
                  href="https://mail.google.com/mail/?view=cm&fs=1&to=priyanshusinghchauhan40@example.com&su=Hello&body=I%20want%20to%20get%20in%20touch%20with%20you"
                  target="_blank"
                  aria-label="Email"
                  className="hover:text-white transition-colors"
                >
                  <Mail />
                </a>
              </div>
            </div>

            {/* Identity Module */}
            <div className="w-full md:w-[45%] lg:w-[40%] flex justify-center md:justify-end items-center mt-4 md:mt-10 lg:mt-12">
              <div className="relative flex items-center justify-center">
                {/* Static glowing border ring */}
                <div className="absolute inset-[-4px] rounded-full shadow-[0_0_7px_hsl(var(--neon-purple)/0.7)] border border-neon-purple pointer-events-none" />

                {/* Left System Info (Desktop only) */}
                {/* <div className="absolute right-full mr-4 top-[20%] text-[8px] md:text-[10px] text-zinc-500 font-mono tracking-widest hidden md:flex flex-col items-end whitespace-nowrap">
                  <span>SYSTEM ID:</span>
                  <span>PRIYANSHU CHAUHAN</span>
                  <span>[FACE] 1.0</span>
                  <span className="inline-block mt-2 text-neon-purple text-lg">▣</span>
                </div> */}

                {/* Right System Info (Desktop only) */}
                <div className="absolute left-full ml-4 bottom-[20%] text-[8px] md:text-[10px] text-zinc-500 font-mono tracking-widest hidden md:flex flex-col items-start whitespace-nowrap">
                  <span>SYSTEM ID:</span>
                  <span>PRIYANSHU CHAUHAN</span>
                  <span>[Bio] 1.0</span>
                  <span className="inline-block mt-2 text-neon-purple text-lg">◈</span>
                </div>

                {/* Main Avatar Container */}
                <div className="relative w-44 h-44 xxsm:w-52 xxsm:h-52 xsm:w-60 xsm:h-60 md:w-72 md:h-72 lg:w-80 lg:h-80 rounded-full overflow-hidden p-1 bg-gradient-to-b from-white/10 to-transparent border border-white/10 backdrop-blur-sm shadow-neon-purple">
                  <div className="w-full h-full rounded-full overflow-hidden relative group">
                    {/* Image */}
                    <img
                      src="/profile.jpeg"
                      alt="Priyanshu Singh Chauhan"
                      className="w-full h-full object-cover object-center"
                    />

                    {/* Holographic Grid Pattern Overlay */}

                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Right gutter to balance; grows slightly on larger screens */}
          <div className="col-span-1 sm:col-span-1 md:col-span-1 lg:col-span-1 xl:col-span-1" />
        </div>
      </div>
    </section>
  );
}

function ProjectCard({ p }: { p: Project }) {
  const navigate = useNavigate();
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!api) return;

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap());

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  return (
    <div
      onClick={() => {
        // Save scroll position
        sessionStorage.setItem("indexScroll", window.scrollY.toString());
        navigate(`/project/${p.id}`);
      }}
      className="group rounded-2xl border border-white/10 bg-card/60 backdrop-blur-sm overflow-hidden transition-all duration-300 hover:shadow-neon-purple-light flex flex-col cursor-pointer"
    >
      {/* CAROUSEL SECTION */}
      <div className="relative w-full">
        <Carousel
          setApi={setApi}
          plugins={[
            Autoplay({
              delay: 2000,
              stopOnInteraction: false,
              stopOnMouseEnter: true,
            }),
          ]}
          className="w-full"
        >
          <CarouselContent>
            {p.images.map((imgSrc, index) => (
              <CarouselItem key={index}>
                <div className="relative h-44 w-full overflow-hidden">
                  <img
                    src={imgSrc}
                    alt={`${p.title} slide ${index + 1}`}
                    className="h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>

        {/* PAGINATION DOTS */}
        <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1.5 z-10">
          {Array.from({ length: count }).map((_, index) => (
            <button
              key={index}
              onClick={() => api?.scrollTo(index)}
              className={cn(
                "h-1.5 rounded-full transition-all duration-300 cursor-pointer",
                current === index
                  ? "w-4 bg-neon-purple"
                  : "w-1.5 bg-white/50 hover:bg-white/80",
              )}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>

      {/* CONTENT SECTION */}
      <div className="p-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-lg">{p.title}</h3>
          <a
            href={p.githubLink}
            target="_blank"
            onClick={(e) => e.stopPropagation()}
            className="text-neon-purple hover:text-white inline-flex items-center gap-1 text-sm transition-colors"
          >
            View <ExternalLink className="size-4" />
          </a>
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          {p.stack.map((s) => (
            <span
              key={s}
              className="text-xs rounded-lg border border-white/10 bg-white/5 px-2 py-1 text-zinc-300"
            >
              {s}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

function Projects() {
  return (
    <section
      id="projects"
      className="pb-16 pt-4 md:pt-12 scroll-mt-28 sm:scroll-mt-36"
    >
      <div className="container max-w-7xl px-6 md:px-8">
        <h2 className="font-display font-semibold text-3xl sm:text-4xl text-center mb-10">
          My Projects
        </h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {PROJECTS.map((p) => (
            <ProjectCard key={p.title} p={p} />
          ))}
        </div>
      </div>
    </section>
  );
}

const SKILL_CATEGORIES = [
  {
    title: "LANGUAGES",
    skills: ["JavaScript (ES6+)", "C++", "HTML5", "CSS3"],
  },
  {
    title: "FRONTEND DEVELOPMENT",
    skills: ["React.js", "Redux", "TanStack Query", "Tailwind CSS", "Bootstrap"],
  },
  {
    title: "BACKEND & REAL-TIME",
    skills: ["Node.js", "Express.js", "REST APIs", "WebSockets"],
  },
  {
    title: "DATABASE & CLOUD",
    skills: ["MongoDB", "Mongoose (ODM)", "Firebase", "Vercel", "Netlify"],
  },
  {
    title: "DEVOPS & DESIGN TOOLS",
    skills: ["Docker", "Git", "GitHub", "Postman", "Figma", "VS Code"],
  },
  {
    title: "CORE ENGINEERING FUNDAMENTALS",
    skills: ["DSA", "OOPs", "System Design"],
  },
];

function Skills() {
  return (
    <section id="skills" className="py-16 scroll-mt-28 sm:scroll-mt-36">
      <div className="container max-w-7xl px-5 md:px-8">
        <h2 className="font-display font-semibold text-3xl sm:text-4xl text-center mb-10">
          Technical Skills
        </h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {SKILL_CATEGORIES.map((category) => (
            <div
              key={category.title}
              className="group relative flex flex-col rounded-2xl border border-white/10 bg-card/60 backdrop-blur-sm p-6 overflow-hidden transition-all duration-300 hover:shadow-neon-purple-light"
            >
              {/* Subtle top border highlight on hover */}
              <div className="pointer-events-none absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:via-neon-purple transition-colors duration-500" />

              <h3 className="mb-5 font-display text-sm sm:text-base font-bold tracking-[0.14em] text-white/90">
                {category.title}
              </h3>
              <div className="flex flex-wrap gap-2.5">
                {category.skills.map((skill) => (
                  <span
                    key={skill}
                    className="inline-flex items-center cursor-pointer rounded-md border border-white/10 bg-white/5 px-3 py-1.5 text-sm text-zinc-300 transition-colors group-hover:bg-white/10 group-hover:text-white"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Education() {
  return (
    <section id="education" className="py-16 scroll-mt-28 sm:scroll-mt-36">
      <div className="container max-w-7xl px-6 md:px-8">
        <h2 className="font-display font-semibold text-3xl sm:text-4xl text-center mb-8">
          Education
        </h2>
        <div className="grid gap-6 md:grid-cols-2">
          {/* College */}
          <div className="relative rounded-2xl border border-white/10 bg-card/60 backdrop-blur-sm px-6 py-10 overflow-hidden">
            <div className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-neon-purple via-neon-blue to-neon-pink" />
            <div className="flex items-start gap-4">
              <div className="rounded-xl bg-white/10 ring-1 ring-white/20 p-3">
                <GraduationCap className="h-6 w-6 text-zinc-200" />
              </div>
              <div>
                <h3 className="font-semibold leading-snug">
                  Dr. A.P.J. Abdul Kalam Technical University
                </h3>
                <p className="text-sm text-zinc-400 mt-1">
                  B.Tech • Computer Science & Engineering (Data Science)
                </p>
                <div className="mt-3 inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-zinc-300">
                  2022 - 2026
                </div>
              </div>
            </div>
          </div>
          {/* School */}
          <div className="relative rounded-2xl border border-white/10 bg-card/60 backdrop-blur-sm px-6 py-10 overflow-hidden">
            <div className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-neon-blue via-neon-purple to-neon-pink" />
            <div className="flex items-start gap-4">
              <div className="rounded-xl bg-white/10 ring-1 ring-white/20 p-3">
                <BookOpen className="h-6 w-6 text-zinc-200" />
              </div>
              <div>
                <h3 className="font-semibold leading-snug">
                  Emmanual Mission Sr. Sec. School
                </h3>
                <p className="text-sm text-zinc-400 mt-1">High School</p>
                <div className="mt-3 inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-zinc-300">
                  2018 – 2021
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

type Achievement = {
  title: string;
  image: string;
  href: string;
  issuer: string;
};

const ACHIEVEMENTS: Achievement[] = [
  {
    title: "Oracle Certified GenAI Professional",
    image: "/Oracle.png",
    href: "https://catalog-education.oracle.com/ords/certview/sharebadge?id=E49232384E76C1B5B609A13DE64107E71FEDE88F27B5F24AC2FD806F0F4ECB86",
    issuer: "Certified by Oracle for Generative AI skills.",
  },
  {
    title: "AI and Data Scientist",
    image: "/Oneroadmap.png",
    href: "https://oneroadmap.io/skills/ai-ds/certificate/CERT-B3E7D6BB",
    issuer: "Awarded by Oneroadmap",
  },
  {
    title: "Google Analytics Certification",
    image: "/GoogleAnalytics.jpeg",
    href: "https://skillshop.credential.net/4c780f5e-5493-46ab-9d80-53b2287db4bb#acc.eDcIdays",
    issuer: "Awarded by Google for data analysis skills.",
  },
];

function AchievementCard({ a }: { a: Achievement }) {
  return (
    <div className="group rounded-2xl border border-white/10 bg-card/60 backdrop-blur-sm overflow-hidden transition-all duration-300 hover:scale-102 hover:shadow-neon-purple-light">
      <div className="h-52 w-full overflow-hidden">
        <img src={a.image} alt={a.title} className="" />
      </div>
      <div className="p-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-lg">{a.title}</h3>
          <a
            href={a.href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-neon-blue hover:text-white inline-flex items-center gap-1 text-sm"
          >
            View <ExternalLink className="size-4" />
          </a>
        </div>
        <p className="mt-2 text-sm text-zinc-300">{a.issuer}</p>
      </div>
    </div>
  );
}

// This component now maps over your new ACHIEVEMENTS array
function Achievements() {
  return (
    <section id="achievements" className="py-16 scroll-mt-28 sm:scroll-mt-36">
      <div className="container max-w-6xl px-6 md:px-8">
        <h2 className="font-display font-semibold text-3xl sm:text-4xl text-center mb-10">
          Achievements & Certifications
        </h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {ACHIEVEMENTS.map((achievement) => (
            <AchievementCard key={achievement.title} a={achievement} />
          ))}
        </div>
      </div>
    </section>
  );
}

function Contact() {
  return (
    <section id="contact" className="py-16 scroll-mt-28 sm:scroll-mt-36">
      <div className="container max-w-4xl px-5 md:px-8">
        <h2 className="font-display font-semibold text-3xl sm:text-4xl text-center md:mb-3 mb-5">
          Contact Me
        </h2>
        <p className="text-center font-sans md:text-lg xsm:text-base text-zinc-400">
          I'm open to new opportunities and collaborations. Feel free to reach
          out!
        </p>
        <div className="mt-[43px] flex justify-center xxxsm:gap-5 xxsm:gap-6 text-zinc-400">
          <a
            href="https://github.com/priyanshusc"
            aria-label="GitHub"
            className="hover:text-white transition-colors"
          >
            <Github className="md:h-[30px] md:w-[30px] xsm:h-[24px] xsm:w-[24px]" />
          </a>
          <a
            href="https://linkedin.com/in/priyanshusinghchauhan"
            target="_blank"
            aria-label="LinkedIn"
            className="hover:text-white transition-colors"
          >
            <Linkedin className="md:h-[30px] md:w-[30px] xsm:h-[24px] xsm:w-[24px]" />
          </a>
          <a href="https://x.com/Priyanshusc05" target="_blank">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              className="tabler-icon tabler-icon-brand-x transition-colors cursor-pointer hover:text-white md:h-[30px] md:w-[30px] xsm:h-[24px] xsm:w-[24px]"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M4 4l11.733 16h4.267l-11.733 -16z"></path>
              <path d="M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772"></path>
            </svg>
          </a>
          <a
            href="https://mail.google.com/mail/?view=cm&fs=1&to=priyanshusinghchauhan40@example.com&su=Hello&body=I%20want%20to%20get%20in%20touch%20with%20you"
            aria-label="Email"
            className="hover:text-white transition-colors"
          >
            <Mail className="md:h-[30px] md:w-[30px] xsm:h-[24px] xsm:w-[24px]" />
          </a>
        </div>
      </div>
    </section>
  );
}

let savedScrollPosition = 0;

export default function Index() {
  useEffect(() => {
    if (savedScrollPosition > 0) {
      window.scrollTo(0, savedScrollPosition);
      lenis.scrollTo(savedScrollPosition, { immediate: true });
    }

    const handleScroll = () => {
      savedScrollPosition = window.scrollY;
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <Nav />
      <motion.main
        initial={{ opacity: 0, filter: "brightness(0)" }}
        animate={{ opacity: 1, filter: "brightness(1)" }}
        exit={{ opacity: 0, filter: "brightness(0)" }}
        transition={{ duration: 0.2, ease: "easeInOut" }}
        className="min-h-screen text-white"
      >
        <Hero />
        <Projects />
        <Skills />
        <Education />
        <Achievements />
        <Contact />
        <div className="h-[1px] w-[80%] mx-auto bg-gray-200"></div>
        <footer className="pb-10 pt-4 text-sm sm:text-base text-center text-zinc-500">
          © {new Date().getFullYear()} Priyanshu Singh Chauhan
        </footer>
      </motion.main>
    </>
  );
}
