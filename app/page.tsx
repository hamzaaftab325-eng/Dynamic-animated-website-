"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import MistCanvas from "../components/MistCanvas";
import FluidField from "../components/FluidField";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const IMAGES = {
  forest:
    "https://images.unsplash.com/photo-1511497584788-876760111969?auto=format&fit=crop&q=88&w=2400",
  house:
    "https://images.unsplash.com/photo-1549693578-d683be217e58?auto=format&fit=crop&q=88&w=2400",
  interior:
    "https://images.unsplash.com/photo-1600607688969-a5bfcd646154?auto=format&fit=crop&q=88&w=2400",
  architecture:
    "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&q=88&w=2400",
  stone:
    "https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&q=88&w=2400",
  light:
    "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&q=88&w=2400",
};

const STATES = [
  {
    index: "01",
    title: "Material",
    text: "Honest surfaces carry time. We work with texture, grain and weight rather than decoration.",
    image: IMAGES.stone,
  },
  {
    index: "02",
    title: "Light",
    text: "Shadow gives form its meaning. Light is treated as a material that edits what the eye can hold.",
    image: IMAGES.light,
  },
  {
    index: "03",
    title: "Rhythm",
    text: "Space becomes memorable through pause: compression, release, stillness and movement.",
    image: IMAGES.interior,
  },
];

const PROJECTS = [
  {
    index: "01",
    title: "Stone Vessel",
    note: "Weight made quiet.",
    meta: "OBJECT / 2026",
    image: IMAGES.stone,
  },
  {
    index: "02",
    title: "Paper Light",
    note: "A glow shaped by shadow.",
    meta: "LIGHT / 2026",
    image: IMAGES.light,
  },
  {
    index: "03",
    title: "Cedar Bench",
    note: "A place to pause.",
    meta: "FURNITURE / 2026",
    image: IMAGES.house,
  },
];

function Clock({ zone, label }: { zone: string; label: string }) {
  const [time, setTime] = useState("--:--:--");

  useEffect(() => {
    const update = () =>
      setTime(
        new Intl.DateTimeFormat("en-GB", {
          timeZone: zone,
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
        }).format(new Date())
      );

    update();
    const id = window.setInterval(update, 1000);
    return () => window.clearInterval(id);
  }, [zone]);

  return (
    <div className="clock">
      <span>{label}</span>
      <time>{time}</time>
    </div>
  );
}

function EdgeLabel({ children }: { children: React.ReactNode }) {
  return <span className="edge-label">{children}</span>;
}

function ArrowLink({ children, href = "#" }: { children: string; href?: string }) {
  return (
    <a href={href} className="arrow-link magnetic">
      <span className="arrow-link__mask">
        <span className="arrow-link__track">
          <span>{children}</span>
          <span aria-hidden="true">{children}</span>
        </span>
      </span>
      <span className="arrow-link__icon">↗</span>
    </a>
  );
}

