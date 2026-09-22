"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import MistCanvas from "../components/MistCanvas";
import FluidField from "../components/FluidField";

gsap.registerPlugin(ScrollTrigger);

const IMAGES = {
  forest:
    "https://images.unsplash.com/photo-1511497584788-876760111969?auto=format&fit=crop&q=88&w=2400",
  house:
    "https://images.unsplash.com/photo-1549693578-d683be217e58?auto=format&fit=crop&q=88&w=2400",
  interior:
    "https://images.unsplash.com/photo-1600607688969-a5bfcd646154?auto=format&fit=crop&q=88&w=2400",
  stone:
    "https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&q=88&w=2400",
  light:
    "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&q=88&w=2400",
};

const states = [
  { index: "01", title: "Material", text: "Honest surfaces, softened by time.", image: IMAGES.stone },
  { index: "02", title: "Light", text: "Shadow gives form its meaning.", image: IMAGES.light },
  { index: "03", title: "Rhythm", text: "Space is composed through pause.", image: IMAGES.interior },
];

const projects = [
  {
    index: "01",
    eyebrow: "OBJECT / STONE",
    title: "Stone Vessel",
    text: "Weight made quiet. A study in restraint, surface and the imperfect edge.",
    image: IMAGES.stone,
    align: "left",
  },
  {
    index: "02",
    eyebrow: "OBJECT / LIGHT",
    title: "Paper Light",
    text: "A glow shaped by shadow. Soft illumination that never asks for attention.",
    image: IMAGES.light,
    align: "right",
  },
  {
    index: "03",
    eyebrow: "OBJECT / CEDAR",
    title: "Cedar Bench",
    text: "A place to pause. Proportion, grain and silence composed as one gesture.",
    image: IMAGES.house,
    align: "left",
  },
];

function RollingLink({ children, href = "#" }: { children: string; href?: string }) {
  return (
    <a className="rolling-link magnetic" href={href}>
      <span className="rolling-window">
        <span className="rolling-track">
          <span>{children}</span>
          <span aria-hidden="true">{children}</span>
        </span>
      </span>
      <span className="link-mark" aria-hidden="true">↗</span>
    </a>
  );
}

function EdgeLabel({ children }: { children: React.ReactNode }) {
  return <div className="edge-label">{children}</div>;
}

function LiveClock({ zone, label }: { zone: string; label: string }) {
  const [value, setValue] = useState("--:--:--");

  useEffect(() => {
    const update = () => {
      setValue(
        new Intl.DateTimeFormat("en-GB", {
          timeZone: zone,
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
        }).format(new Date())
      );
    };
    update();
    const timer = window.setInterval(update, 1000);
    return () => window.clearInterval(timer);
  }, [zone]);

  return (
    <div className="clock">
      <span>{label}</span>
      <time>{value}</time>
    </div>
  );
}

