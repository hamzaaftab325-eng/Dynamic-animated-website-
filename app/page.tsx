"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import FogCanvas from "../components/FogCanvas";
import LiquidMedia from "../components/LiquidMedia";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const IMAGES = {
  hero:
    "https://images.unsplash.com/photo-1773916543957-d370611ac764?auto=format&fit=crop&q=88&w=2600",
  garden:
    "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&q=90&w=1800",
  water:
    "https://images.unsplash.com/photo-1600607688969-a5bfcd646154?auto=format&fit=crop&q=90&w=1800",
  incense:
    "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&q=90&w=1800",
  room:
    "https://images.unsplash.com/photo-1549693578-d683be217e58?auto=format&fit=crop&q=90&w=2400",
  school:
    "https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&q=90&w=1600",
  craft:
    "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&q=90&w=1600",
  retreat:
    "https://images.unsplash.com/photo-1500534314209-a25ddb2bd4296?auto=format&fit=crop&q=90&w=1600",
  company:
    "https://images.unsplash.com/photo-1511497584788-876760111969?auto=format&fit=crop&q=90&w=2400",
};

const PROJECTS = [
  {
    index: "01",
    title: "School",
    lead: "Nurturing the foundations of life.",
    description:
      "A quiet place for learning, care and presence — designed around the relationship between parent, child and the spaces they grow through.",
    image: IMAGES.school,
    link: "View School",
  },
  {
    index: "02",
    title: "Craft",
    lead: "Awakening the senses through material.",
    description:
      "Objects and spaces shaped through texture, restraint and contemporary Japanese sensibility. Less decoration, more depth.",
    image: IMAGES.craft,
    link: "View Craft",
  },
  {
    index: "03",
    title: "Retreat",
    lead: "Returning to your natural rhythm.",
    description:
      "A slower experience of landscape, ritual and quiet. A space to move away from noise and back toward attention.",
    image: IMAGES.retreat,
    link: "View Retreat",
  },
];

function Clock({ zone, place }: { zone: string; place: string }) {
  const [time, setTime] = useState("00:00:00");

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
    const id = window.setInterval(update, 1000);
    return () => window.clearInterval(id);
  }, [zone]);

  return (
    <time className="world-clock">
      <span className="world-clock__time">{time}</span>
      <span className="world-clock__place">{place}</span>
    </time>
  );
}