export default function Home() {
  const rootRef = useRef<HTMLElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [progress, setProgress] = useState(0);
  const [activeState, setActiveState] = useState(0);

  const menuItems = useMemo(
    () => ["Home", "Philosophy", "States", "Objects", "Studio", "Contact"],
    []
  );

  useEffect(() => {
    let value = 0;
    const id = window.setInterval(() => {
      value += Math.max(4, Math.ceil((100 - value) * 0.24));
      if (value >= 100) {
        value = 100;
        setProgress(100);
        window.clearInterval(id);
        window.setTimeout(() => setLoaded(true), 140);
      } else {
        setProgress(value);
      }
    }, 24);

    return () => window.clearInterval(id);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const desktop = window.matchMedia("(min-width: 768px) and (pointer: fine)").matches;

    if (reduced || !desktop) return;

    const lenis = new Lenis({
      duration: 0.78,
      smoothWheel: true,
      syncTouch: false,
      wheelMultiplier: 0.95,
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

    const isDesktop = window.matchMedia("(min-width: 768px)").matches;

    const ctx = gsap.context(() => {
      gsap.defaults({ ease: "power4.out" });

      const hero = gsap.timeline({ delay: 0.03 });
      hero
        .fromTo(
          ".hero__eyebrow",
          { y: 16, opacity: 0, filter: "blur(6px)" },
          { y: 0, opacity: 1, filter: "blur(0px)", duration: 0.55 }
        )
        .fromTo(
          ".hero__line-inner",
          { yPercent: 115, rotateX: 11, opacity: 0, filter: "blur(8px)" },
          {
            yPercent: 0,
            rotateX: 0,
            opacity: 1,
            filter: "blur(0px)",
            stagger: 0.075,
            duration: 0.86,
          },
          "-=0.25"
        )
        .fromTo(
          ".hero__meta, .hero__scroll",
          { y: 12, opacity: 0 },
          { y: 0, opacity: 1, stagger: 0.05, duration: 0.42 },
          "-=0.35"
        );

      gsap.to(".hero__line--one", {
        xPercent: -5,
        yPercent: -10,
        opacity: 0.18,
        ease: "none",
        scrollTrigger: {
          trigger: ".hero",
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });

      gsap.to(".hero__line--two", {
        xPercent: 6,
        yPercent: -4,
        opacity: 0.18,
        ease: "none",
        scrollTrigger: {
          trigger: ".hero",
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });

      gsap.to(".hero .mist-canvas", {
        scale: 1.08,
        opacity: 0.62,
        ease: "none",
        scrollTrigger: {
          trigger: ".hero",
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });

      gsap.utils.toArray<HTMLElement>(".mask-line").forEach((mask) => {
        const inner = mask.querySelector<HTMLElement>(".mask-line__inner");
        if (!inner) return;

        gsap.fromTo(
          inner,
          { yPercent: 118, rotateX: 9, opacity: 0.03, filter: "blur(6px)" },
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

      gsap.utils.toArray<HTMLElement>(".reveal-copy").forEach((item) => {
        gsap.fromTo(
          item,
          { y: 24, opacity: 0, filter: "blur(5px)" },
          {
            y: 0,
            opacity: 1,
            filter: "blur(0px)",
            duration: 0.64,
            scrollTrigger: {
              trigger: item,
              start: "top 90%",
              once: true,
            },
          }
        );
      });

      gsap.utils.toArray<HTMLElement>(".reveal-media").forEach((shell, index) => {
        const inner = shell.querySelector<HTMLElement>(".reveal-media__inner");
        if (!inner) return;

        const fromRight = index % 2 === 1;
        gsap.set(shell, {
          clipPath: fromRight ? "inset(0 0 0 100%)" : "inset(0 100% 0 0)",
        });
        gsap.set(inner, {
          scale: 1.09,
          xPercent: fromRight ? -3 : 3,
        });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: shell,
            start: "top 86%",
            once: true,
          },
        });

        tl.to(shell, {
          clipPath: "inset(0 0% 0 0%)",
          duration: 0.92,
          ease: "power4.inOut",
        }).to(
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
          yPercent: fromRight ? 3 : -3,
          ease: "none",
          scrollTrigger: {
            trigger: shell,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        });
      });

      gsap.fromTo(
        ".manifesto__giant",
        { xPercent: 12, opacity: 0.03 },
        {
          xPercent: -6,
          opacity: 0.13,
          ease: "none",
          scrollTrigger: {
            trigger: ".manifesto",
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        }
      );

      gsap.to(".interlude__image", {
        scale: 1.02,
        yPercent: -4,
        ease: "none",
        scrollTrigger: {
          trigger: ".interlude",
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      });

      gsap.utils.toArray<HTMLElement>(".state-copy").forEach((item, index) => {
        ScrollTrigger.create({
          trigger: item,
          start: "top 57%",
          end: "bottom 43%",
          onEnter: () => setActiveState(index),
          onEnterBack: () => setActiveState(index),
        });
      });

      if (isDesktop) {
        const track = document.querySelector<HTMLElement>(".objects__track");
        const pin = document.querySelector<HTMLElement>(".objects__pin");

        if (track && pin) {
          const distance = () => Math.max(0, track.scrollWidth - window.innerWidth);

          gsap.to(track, {
            x: () => -distance(),
            ease: "none",
            scrollTrigger: {
              trigger: pin,
              start: "top top",
              end: () => "+=" + Math.max(window.innerHeight * 2.7, distance() * 1.08),
              scrub: 0.55,
              pin: true,
              anticipatePin: 1,
              invalidateOnRefresh: true,
            },
          });
        }
      }

      gsap.fromTo(
        ".studio__image",
        { clipPath: "inset(8% 12% 8% 12%)", scale: 1.06 },
        {
          clipPath: "inset(0% 0% 0% 0%)",
          scale: 1,
          duration: 1.0,
          ease: "power4.inOut",
          scrollTrigger: {
            trigger: ".studio",
            start: "top 72%",
            once: true,
          },
        }
      );

      gsap.to(".closing__image", {
        scale: 1.01,
        yPercent: -3,
        ease: "none",
        scrollTrigger: {
          trigger: ".closing",
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      });

      gsap.fromTo(
        ".footer__wordmark span",
        { yPercent: 115 },
        {
          yPercent: 0,
          duration: 0.95,
          stagger: 0.035,
          scrollTrigger: {
            trigger: ".footer",
            start: "top 80%",
            once: true,
          },
        }
      );
    }, rootRef);

    return () => ctx.revert();
  }, [loaded]);

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduced) return;

    const cursor = document.querySelector<HTMLElement>(".cursor");
    const dot = document.querySelector<HTMLElement>(".cursor-dot");
    if (!cursor || !dot) return;

    let x = window.innerWidth / 2;
    let y = window.innerHeight / 2;
    let tx = x;
    let ty = y;
    let frame = 0;

    const move = (event: MouseEvent) => {
      tx = event.clientX;
      ty = event.clientY;
      dot.style.transform = `translate3d(${tx}px,${ty}px,0)`;
    };

    const tick = () => {
      x += (tx - x) * 0.22;
      y += (ty - y) * 0.22;
      cursor.style.transform = `translate3d(${x}px,${y}px,0)`;
      frame = requestAnimationFrame(tick);
    };

    const over = (event: Event) => {
      const target = event.target as HTMLElement;
      if (target.closest(".project-card, .magnetic, .menu-button")) {
        cursor.classList.add("is-active");
      }
    };

    const out = (event: Event) => {
      const target = event.target as HTMLElement;
      if (target.closest(".project-card, .magnetic, .menu-button")) {
        cursor.classList.remove("is-active");
      }
    };

    window.addEventListener("mousemove", move, { passive: true });
    document.addEventListener("mouseover", over);
    document.addEventListener("mouseout", out);
    frame = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("mousemove", move);
      document.removeEventListener("mouseover", over);
      document.removeEventListener("mouseout", out);
    };
  }, []);

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduced) return;

    const elements = Array.from(document.querySelectorAll<HTMLElement>(".magnetic"));
    const cleanup: Array<() => void> = [];

    elements.forEach((element) => {
      const xTo = gsap.quickTo(element, "x", { duration: 0.3, ease: "power3.out" });
      const yTo = gsap.quickTo(element, "y", { duration: 0.3, ease: "power3.out" });

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

      cleanup.push(() => {
        element.removeEventListener("mousemove", move);
        element.removeEventListener("mouseleave", leave);
      });
    });

    return () => cleanup.forEach((fn) => fn());
  }, []);

  return (
    <main ref={rootRef} className={loaded ? "site is-loaded" : "site"}>
      <FluidField />

      <div className="cursor" aria-hidden="true">
        <span>VIEW</span>
      </div>
      <div className="cursor-dot" aria-hidden="true" />

      <div className={loaded ? "loader loader--done" : "loader"} aria-hidden={loaded}>
        <div className="loader__brand">KASUMI / 霞</div>
        <div className="loader__count">{String(progress).padStart(3, "0")}</div>
        <div className="loader__line">
          <span style={{ transform: `scaleX(${progress / 100})` }} />
        </div>
      </div>

      <header className="header">
        <a href="#home" className="brand magnetic" aria-label="Kasumi home">
          <span className="brand__seal">霞</span>
          <span>KASUMI</span>
        </a>

        <span className="header__edition">TOKYO / CPH · 2026</span>

        <button
          type="button"
          className="menu-button magnetic"
          onClick={() => setMenuOpen((value) => !value)}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
        >
          <span>{menuOpen ? "CLOSE" : "MENU"}</span>
          <i className={menuOpen ? "menu-button__icon is-open" : "menu-button__icon"} />
        </button>
      </header>

      <div className={menuOpen ? "menu is-open" : "menu"} aria-hidden={!menuOpen}>
        <div className="menu__veil" />
        <nav className="menu__nav">
          {menuItems.map((item, index) => (
            <a
              key={item}
              href={item === "Home" ? "#home" : "#" + item.toLowerCase()}
              onClick={() => setMenuOpen(false)}
            >
              <span>{String(index + 1).padStart(2, "0")}</span>
              <strong>{item}</strong>
            </a>
          ))}
        </nav>
        <div className="menu__footer">
          <div>
            <span>STUDIO</span>
            <p>Tokyo / Copenhagen</p>
          </div>
          <div>
            <span>CONTACT</span>
            <p>hello@kasumi.studio</p>
          </div>
        </div>
      </div>

      <section className="hero" id="home">
        <MistCanvas />
        <div className="hero__grain" />

        <div className="hero__center">
          <p className="hero__eyebrow">A STUDY IN MATERIAL, LIGHT & STILLNESS</p>

          <h1 className="hero__title">
            <span className="hero__line">
              <span className="hero__line-inner hero__line--one">Quiet forms.</span>
            </span>
            <span className="hero__line">
              <span className="hero__line-inner hero__line--two">Living spaces.</span>
            </span>
          </h1>
        </div>

        <div className="hero__meta">
          <Clock zone="Asia/Tokyo" label="TOKYO" />
          <Clock zone="Europe/Copenhagen" label="COPENHAGEN" />
        </div>

        <div className="hero__scroll">
          <span>SCROLL TO ENTER</span>
          <i />
        </div>
      </section>

      <section className="manifesto" id="philosophy">
        <EdgeLabel>01 — PHILOSOPHY</EdgeLabel>
        <span className="manifesto__giant" aria-hidden="true">間</span>

        <div className="manifesto__grid">
          <p className="section-label reveal-copy">MA / THE SPACE BETWEEN</p>

          <h2 className="display-title">
            <span className="mask-line">
              <span className="mask-line__inner">Beauty appears</span>
            </span>
            <span className="mask-line">
              <span className="mask-line__inner">when nothing asks</span>
            </span>
            <span className="mask-line">
              <span className="mask-line__inner is-italic">for attention.</span>
            </span>
          </h2>

          <div className="manifesto__body reveal-copy">
            <p>
              We work with what time reveals: grain, shadow, patina, quiet proportion and
              the interval between objects.
            </p>
            <p>
              KASUMI is an imagined studio for interiors, objects and digital experiences
              that become softer the longer you stay with them.
            </p>
          </div>
        </div>

        <div className="manifesto__media">
          <figure className="reveal-media manifesto__landscape">
            <div className="reveal-media__inner">
              <img src={IMAGES.forest} alt="Misted forest landscape" />
            </div>
          </figure>

          <figure className="reveal-media manifesto__portrait">
            <div className="reveal-media__inner">
              <img src={IMAGES.architecture} alt="Minimal architectural interior" />
            </div>
            <figcaption>Light held inside material.</figcaption>
          </figure>
        </div>
      </section>

      <section className="interlude">
        <img className="interlude__image" src={IMAGES.house} alt="Quiet architecture at dusk" />
        <div className="interlude__shade" />
        <div className="interlude__copy">
          <span className="section-label reveal-copy">A NOTE ON QUIET</span>
          <blockquote>
            <span className="mask-line">
              <span className="mask-line__inner">What remains after</span>
            </span>
            <span className="mask-line">
              <span className="mask-line__inner is-italic">the noise disappears?</span>
            </span>
          </blockquote>
        </div>
      </section>

      <section className="states" id="states">
        <EdgeLabel>02 — THREE STATES</EdgeLabel>

        <div className="states__intro">
          <p className="section-label reveal-copy">MATERIAL / LIGHT / RHYTHM</p>
          <h2>
            <span className="mask-line">
              <span className="mask-line__inner">Three conditions.</span>
            </span>
            <span className="mask-line">
              <span className="mask-line__inner is-italic">One atmosphere.</span>
            </span>
          </h2>
        </div>

        <div className="states__layout">
          <div className="states__visual-wrap">
            <div className="states__visual">
              {STATES.map((state, index) => (
                <div
                  className={activeState === index ? "state-image is-active" : "state-image"}
                  key={state.title}
                >
                  <img src={state.image} alt="" />
                  <span className="state-image__wash" />
                </div>
              ))}

              <div className="states__counter">
                <span>{STATES[activeState].index}</span>
                <i />
                <span>03</span>
              </div>
            </div>
          </div>

          <div className="states__copy">
            {STATES.map((state, index) => (
              <article
                className={activeState === index ? "state-copy is-active" : "state-copy"}
                key={state.title}
              >
                <span className="state-copy__index">{state.index}</span>
                <h3>{state.title}</h3>
                <p>{state.text}</p>
                <span className="state-copy__line" />
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="objects" id="objects">
        <EdgeLabel>03 — OBJECTS</EdgeLabel>

        <div className="objects__pin">
          <div className="objects__top">
            <div>
              <span className="section-label">SELECTED OBJECTS / 2026</span>
              <h2>Objects for slower living.</h2>
            </div>
            <span className="objects__hint">SCROLL →</span>
          </div>

          <div className="objects__viewport">
            <div className="objects__track">
              <article className="objects__statement">
                <span>03 / OBJECTS</span>
                <p>
                  Each piece begins with one question:
                  <em> how little is enough?</em>
                </p>
              </article>

              {PROJECTS.map((project) => (
                <article className="project-card" key={project.title}>
                  <figure className="project-card__image">
                    <img src={project.image} alt={project.title} />
                    <span className="project-card__index">{project.index}</span>
                  </figure>

                  <div className="project-card__meta">
                    <span>{project.meta}</span>
                    <h3>{project.title}</h3>
                    <p>{project.note}</p>
                    <ArrowLink>View Object</ArrowLink>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="studio" id="studio">
        <EdgeLabel>04 — STUDIO</EdgeLabel>

        <div className="studio__grid">
          <div className="studio__copy">
            <span className="section-label reveal-copy">KASUMI STUDIO</span>
            <h2>
              <span className="mask-line">
                <span className="mask-line__inner">We design what remains</span>
              </span>
              <span className="mask-line">
                <span className="mask-line__inner is-italic">after the noise is gone.</span>
              </span>
            </h2>

            <p className="reveal-copy">
              A small cross-disciplinary practice shaping interiors, objects and digital
              experiences through restraint, tactility and rhythm.
            </p>

            <div className="studio__locations reveal-copy">
              <span>35°41′N / TOKYO</span>
              <span>55°40′N / COPENHAGEN</span>
            </div>

            <ArrowLink>View Studio</ArrowLink>
          </div>

          <figure className="studio__image">
            <img src={IMAGES.interior} alt="Warm minimal interior" />
            <figcaption>Studio study / evening light.</figcaption>
          </figure>
        </div>
      </section>

      <section className="closing">
        <img className="closing__image" src={IMAGES.light} alt="Warm architectural light" />
        <div className="closing__shade" />
        <div className="closing__copy">
          <span className="section-label">END NOTE / 2026</span>
          <p>Nothing added without reason.</p>
        </div>
      </section>

      <footer className="footer" id="contact">
        <div className="footer__head">
          <span className="section-label">KASUMI / 霞</span>
          <div className="footer__wordmark" aria-label="KASUMI">
            {"KASUMI".split("").map((letter, index) => (
              <span key={index}>{letter}</span>
            ))}
          </div>
        </div>

        <div className="footer__body">
          <nav>
            <a href="#philosophy">Philosophy</a>
            <a href="#states">States</a>
            <a href="#objects">Objects</a>
            <a href="#studio">Studio</a>
          </nav>

          <div className="footer__contact">
            <span className="section-label">INQUIRIES</span>
            <a href="mailto:hello@kasumi.studio">hello@kasumi.studio</a>
          </div>

          <div className="footer__locations">
            <div>
              <span className="section-label">TOKYO</span>
              <p>Concept studio / Kiyosumi</p>
            </div>
            <div>
              <span className="section-label">COPENHAGEN</span>
              <p>Concept studio / Frederiksberg</p>
            </div>
          </div>
        </div>

        <div className="footer__base">
          <div className="footer__clocks">
            <Clock zone="Asia/Tokyo" label="TOKYO" />
            <Clock zone="Europe/Copenhagen" label="COPENHAGEN" />
          </div>

          <a href="#home" className="magnetic">BACK TO TOP ↑</a>
          <span>© 2026 KASUMI</span>
        </div>
      </footer>
    </main>
  );
}
