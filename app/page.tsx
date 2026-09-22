"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import MistCanvas from "../components/MistCanvas";
import FluidField from "../components/FluidField";
import LiquidMedia from "../components/LiquidMedia";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const IMAGES = {
  forest:
    "https://images.unsplash.com/photo-1511497584788-876760111969?auto=format&fit=crop&q=88&w=2400",
  architecture:
    "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&q=88&w=2400",
  interior:
    "https://images.unsplash.com/photo-1600607688969-a5bfcd646154?auto=format&fit=crop&q=88&w=2400",
  stone:
    "https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&q=88&w=2400",
  light:
    "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&q=88&w=2400",
};

const PROJECTS = [
  {
    index: "01",
    label: "SPACE",
    title: "House of Quiet",
    tagline: "Architecture shaped around pause.",
    text:
      "A residential study in shadow, framed views and tactile materials. Every threshold slows the body before revealing the next room.",
    image: IMAGES.architecture,
    align: "left",
  },
  {
    index: "02",
    label: "OBJECT",
    title: "Stone Vessel",
    tagline: "Weight made calm.",
    text:
      "A single object reduced to proportion, texture and touch. Its surface is intended to become richer through use rather than remain perfect.",
    image: IMAGES.stone,
    align: "right",
  },
  {
    index: "03",
    label: "LIGHT",
    title: "Paper Light",
    tagline: "A glow shaped by shadow.",
    text:
      "A low, ambient source that makes darkness part of the object. The piece is read less as a lamp and more as a quiet field of light.",
    image: IMAGES.light,
    align: "left",
  },
];