function CloneLink({
  children,
  href = "#",
  className = "",
}: {
  children: string;
  href?: string;
  className?: string;
}) {
  return (
    <a href={href} className={"clone-link magnetic " + className}>
      <span className="clone-link__line clone-link__line--top" />
      <span className="clone-link__body">
        <span className="clone-link__clip">
          <span className="clone-link__track">
            <span>{children}</span>
            <span aria-hidden="true">{children}</span>
          </span>
        </span>
      </span>
      <span className="clone-link__line clone-link__line--bottom" />
    </a>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return <div className="section-label-vertical">{children}</div>;
}

function Seal() {
  return (
    <span className="seal-mark" aria-hidden="true">
      <i />
      <i />
      <i />
      <i />
      <b>K</b>
    </span>
  );
}

export default function Home() {
  const rootRef = useRef<HTMLElement>(null);
  const [loaded, setLoaded] = useState(false);
  const [progress, setProgress] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeProject, setActiveProject] = useState(0);

  const menuItems = useMemo(
    () => ["home", "philosophy", "projects", "company", "contact"],
    []
  );

  useEffect(() => {
    let current = 0;
    const id = window.setInterval(() => {
      current += Math.max(3, Math.round((100 - current) * 0.22));

      if (current >= 100) {
        current = 100;
        setProgress(100);
        window.clearInterval(id);
        window.setTimeout(() => setLoaded(true), 180);
      } else {
        setProgress(current);
      }
    }, 30);

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
    const fineDesktop = window.matchMedia("(min-width: 768px) and (pointer: fine)").matches;

    if (reduced || !fineDesktop) return;

    const lenis = new Lenis({
      duration: 0.82,
      smoothWheel: true,
      syncTouch: false,
      wheelMultiplier: 0.92,
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

    const desktop = window.matchMedia("(min-width: 768px)").matches;

    const ctx = gsap.context(() => {
      const intro = gsap.timeline({ delay: 0.03 });

      intro
        .fromTo(
          ".hero__background",
          { scale: 1.025, opacity: 0 },
          { scale: 1, opacity: 1, duration: 1.35, ease: "power3.out" }
        )
        .fromTo(
          ".hero__title-inner",
          { yPercent: 110, opacity: 0, filter: "blur(7px)" },
          {
            yPercent: 0,
            opacity: 1,
            filter: "blur(0px)",
            duration: 0.85,
            ease: "power4.out",
          },
          "-=0.8"
        )
        .fromTo(
          ".aside-fixed",
          { opacity: 0, y: 8 },
          { opacity: 1, y: 0, duration: 0.45, ease: "power3.out" },
          "-=0.4"
        );

      gsap.to(".hero__background", {
        scale: 1.018,
        yPercent: 1.4,
        ease: "none",
        scrollTrigger: {
          trigger: ".hero",
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });

      gsap.to(".hero__title", {
        yPercent: -18,
        opacity: 0,
        ease: "none",
        scrollTrigger: {
          trigger: ".hero",
          start: "30% top",
          end: "bottom top",
          scrub: true,
        },
      });

      gsap.utils.toArray<HTMLElement>(".mesh-title").forEach((title) => {
        const lines = title.querySelectorAll<HTMLElement>(".mesh-title__line");

        gsap.fromTo(
          lines,
          {
            yPercent: 118,
            rotateX: 10,
            opacity: 0.03,
            filter: "blur(8px)",
            skewY: 1.8,
          },
          {
            yPercent: 0,
            rotateX: 0,
            opacity: 1,
            filter: "blur(0px)",
            skewY: 0,
            stagger: 0.07,
            duration: 0.88,
            ease: "power4.out",
            scrollTrigger: {
              trigger: title,
              start: "top 88%",
              once: true,
            },
          }
        );
      });

      gsap.utils.toArray<HTMLElement>(".text-reveal").forEach((item) => {
        gsap.fromTo(
          item,
          { y: 20, opacity: 0, filter: "blur(4px)" },
          {
            y: 0,
            opacity: 1,
            filter: "blur(0px)",
            duration: 0.62,
            ease: "power3.out",
            scrollTrigger: {
              trigger: item,
              start: "top 90%",
              once: true,
            },
          }
        );
      });

      gsap.utils.toArray<HTMLElement>(".philosophy-media").forEach((media, index) => {
        gsap.fromTo(
          media,
          {
            clipPath:
              index % 2 === 0
                ? "inset(0 100% 0 0)"
                : "inset(0 0 0 100%)",
            scale: 0.985,
          },
          {
            clipPath: "inset(0 0% 0 0%)",
            scale: 1,
            duration: 1.05,
            ease: "power4.inOut",
            scrollTrigger: {
              trigger: media,
              start: "top 86%",
              once: true,
            },
          }
        );
      });

      gsap.to(".projects-intro__bg", {
        clipPath: "inset(0% 0% 0% 0%)",
        scale: 1,
        ease: "none",
        scrollTrigger: {
          trigger: ".projects-intro",
          start: "top 75%",
          end: "center center",
          scrub: true,
        },
      });

      gsap.to(".projects-intro__overlay", {
        opacity: 0.5,
        ease: "none",
        scrollTrigger: {
          trigger: ".projects-intro",
          start: "top 75%",
          end: "center center",
          scrub: true,
        },
      });

      gsap.fromTo(
        ".projects-intro__content",
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".projects-intro",
            start: "top 70%",
            once: true,
          },
        }
      );

      gsap.utils.toArray<HTMLElement>(".project-marker").forEach((marker, index) => {
        ScrollTrigger.create({
          trigger: marker,
          start: "top center",
          end: "bottom center",
          onEnter: () => setActiveProject(index),
          onEnterBack: () => setActiveProject(index),
        });

        const image = document.querySelector<HTMLElement>(
          `.project-layer[data-index="${index}"] img`
        );

        if (image) {
          gsap.fromTo(
            image,
            { yPercent: -4.5, scale: 1.06 },
            {
              yPercent: 4.5,
              scale: 1.015,
              ease: "none",
              scrollTrigger: {
                trigger: marker,
                start: "top bottom",
                end: "bottom top",
                scrub: true,
              },
            }
          );
        }
      });

      if (desktop) {
        gsap.fromTo(
          ".company__background",
          { scale: 1.08, yPercent: -2 },
          {
            scale: 1,
            yPercent: 3,
            ease: "none",
            scrollTrigger: {
              trigger: ".company",
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          }
        );
      }

      gsap.fromTo(
        ".company__content",
        { y: 32, opacity: 0, filter: "blur(5px)" },
        {
          y: 0,
          opacity: 1,
          filter: "blur(0px)",
          duration: 0.82,
          ease: "power4.out",
          scrollTrigger: {
            trigger: ".company",
            start: "top 72%",
            once: true,
          },
        }
      );

      gsap.fromTo(
        ".footer__next-title",
        { yPercent: 115 },
        {
          yPercent: 0,
          duration: 0.9,
          ease: "power4.out",
          scrollTrigger: {
            trigger: ".footer",
            start: "top 82%",
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

    const tick = () => {
      x += (tx - x) * 0.2;
      y += (ty - y) * 0.2;
      cursor.style.transform = `translate3d(${x}px,${y}px,0)`;
      frame = requestAnimationFrame(tick);
    };

    const over = (event: Event) => {
      const target = event.target as HTMLElement;
      if (
        target.closest(
          ".magnetic, .project-stage__image, .philosophy-media, .menu-trigger"
        )
      ) {
        cursor.classList.add("is-active");
      }
    };

    const out = (event: Event) => {
      const target = event.target as HTMLElement;
      if (
        target.closest(
          ".magnetic, .project-stage__image, .philosophy-media, .menu-trigger"
        )
      ) {
        cursor.classList.remove("is-active");
      }
    };

    addEventListener("mousemove", move, { passive: true });
    document.addEventListener("mouseover", over);
    document.addEventListener("mouseout", out);

    frame = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(frame);
      removeEventListener("mousemove", move);
      document.removeEventListener("mouseover", over);
      document.removeEventListener("mouseout", out);
    };
  }, []);

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (!fine || reduced) return;

    const elements = Array.from(document.querySelectorAll<HTMLElement>(".magnetic"));
    const cleanups: Array<() => void> = [];

    elements.forEach((element) => {
      const xTo = gsap.quickTo(element, "x", {
        duration: 0.28,
        ease: "power3.out",
      });
      const yTo = gsap.quickTo(element, "y", {
        duration: 0.28,
        ease: "power3.out",
      });

      const move = (event: MouseEvent) => {
        const rect = element.getBoundingClientRect();
        xTo((event.clientX - (rect.left + rect.width / 2)) * 0.12);
        yTo((event.clientY - (rect.top + rect.height / 2)) * 0.12);
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
      <div className="cursor" aria-hidden="true">
        <span>VIEW</span>
      </div>
      <div className="cursor-dot" aria-hidden="true" />

      <div className={loaded ? "loader loader--done" : "loader"}>
        <p className="loader__message">Return to what is essential</p>
        <div className="loader__progress">
          <span>{progress}</span>
        </div>
      </div>

      <header className="header">
        <a className="header__logo magnetic" href="#home" aria-label="Kasumi home">
          <Seal />
          <span className="header__wordmark">KASUMI</span>
        </a>

        <div className="header__tools">
          <div className="language-switch" aria-label="Language">
            <a className="language-switch__item is-active magnetic" href="#home">
              <i />
              <span>en</span>
            </a>
            <a className="language-switch__item magnetic" href="#home">
              <i />
              <span>ja</span>
            </a>
          </div>

          <button
            className="menu-trigger magnetic"
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
          >
            <span className="menu-trigger__circle">
              <i />
              <i />
            </span>
            <span className="menu-trigger__text">
              {menuOpen ? "close" : "menu"}
            </span>
            <span className="menu-trigger__line" />
          </button>
        </div>
      </header>

      <nav className={menuOpen ? "menu-overlay is-open" : "menu-overlay"}>
        <div className="menu-overlay__fog" />

        <div className="menu-overlay__body">
          <ul className="menu-overlay__list">
            {menuItems.map((item, index) => (
              <li key={item}>
                <a
                  href={item === "home" ? "#home" : "#" + item}
                  onClick={() => setMenuOpen(false)}
                >
                  <span className="menu-overlay__dot" />
                  <span className="menu-overlay__number">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="menu-overlay__word">{item}</span>
                  <span className="menu-overlay__line" />
                </a>
              </li>
            ))}
          </ul>

          <div className="menu-overlay__locations">
            <div>
              <span>tokyo</span>
              <p>35°41′N / 139°41′E</p>
            </div>
            <div>
              <span>copenhagen</span>
              <p>55°40′N / 12°34′E</p>
            </div>
          </div>
        </div>
      </nav>

      <aside className="aside-fixed">
        <small>©2026</small>

        <div className="aside-fixed__clocks">
          <Clock zone="Asia/Dubai" place="gst, dubai uae" />
          <Clock zone="Asia/Tokyo" place="jst, tokyo" />
        </div>

        <span className="aside-fixed__scroll">scroll</span>
      </aside>

      <section className="hero" id="home">
        <div className="hero__background">
          <img src={IMAGES.hero} alt="" />
        </div>

        <FogCanvas />

        <h1 className="hero__title">
          <span className="hero__title-mask">
            <span className="hero__title-inner">Remember who you are</span>
          </span>
        </h1>
      </section>

      <section className="philosophy" id="philosophy">
        <div className="philosophy__sticky">
          <div className="layout-grid">
            <SectionLabel>philosophy</SectionLabel>

            <div className="philosophy__main">
              <p className="paragraph-title mesh-title">
                <span className="mesh-title__clip">
                  <span className="mesh-title__line">Sharing a quieter</span>
                </span>
                <span className="mesh-title__clip">
                  <span className="mesh-title__line">way of seeing</span>
                </span>
              </p>

              <div className="philosophy__description text-reveal">
                <p>
                  Harmony is not something we add at the end. It appears when each
                  element is allowed to belong — material, light, silence and time.
                </p>
                <p>
                  KASUMI creates spaces and objects that make attention feel natural
                  again.
                </p>
              </div>

              <CloneLink href="#projects">View Philosophy</CloneLink>
            </div>
          </div>
        </div>

        <div className="philosophy__gallery">
          <div className="philosophy__pair">
            <div className="philosophy-media philosophy-media--left">
              <LiquidMedia
                src={IMAGES.garden}
                intensity={0.34}
                ariaLabel="Quiet garden architecture"
              />
            </div>

            <div className="philosophy-media philosophy-media--right">
              <LiquidMedia
                src={IMAGES.water}
                intensity={0.3}
                ariaLabel="Quiet material study"
              />
            </div>
          </div>

          <div className="philosophy-media philosophy-media--single">
            <LiquidMedia
              src={IMAGES.incense}
              intensity={0.28}
              ariaLabel="Dark interior study"
            />
          </div>
        </div>
      </section>

      <section className="projects-intro" id="projects">
        <div className="projects-intro__sticky">
          <div className="projects-intro__bg">
            <img src={IMAGES.room} alt="" />
          </div>
          <div className="projects-intro__overlay" />

          <div className="layout-grid projects-intro__content">
            <SectionLabel>projects</SectionLabel>

            <div className="projects-intro__main">
              <p className="paragraph-title mesh-title">
                <span className="mesh-title__clip">
                  <span className="mesh-title__line">Designing the dimensions</span>
                </span>
                <span className="mesh-title__clip">
                  <span className="mesh-title__line">of slower living</span>
                </span>
              </p>

              <div className="projects-intro__description">
                <p>
                  Through three practices, KASUMI explores how life is nurtured,
                  how living is enriched, and how one returns to attention.
                </p>
              </div>

              <CloneLink href="#project-sequence">View Projects</CloneLink>
            </div>
          </div>
        </div>
      </section>

      <section className="project-sequence" id="project-sequence">
        <div className="project-stage">
          <div className="project-stage__label">projects</div>

          <div className="project-stage__copy">
            {PROJECTS.map((project, index) => (
              <article
                key={project.title}
                className={
                  activeProject === index
                    ? "project-copy is-active"
                    : "project-copy"
                }
                data-index={index}
              >
                <hgroup>
                  <h2>
                    <span>{project.index}</span>
                    <strong>{project.title}</strong>
                  </h2>
                </hgroup>

                <p className="project-copy__lead">{project.lead}</p>
                <p className="project-copy__description">
                  {project.description}
                </p>

                <CloneLink>{project.link}</CloneLink>
              </article>
            ))}
          </div>

          <div className="project-stage__media">
            {PROJECTS.map((project, index) => (
              <figure
                key={project.image}
                className={
                  activeProject === index
                    ? "project-layer is-active"
                    : "project-layer"
                }
                data-index={index}
              >
                <div className="project-stage__image">
                  <img src={project.image} alt={project.title} />
                </div>
              </figure>
            ))}
          </div>

          <div className="project-stage__counter">
            <span>{PROJECTS[activeProject].index}</span>
            <i />
            <span>03</span>
          </div>
        </div>

        <div className="project-markers" aria-hidden="true">
          {PROJECTS.map((project) => (
            <div className="project-marker" key={project.index} />
          ))}
        </div>
      </section>

      <section className="company" id="company">
        <div className="company__sticky">
          <div className="company__background">
            <img src={IMAGES.company} alt="" />
          </div>
          <div className="company__shade" />

          <div className="layout-grid company__content">
            <SectionLabel>company</SectionLabel>

            <div className="company__main">
              <div className="company__mark">
                <Seal />
                <span>KASUMI</span>
              </div>

              <p className="paragraph-title mesh-title">
                <span className="mesh-title__clip">
                  <span className="mesh-title__line">Who we are</span>
                </span>
              </p>

              <div className="company__description">
                <p>
                  We believe lasting work begins with attention. Across space,
                  object and digital experience, we build with restraint so the
                  essential qualities of a thing can remain visible.
                </p>
                <p>
                  Between Tokyo and Copenhagen, our practice combines Japanese
                  sensitivity with contemporary craft.
                </p>
              </div>

              <CloneLink href="#contact">View Company</CloneLink>
            </div>
          </div>
        </div>
      </section>

      <footer className="footer" id="contact">
        <div className="footer__inner">
          <div className="footer__head">
            <span className="footer__name">kasumi</span>

            <a className="footer__next magnetic" href="#philosophy">
              <span className="footer__next-rule footer__next-rule--top" />
              <span className="footer__next-clip">
                <span className="footer__next-title">Philosophy</span>
              </span>
              <span className="footer__next-rule footer__next-rule--bottom" />
            </a>
          </div>

          <div className="footer__body">
            <nav className="footer__nav">
              <a href="#home">home</a>
              <a href="#philosophy">philosophy</a>
              <a href="#projects">projects</a>
              <a href="#company">company</a>
              <a href="#contact">contact</a>
            </nav>

            <div className="footer__contact">
              <a href="mailto:hello@kasumi.studio">hello@kasumi.studio</a>
              <a href="#home">privacy policy</a>
            </div>

            <div className="footer__locations">
              <div>
                <span>copenhagen</span>
                <p>frederiksberg<br />denmark</p>
              </div>
              <div>
                <span>tokyo</span>
                <p>kiyosumi<br />tokyo, japan</p>
              </div>
            </div>
          </div>

          <div className="footer__foot">
            <small>©2026</small>

            <div className="footer__clocks">
              <Clock zone="Europe/Copenhagen" place="cest, copenhagen" />
              <Clock zone="Asia/Tokyo" place="jst, tokyo" />
            </div>

            <a href="#home">top</a>
          </div>
        </div>
      </footer>
    </main>
  );
}