export default function Home() {
  const rootRef = useRef<HTMLElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [progress, setProgress] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const [activeState, setActiveState] = useState(0);

  const menuItems = useMemo(
    () => ["Home", "Philosophy", "Objects", "Spaces", "Journal", "Studio", "Contact"],
    []
  );

  useEffect(() => {
    let current = 0;
    const timer = window.setInterval(() => {
      current += Math.max(2, Math.round((100 - current) * 0.2));
      if (current >= 100) {
        current = 100;
        setProgress(100);
        window.clearInterval(timer);
        window.setTimeout(() => setLoaded(true), 160);
      } else {
        setProgress(current);
      }
    }, 28);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    const lenis = new Lenis({
      duration: 0.72,
      smoothWheel: true,
      syncTouch: false,
      wheelMultiplier: 1.0,
    });

    const raf = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);
    lenis.on("scroll", ScrollTrigger.update);

    return () => {
      lenis.destroy();
      gsap.ticker.remove(raf);
    };
  }, []);

  useEffect(() => {
    if (!loaded || !rootRef.current) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    const ctx = gsap.context(() => {
      gsap.defaults({ ease: "power4.out" });

      const heroTl = gsap.timeline({ delay: 0.04 });
      heroTl
        .fromTo(
          ".hero-kicker",
          { y: 14, opacity: 0, filter: "blur(6px)" },
          { y: 0, opacity: 1, filter: "blur(0px)", duration: 0.55 }
        )
        .fromTo(
          ".hero-title .line",
          { yPercent: 115, opacity: 0, rotateX: 10, filter: "blur(8px)" },
          {
            yPercent: 0,
            opacity: 1,
            rotateX: 0,
            filter: "blur(0px)",
            duration: 0.82,
            stagger: 0.08,
          },
          "-=0.28"
        )
        .fromTo(
          ".hero-meta, .scroll-cue",
          { y: 10, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.42, stagger: 0.06 },
          "-=0.34"
        );

      gsap.to(".hero-title .line:first-child", {
        xPercent: -4,
        yPercent: -8,
        opacity: 0.2,
        ease: "none",
        scrollTrigger: {
          trigger: ".hero",
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });

      gsap.to(".hero-title .line:last-child", {
        xPercent: 4,
        yPercent: -3,
        opacity: 0.2,
        ease: "none",
        scrollTrigger: {
          trigger: ".hero",
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });

      gsap.to(".mist-canvas", {
        scale: 1.06,
        opacity: 0.68,
        transformOrigin: "50% 50%",
        ease: "none",
        scrollTrigger: {
          trigger: ".hero",
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });

      gsap.utils.toArray<HTMLElement>(".edge-label").forEach((label) => {
        gsap.fromTo(
          label,
          { opacity: 0, y: 18 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            scrollTrigger: { trigger: label.parentElement, start: "top 82%", once: true },
          }
        );
      });

      gsap.utils.toArray<HTMLElement>(".line-mask").forEach((mask) => {
        const line = mask.querySelector<HTMLElement>(".reveal-line");
        if (!line) return;

        gsap.fromTo(
          line,
          { yPercent: 118, rotateX: 8, opacity: 0.05, filter: "blur(5px)" },
          {
            yPercent: 0,
            rotateX: 0,
            opacity: 1,
            filter: "blur(0px)",
            duration: 0.78,
            scrollTrigger: {
              trigger: mask,
              start: "top 88%",
              once: true,
            },
          }
        );
      });

      gsap.utils.toArray<HTMLElement>(".fade-up").forEach((item) => {
        gsap.fromTo(
          item,
          { y: 22, opacity: 0, filter: "blur(4px)" },
          {
            y: 0,
            opacity: 1,
            filter: "blur(0px)",
            duration: 0.62,
            scrollTrigger: {
              trigger: item,
              start: "top 90%",
              once: true,
            },
          }
        );
      });

      gsap.utils.toArray<HTMLElement>(".media-shell").forEach((shell) => {
        if (shell.classList.contains("project-media")) return;

        const inner = shell.querySelector<HTMLElement>(".media-inner");
        if (!inner) return;

        gsap.set(shell, { clipPath: "inset(0 0 100% 0)" });
        gsap.set(inner, { scale: 1.085, yPercent: 3 });

        const reveal = gsap.timeline({
          scrollTrigger: {
            trigger: shell,
            start: "top 88%",
            once: true,
          },
        });

        reveal
          .to(shell, {
            clipPath: "inset(0 0 0% 0)",
            duration: 0.92,
            ease: "power4.inOut",
          })
          .to(
            inner,
            {
              scale: 1,
              yPercent: 0,
              duration: 1.05,
              ease: "power3.out",
            },
            0.08
          );

        gsap.fromTo(
          inner,
          { yPercent: -2.5 },
          {
            yPercent: 2.5,
            ease: "none",
            scrollTrigger: {
              trigger: shell,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          }
        );
      });

      gsap.utils.toArray<HTMLElement>(".state-copy").forEach((state, index) => {
        ScrollTrigger.create({
          trigger: state,
          start: "top 58%",
          end: "bottom 42%",
          onEnter: () => setActiveState(index),
          onEnterBack: () => setActiveState(index),
        });
      });

      gsap.utils.toArray<HTMLElement>(".project").forEach((project) => {
        const media = project.querySelector<HTMLElement>(".project-media");
        const inner = project.querySelector<HTMLElement>(".project-media .media-inner");
        const eyebrow = project.querySelector<HTMLElement>(".project-eyebrow");
        const heading = project.querySelector<HTMLElement>(".project-copy h3");
        const body = project.querySelector<HTMLElement>(".project-copy p");
        const link = project.querySelector<HTMLElement>(".rolling-link");
        const number = project.querySelector<HTMLElement>(".project-number");
        const fromRight = project.classList.contains("project--right");

        if (media && inner) {
          gsap.set(media, {
            clipPath: fromRight ? "inset(0 0 0 100%)" : "inset(0 100% 0 0)",
          });
          gsap.set(inner, {
            scale: 1.1,
            xPercent: fromRight ? -3 : 3,
          });

          const mediaTl = gsap.timeline({
            scrollTrigger: {
              trigger: project,
              start: "top 82%",
              once: true,
            },
          });

          mediaTl
            .to(media, {
              clipPath: "inset(0 0% 0 0%)",
              duration: 0.9,
              ease: "power4.inOut",
            })
            .to(
              inner,
              {
                scale: 1,
                xPercent: 0,
                duration: 1.05,
                ease: "power3.out",
              },
              0.06
            );

          gsap.to(inner, {
            yPercent: fromRight ? 3.5 : -3.5,
            ease: "none",
            scrollTrigger: {
              trigger: project,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          });
        }

        const copyTargets = [eyebrow, heading, body, link].filter(Boolean);
        gsap.fromTo(
          copyTargets,
          {
            y: 28,
            opacity: 0,
            filter: "blur(5px)",
            clipPath: "inset(0 0 18% 0)",
          },
          {
            y: 0,
            opacity: 1,
            filter: "blur(0px)",
            clipPath: "inset(0 0 0% 0)",
            duration: 0.66,
            stagger: 0.08,
            scrollTrigger: {
              trigger: project,
              start: "top 78%",
              once: true,
            },
          }
        );

        if (number) {
          gsap.fromTo(
            number,
            { opacity: 0, x: fromRight ? -14 : 14 },
            {
              opacity: 1,
              x: 0,
              duration: 0.55,
              scrollTrigger: {
                trigger: project,
                start: "top 82%",
                once: true,
              },
            }
          );
        }
      });

      gsap.fromTo(
        ".journal-inner",
        { y: 48, opacity: 0, scale: 0.985 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.9,
          scrollTrigger: {
            trigger: ".journal",
            start: "top 74%",
            once: true,
          },
        }
      );

      gsap.fromTo(
        ".footer h2, .footer-contact, .footer-nav, .footer-studio",
        { y: 28, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.7,
          stagger: 0.07,
          scrollTrigger: {
            trigger: ".footer",
            start: "top 84%",
            once: true,
          },
        }
      );
    }, rootRef);

    return () => ctx.revert();
  }, [loaded]);

  useEffect(() => {
    const finePointer = window.matchMedia("(pointer: fine)").matches;
    if (!finePointer) return;

    const cursor = document.querySelector<HTMLElement>(".cursor");
    const dot = document.querySelector<HTMLElement>(".cursor-dot");
    if (!cursor || !dot) return;

    let x = innerWidth / 2;
    let y = innerHeight / 2;
    let tx = x;
    let ty = y;
    let frame = 0;

    const move = (event: MouseEvent) => {
      tx = event.clientX;
      ty = event.clientY;
      dot.style.transform = `translate3d(${tx}px,${ty}px,0)`;
    };

    const animate = () => {
      x += (tx - x) * 0.2;
      y += (ty - y) * 0.2;
      cursor.style.transform = `translate3d(${x}px,${y}px,0)`;
      frame = requestAnimationFrame(animate);
    };

    const over = (event: Event) => {
      const target = event.target as HTMLElement;
      if (target.closest(".magnetic, .project-media, .menu-button")) cursor.classList.add("is-active");
    };

    const out = (event: Event) => {
      const target = event.target as HTMLElement;
      if (target.closest(".magnetic, .project-media, .menu-button")) cursor.classList.remove("is-active");
    };

    addEventListener("mousemove", move, { passive: true });
    document.addEventListener("mouseover", over);
    document.addEventListener("mouseout", out);
    frame = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(frame);
      removeEventListener("mousemove", move);
      document.removeEventListener("mouseover", over);
      document.removeEventListener("mouseout", out);
    };
  }, []);

  useEffect(() => {
    const finePointer = window.matchMedia("(pointer: fine)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!finePointer || reduced) return;

    const elements = Array.from(document.querySelectorAll<HTMLElement>(".magnetic"));
    const cleanups: Array<() => void> = [];

    elements.forEach((element) => {
      const xTo = gsap.quickTo(element, "x", { duration: 0.32, ease: "power3.out" });
      const yTo = gsap.quickTo(element, "y", { duration: 0.32, ease: "power3.out" });

      const move = (event: MouseEvent) => {
        const rect = element.getBoundingClientRect();
        const dx = event.clientX - (rect.left + rect.width / 2);
        const dy = event.clientY - (rect.top + rect.height / 2);
        xTo(dx * 0.14);
        yTo(dy * 0.14);
      };

      const leave = () => {
        xTo(0);
        yTo(0);
      };

      element.addEventListener("mousemove", move);
      element.addEventListener("mouseleave", leave);
      cleanups.push(() => {
        element.removeEventListener("mousemove", move);
        element.removeEventListener("mouseleave", leave);
      });
    });

    return () => cleanups.forEach((cleanup) => cleanup());
  }, []);

  return (
    <main ref={rootRef} className={loaded ? "site is-loaded" : "site"}>
      <FluidField />
      <div className="cursor" aria-hidden="true"><span>VIEW</span></div>
      <div className="cursor-dot" aria-hidden="true" />

      <div className={loaded ? "loader loader--done" : "loader"} aria-hidden={loaded}>
        <div className="loader-brand">KASUMI</div>
        <div className="loader-count">{String(progress).padStart(3, "0")}</div>
        <div className="loader-rule"><span style={{ transform: `scaleX(${progress / 100})` }} /></div>
      </div>

      <header className="site-header">
        <a href="#top" className="wordmark magnetic" aria-label="Kasumi home">
          <span className="seal">霞</span>
          <span>KASUMI</span>
        </a>
        <div className="lang">EN / JP</div>
        <button
          type="button"
          className="menu-button magnetic"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span>{menuOpen ? "CLOSE" : "MENU"}</span>
          <i className={menuOpen ? "menu-icon open" : "menu-icon"} />
        </button>
      </header>

      <div className={menuOpen ? "menu-overlay open" : "menu-overlay"} aria-hidden={!menuOpen}>
        <div className="menu-atmosphere" />
        <nav className="menu-nav">
          {menuItems.map((item, index) => (
            <a
              href={item === "Home" ? "#top" : "#" + item.toLowerCase()}
              key={item}
              onClick={() => setMenuOpen(false)}
            >
              <span className="menu-index">{String(index + 1).padStart(2, "0")}</span>
              <span className="menu-word">{item}</span>
            </a>
          ))}
        </nav>
        <div className="menu-meta">
          <div><span>STUDIO</span><p>Tokyo / Copenhagen</p></div>
          <div><span>CONTACT</span><p>hello@kasumi.studio</p></div>
        </div>
      </div>

      <section className="hero" id="top">
        <MistCanvas />
        <div className="hero-noise" />
        <div className="hero-content">
          <p className="hero-kicker">A study in material, light, and stillness.</p>
          <h1 className="hero-title">
            <span className="line">Quiet forms.</span>
            <span className="line italic">Living spaces.</span>
          </h1>
        </div>
        <div className="hero-meta">
          <LiveClock zone="Asia/Tokyo" label="TOKYO" />
          <LiveClock zone="Europe/Copenhagen" label="COPENHAGEN" />
        </div>
        <div className="scroll-cue"><span>SCROLL</span><i /></div>
      </section>

      <section className="philosophy" id="philosophy">
        <EdgeLabel>01 — PHILOSOPHY</EdgeLabel>
        <div className="philosophy-intro content-grid">
          <div className="section-kicker fade-up">MA / 間</div>
          <h2 className="display-heading">
            <span className="line-mask"><span className="reveal-line">Beauty appears</span></span>
            <span className="line-mask"><span className="reveal-line">when nothing asks</span></span>
            <span className="line-mask"><span className="reveal-line italic">for attention.</span></span>
          </h2>
          <div className="philosophy-copy fade-up">
            <p>We believe a space becomes meaningful through what is left unsaid: the grain of timber, the temperature of stone, the soft interval between light and shadow.</p>
            <p>KASUMI studies materials as they age, not as they arrive. We compose rooms and objects that become quieter with use.</p>
          </div>
        </div>

        <div className="philosophy-media">
          <figure className="media-shell wide-media">
            <div className="media-inner"><img src={IMAGES.forest} alt="Misted forest" /></div>
          </figure>
          <figure className="media-shell portrait-media">
            <div className="media-inner"><img src={IMAGES.interior} alt="Quiet interior detail" /></div>
            <figcaption>Light held inside timber.</figcaption>
          </figure>
        </div>

        <div className="philosophy-quote content-grid">
          <p className="quote-mark fade-up">“</p>
          <blockquote>
            <span className="line-mask"><span className="reveal-line">The most enduring gestures</span></span>
            <span className="line-mask"><span className="reveal-line">are often the least visible.</span></span>
          </blockquote>
        </div>
      </section>

      <section className="states" id="spaces">
        <EdgeLabel>02 — STATES</EdgeLabel>
        <div className="states-heading content-grid">
          <p className="section-kicker fade-up">THREE STATES OF QUIET</p>
          <h2 className="medium-heading">
            <span className="line-mask"><span className="reveal-line">Material. Light. Rhythm.</span></span>
          </h2>
        </div>

        <div className="states-layout">
          <div className="state-visual-wrap">
            <div className="state-visual">
              {states.map((state, index) => (
                <div key={state.title} className={activeState === index ? "state-image active" : "state-image"}>
                  <img src={state.image} alt="" />
                  <span className="state-veil" />
                </div>
              ))}
              <div className="state-counter"><span>{states[activeState].index}</span><i /><span>03</span></div>
            </div>
          </div>

          <div className="state-list">
            {states.map((state, index) => (
              <article className={activeState === index ? "state-copy is-active" : "state-copy"} key={state.title}>
                <span className="state-number">{state.index}</span>
                <h3>{state.title}</h3>
                <p>{state.text}</p>
                <span className={activeState === index ? "state-line active" : "state-line"} />
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="objects" id="objects">
        <EdgeLabel>03 — OBJECTS</EdgeLabel>
        <div className="objects-intro content-grid">
          <p className="section-kicker fade-up">SELECTED OBJECTS / 2026</p>
          <h2 className="display-heading compact">
            <span className="line-mask"><span className="reveal-line">Objects for</span></span>
            <span className="line-mask"><span className="reveal-line italic">slower living.</span></span>
          </h2>
          <p className="objects-copy fade-up">A collection of singular pieces built around weight, touch and measured silence.</p>
        </div>

        <div className="project-list">
          {projects.map((project) => (
            <article className={"project project--" + project.align} key={project.title}>
              <div className="project-media media-shell">
                <div className="media-inner"><img src={project.image} alt={project.title} /></div>
                <span className="project-number">{project.index}</span>
              </div>
              <div className="project-copy">
                <span className="project-eyebrow">{project.eyebrow}</span>
                <h3>{project.title}</h3>
                <p>{project.text}</p>
                <RollingLink>View Object</RollingLink>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="studio" id="studio">
        <EdgeLabel>04 — STUDIO</EdgeLabel>
        <div className="studio-grid">
          <div className="studio-copy">
            <p className="section-kicker fade-up">KASUMI STUDIO</p>
            <h2 className="display-heading compact">
              <span className="line-mask"><span className="reveal-line">We design what remains</span></span>
              <span className="line-mask"><span className="reveal-line italic">after the noise is gone.</span></span>
            </h2>
            <p className="fade-up">A small cross-disciplinary practice shaping interiors, objects and digital experiences through material restraint.</p>
            <div className="studio-locations fade-up">
              <span>35°41′N / TOKYO</span>
              <span>55°40′N / COPENHAGEN</span>
            </div>
            <RollingLink>View Studio</RollingLink>
          </div>

          <figure className="media-shell studio-media">
            <div className="media-inner"><img src={IMAGES.house} alt="Quiet house in a dark natural setting" /></div>
          </figure>
        </div>
      </section>

      <section className="journal" id="journal">
        <div className="journal-inner">
          <span className="section-kicker fade-up">JOURNAL / NOTE 01</span>
          <h2>
            <span className="line-mask"><span className="reveal-line">On the value</span></span>
            <span className="line-mask"><span className="reveal-line italic">of an empty room.</span></span>
          </h2>
          <p className="fade-up">Emptiness is not absence. It is a framework for noticing texture, temperature, sound and time.</p>
          <RollingLink>Read Journal</RollingLink>
        </div>
      </section>

      <section className="final-image">
        <figure className="media-shell">
          <div className="media-inner"><img src={IMAGES.light} alt="Warm quiet interior light" /></div>
          <figcaption>Night study — warmth held against darkness.</figcaption>
        </figure>
      </section>

      <footer className="footer" id="contact">
        <div className="footer-top">
          <div>
            <span className="footer-label">KASUMI / 霞</span>
            <h2>Quiet forms.<br /><em>Living spaces.</em></h2>
          </div>
          <div className="footer-contact">
            <span className="footer-label">INQUIRIES</span>
            <a href="mailto:hello@kasumi.studio">hello@kasumi.studio</a>
          </div>
        </div>

        <div className="footer-middle">
          <div className="footer-nav">
            <a href="#philosophy">Philosophy</a>
            <a href="#objects">Objects</a>
            <a href="#spaces">Spaces</a>
            <a href="#journal">Journal</a>
            <a href="#studio">Studio</a>
          </div>
          <div className="footer-studio">
            <div><span>STUDIO / TOKYO</span><p>2–18 Kiyosumi, Koto<br />Tokyo, Japan</p></div>
            <div><span>STUDIO / COPENHAGEN</span><p>12 Frederiksberg Allé<br />Copenhagen, Denmark</p></div>
          </div>
        </div>

        <div className="footer-bottom">
          <div className="footer-clocks">
            <LiveClock zone="Asia/Tokyo" label="TOKYO" />
            <LiveClock zone="Europe/Copenhagen" label="COPENHAGEN" />
          </div>
          <a href="#top" className="back-top magnetic">BACK TO TOP ↑</a>
          <span>© 2026 KASUMI</span>
        </div>
      </footer>
    </main>
  );
}