function Clock({ zone, label }: { zone: string; label: string }) {
  const [time, setTime] = useState("--:--:--");

  useEffect(() => {
    const update = () => {
      setTime(
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
      <time>{time}</time>
    </div>
  );
}

function TextLink({ children, href = "#" }: { children: string; href?: string }) {
  return (
    <a className="text-link magnetic" href={href}>
      <span className="text-link__mask">
        <span className="text-link__track">
          <span>{children}</span>
          <span aria-hidden="true">{children}</span>
        </span>
      </span>
      <i aria-hidden="true">↗</i>
    </a>
  );
}

function SideIndex({ children }: { children: React.ReactNode }) {
  return <span className="side-index">{children}</span>;
}

export default function Home() {
  const rootRef = useRef<HTMLElement>(null);
  const [loaded, setLoaded] = useState(false);
  const [progress, setProgress] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);

  const menuItems = useMemo(
    () => ["Home", "Philosophy", "Projects", "Studio", "Contact"],
    []
  );

  useEffect(() => {
    let value = 0;
    const timer = window.setInterval(() => {
      value += Math.max(4, Math.round((100 - value) * 0.26));

      if (value >= 100) {
        setProgress(100);
        window.clearInterval(timer);
        window.setTimeout(() => setLoaded(true), 130);
      } else {
        setProgress(value);
      }
    }, 24);

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
    const desktop = window.matchMedia("(min-width: 768px) and (pointer: fine)").matches;

    if (reduced || !desktop) return;

    const lenis = new Lenis({
      duration: 0.76,
      smoothWheel: true,
      syncTouch: false,
      wheelMultiplier: 0.96,
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

      const intro = gsap.timeline({ delay: 0.04 });

      intro
        .fromTo(
          ".hero__kicker",
          { y: 14, opacity: 0, filter: "blur(6px)" },
          { y: 0, opacity: 1, filter: "blur(0px)", duration: 0.5 }
        )
        .fromTo(
          ".hero__headline-inner",
          { yPercent: 116, rotateX: 10, opacity: 0, filter: "blur(8px)" },
          {
            yPercent: 0,
            rotateX: 0,
            opacity: 1,
            filter: "blur(0px)",
            duration: 0.86,
            stagger: 0.07,
          },
          "-=0.2"
        )
        .fromTo(
          ".hero__liquid-wrap",
          { scale: 0.94, opacity: 0, filter: "blur(12px)" },
          { scale: 1, opacity: 1, filter: "blur(0px)", duration: 0.9 },
          "-=0.58"
        )
        .fromTo(
          ".hero__meta, .hero__scroll",
          { y: 10, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.42, stagger: 0.04 },
          "-=0.4"
        );

      gsap.to(".hero__headline--top", {
        xPercent: -4,
        yPercent: -8,
        opacity: 0.18,
        ease: "none",
        scrollTrigger: {
          trigger: ".hero",
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });

      gsap.to(".hero__headline--bottom", {
        xPercent: 5,
        yPercent: -2,
        opacity: 0.18,
        ease: "none",
        scrollTrigger: {
          trigger: ".hero",
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });

      gsap.to(".hero__liquid-wrap", {
        yPercent: -10,
        scale: 1.04,
        opacity: 0.48,
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
        opacity: 0.58,
        ease: "none",
        scrollTrigger: {
          trigger: ".hero",
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });

      gsap.utils.toArray<HTMLElement>(".line-reveal").forEach((mask) => {
        const line = mask.querySelector<HTMLElement>(".line-reveal__inner");
        if (!line) return;

        gsap.fromTo(
          line,
          { yPercent: 116, rotateX: 8, opacity: 0.04, filter: "blur(5px)" },
          {
            yPercent: 0,
            rotateX: 0,
            opacity: 1,
            filter: "blur(0px)",
            duration: 0.76,
            scrollTrigger: {
              trigger: mask,
              start: "top 89%",
              once: true,
            },
          }
        );
      });

      gsap.utils.toArray<HTMLElement>(".copy-reveal").forEach((item) => {
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

      gsap.utils.toArray<HTMLElement>(".image-reveal").forEach((shell, index) => {
        const image = shell.querySelector<HTMLElement>("img");
        if (!image) return;

        const fromRight = index % 2 === 1;

        gsap.set(shell, {
          clipPath: fromRight ? "inset(0 0 0 100%)" : "inset(0 100% 0 0)",
        });
        gsap.set(image, {
          scale: 1.08,
          xPercent: fromRight ? -3 : 3,
        });

        gsap
          .timeline({
            scrollTrigger: {
              trigger: shell,
              start: "top 87%",
              once: true,
            },
          })
          .to(shell, {
            clipPath: "inset(0 0% 0 0%)",
            duration: 0.9,
            ease: "power4.inOut",
          })
          .to(
            image,
            {
              scale: 1,
              xPercent: 0,
              duration: 1.0,
              ease: "power3.out",
            },
            0.05
          );

        gsap.to(image, {
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

      gsap.utils.toArray<HTMLElement>(".project").forEach((project, index) => {
        const copy = project.querySelector<HTMLElement>(".project__copy");
        const media = project.querySelector<HTMLElement>(".project__liquid-shell");
        const indexEl = project.querySelector<HTMLElement>(".project__index");

        if (copy) {
          gsap.fromTo(
            copy.children,
            { y: 28, opacity: 0, filter: "blur(5px)" },
            {
              y: 0,
              opacity: 1,
              filter: "blur(0px)",
              duration: 0.66,
              stagger: 0.07,
              scrollTrigger: {
                trigger: project,
                start: "top 74%",
                once: true,
              },
            }
          );
        }

        if (media) {
          gsap.fromTo(
            media,
            {
              clipPath:
                index % 2 === 0
                  ? "inset(8% 12% 8% 0%)"
                  : "inset(8% 0% 8% 12%)",
              scale: 0.985,
            },
            {
              clipPath: "inset(0% 0% 0% 0%)",
              scale: 1,
              duration: 0.95,
              ease: "power4.inOut",
              scrollTrigger: {
                trigger: project,
                start: "top 80%",
                once: true,
              },
            }
          );
        }

        if (indexEl) {
          gsap.fromTo(
            indexEl,
            { opacity: 0, y: 16 },
            {
              opacity: 1,
              y: 0,
              duration: 0.5,
              scrollTrigger: {
                trigger: project,
                start: "top 82%",
                once: true,
              },
            }
          );
        }
      });

      gsap.to(".studio__media img", {
        scale: 1.04,
        yPercent: -4,
        ease: "none",
        scrollTrigger: {
          trigger: ".studio",
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      });

      gsap.fromTo(
        ".footer__name span",
        { yPercent: 118 },
        {
          yPercent: 0,
          duration: 0.9,
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
    let targetX = x;
    let targetY = y;
    let frame = 0;

    const move = (event: MouseEvent) => {
      targetX = event.clientX;
      targetY = event.clientY;
      dot.style.transform = `translate3d(${targetX}px,${targetY}px,0)`;
    };

    const tick = () => {
      x += (targetX - x) * 0.22;
      y += (targetY - y) * 0.22;

      cursor.style.transform = `translate3d(${x}px,${y}px,0)`;
      frame = requestAnimationFrame(tick);
    };

    const over = (event: Event) => {
      const target = event.target as HTMLElement;
      if (target.closest(".magnetic, .project__liquid-shell, .menu-button")) {
        cursor.classList.add("is-active");
      }
    };

    const out = (event: Event) => {
      const target = event.target as HTMLElement;
      if (target.closest(".magnetic, .project__liquid-shell, .menu-button")) {
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
        xTo((event.clientX - (rect.left + rect.width / 2)) * 0.14);
        yTo((event.clientY - (rect.top + rect.height / 2)) * 0.14);
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
        <div className="loader__phrase">RETURN TO WHAT IS ESSENTIAL</div>
        <div className="loader__count">{String(progress).padStart(3, "0")}</div>
        <div className="loader__rule">
          <span style={{ transform: `scaleX(${progress / 100})` }} />
        </div>
      </div>

      <header className="header">
        <a href="#home" className="brand magnetic" aria-label="Kasumi home">
          <span className="brand__seal">霞</span>
          <span>KASUMI</span>
        </a>

        <div className="header__language">EN / JP</div>

        <button
          type="button"
          className="menu-button magnetic"
          onClick={() => setMenuOpen((open) => !open)}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
        >
          <span>{menuOpen ? "CLOSE" : "MENU"}</span>
          <i className={menuOpen ? "menu-button__icon is-open" : "menu-button__icon"} />
        </button>
      </header>

      <div className={menuOpen ? "menu is-open" : "menu"} aria-hidden={!menuOpen}>
        <div className="menu__ambient" />

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

        <div className="menu__meta">
          <div>
            <span>TOKYO</span>
            <p>35°41′N / 139°41′E</p>
          </div>
          <div>
            <span>COPENHAGEN</span>
            <p>55°40′N / 12°34′E</p>
          </div>
        </div>
      </div>

      <section className="hero" id="home">
        <MistCanvas />
        <div className="hero__grain" />

        <div className="hero__liquid-wrap">
          <LiquidMedia
            src={IMAGES.forest}
            intensity={0.78}
            className="hero__liquid"
            ariaLabel="Misted forest"
          />
        </div>

        <div className="hero__content">
          <p className="hero__kicker">KASUMI / A STUDY OF QUIET FORM</p>

          <h1 className="hero__headline">
            <span className="hero__headline-mask">
              <span className="hero__headline-inner hero__headline--top">Return to</span>
            </span>
            <span className="hero__headline-mask">
              <span className="hero__headline-inner hero__headline--bottom">what is essential.</span>
            </span>
          </h1>
        </div>

        <div className="hero__meta">
          <Clock zone="Asia/Tokyo" label="TOKYO" />
          <Clock zone="Europe/Copenhagen" label="COPENHAGEN" />
        </div>

        <div className="hero__scroll">
          <span>SCROLL</span>
          <i />
        </div>
      </section>

      <section className="philosophy" id="philosophy">
        <SideIndex>01 — PHILOSOPHY</SideIndex>

        <div className="philosophy__intro">
          <span className="section-kicker copy-reveal">THE SPACE BETWEEN / 間</span>

          <h2 className="editorial-title">
            <span className="line-reveal">
              <span className="line-reveal__inner">Harmony is not added.</span>
            </span>
            <span className="line-reveal">
              <span className="line-reveal__inner is-italic">It is uncovered.</span>
            </span>
          </h2>

          <div className="philosophy__copy copy-reveal">
            <p>
              KASUMI explores how stillness can shape an experience. We work with material,
              shadow, rhythm and absence rather than decoration.
            </p>
            <p>
              The goal is not minimalism for its own sake. It is clarity: enough space for
              the eye to notice what would otherwise disappear.
            </p>

            <TextLink>View Philosophy</TextLink>
          </div>
        </div>

        <div className="philosophy__composition">
          <figure className="image-reveal philosophy__large">
            <img src={IMAGES.architecture} alt="Minimal architecture" />
          </figure>

          <div className="philosophy__liquid">
            <LiquidMedia
              src={IMAGES.interior}
              intensity={0.82}
              ariaLabel="Warm interior with soft natural light"
            />
          </div>

          <p className="philosophy__caption copy-reveal">
            A room becomes expressive when light is allowed to complete it.
          </p>
        </div>
      </section>

      <section className="projects-intro" id="projects">
        <SideIndex>02 — PROJECTS</SideIndex>

        <div className="projects-intro__grid">
          <span className="section-kicker copy-reveal">SELECTED STUDIES / 2026</span>

          <h2 className="editorial-title">
            <span className="line-reveal">
              <span className="line-reveal__inner">Designing the dimensions</span>
            </span>
            <span className="line-reveal">
              <span className="line-reveal__inner is-italic">of slower living.</span>
            </span>
          </h2>

          <p className="projects-intro__copy copy-reveal">
            Three studies in space, object and light. Each begins with reduction and ends
            with atmosphere.
          </p>
        </div>
      </section>

      <section className="project-stack">
        {PROJECTS.map((project, index) => (
          <article className={"project project--" + project.align} key={project.title}>
            <div className="project__index">{project.index}</div>

            <div className="project__media-column">
              <div className="project__liquid-shell">
                {index === 1 ? (
                  <figure className="project__still image-reveal">
                    <img src={project.image} alt={project.title} />
                  </figure>
                ) : (
                  <LiquidMedia
                    src={project.image}
                    intensity={index === 0 ? 0.86 : 0.74}
                    className="project__liquid"
                    ariaLabel={project.title}
                  />
                )}
              </div>
            </div>

            <div className="project__copy">
              <span className="section-kicker">
                PROJECTS / {project.label}
              </span>

              <h3>{project.title}</h3>
              <p className="project__tagline">{project.tagline}</p>
              <p className="project__body">{project.text}</p>
              <TextLink>View Project</TextLink>
            </div>
          </article>
        ))}
      </section>

      <section className="studio" id="studio">
        <SideIndex>03 — STUDIO</SideIndex>

        <div className="studio__grid">
          <div className="studio__copy">
            <span className="section-kicker copy-reveal">WHO WE ARE</span>

            <h2>
              <span className="line-reveal">
                <span className="line-reveal__inner">A practice for things</span>
              </span>
              <span className="line-reveal">
                <span className="line-reveal__inner is-italic">that should remain.</span>
              </span>
            </h2>

            <p className="copy-reveal">
              We design interiors, objects and digital experiences from Tokyo and
              Copenhagen. Our work is built around tactile material, disciplined typography,
              emotional pacing and long-term usefulness.
            </p>

            <div className="studio__locations copy-reveal">
              <span>35°41′N / TOKYO</span>
              <span>55°40′N / COPENHAGEN</span>
            </div>

            <TextLink>View Studio</TextLink>
          </div>

          <figure className="studio__media">
            <img src={IMAGES.forest} alt="Forest atmosphere" />
            <figcaption>Quiet is treated as a material.</figcaption>
          </figure>
        </div>
      </section>

      <section className="closing">
        <div className="closing__media">
          <LiquidMedia
            src={IMAGES.light}
            intensity={0.8}
            ariaLabel="Warm light in a quiet interior"
          />
        </div>

        <div className="closing__overlay" />

        <div className="closing__copy">
          <span className="section-kicker">END NOTE / 2026</span>
          <p>Nothing added without reason.</p>
        </div>
      </section>

      <footer className="footer" id="contact">
        <div className="footer__top">
          <span className="section-kicker">KASUMI / 霞</span>

          <div className="footer__name" aria-label="KASUMI">
            {"KASUMI".split("").map((letter, index) => (
              <span key={index}>{letter}</span>
            ))}
          </div>
        </div>

        <div className="footer__middle">
          <nav>
            <a href="#philosophy">Philosophy</a>
            <a href="#projects">Projects</a>
            <a href="#studio">Studio</a>
          </nav>

          <div className="footer__contact">
            <span className="section-kicker">INQUIRIES</span>
            <a href="mailto:hello@kasumi.studio">hello@kasumi.studio</a>
          </div>

          <div className="footer__locations">
            <div>
              <span className="section-kicker">TOKYO</span>
              <p>Kiyosumi / concept studio</p>
            </div>
            <div>
              <span className="section-kicker">COPENHAGEN</span>
              <p>Frederiksberg / concept studio</p>
            </div>
          </div>
        </div>

        <div className="footer__bottom">
          <div className="footer__clocks">
            <Clock zone="Asia/Tokyo" label="TOKYO" />
            <Clock zone="Europe/Copenhagen" label="COPENHAGEN" />
          </div>

          <a className="magnetic" href="#home">
            BACK TO TOP ↑
          </a>

          <span>© 2026 KASUMI</span>
        </div>
      </footer>
    </main>
  );
}
