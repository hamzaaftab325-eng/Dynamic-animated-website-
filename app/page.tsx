"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import CloudLayers from "../components/CloudLayers";
import LiquidMedia from "../components/LiquidMedia";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const IMAGES = {
  hero: "/home_fv_img.webp",
  philosophy1:
    "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&q=88&w=1800",
  philosophy2:
    "https://images.unsplash.com/photo-1600607688969-a5bfcd646154?auto=format&fit=crop&q=88&w=1800",
  philosophy3:
    "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&q=88&w=1800",
  projectsBackground: "/home_projects_img.webp",
  school:
    "https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&q=88&w=1800",
  craft:
    "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&q=88&w=1800",
  retreat:
    "https://images.unsplash.com/photo-1500534314209-a25ddb2bd4296?auto=format&fit=crop&q=88&w=1800",
  company: "/home_company_img.webp",
};

const PROJECTS = [
  {
    index: "01",
    title: "School",
    lead: "Nurturing the foundations of life.",
    description:
      "A quiet place for learning, care and presence — designed around the relationship between parent, child and the spaces they grow through.",
    image: IMAGES.school,
  },
  {
    index: "02",
    title: "Craft",
    lead: "Awakening the senses through Japanese aesthetics.",
    description:
      "Objects and spaces shaped through texture, restraint and contemporary Japanese sensibility. Less decoration, more depth.",
    image: IMAGES.craft,
  },
  {
    index: "03",
    title: "Retreat",
    lead: "Returning to your essence.",
    description:
      "A slower experience of landscape, ritual and quiet. A space to move away from noise and back toward attention.",
    image: IMAGES.retreat,
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
}: {
  children: React.ReactNode;
  href?: string;
}) {
  return (
    <a href={href} className="clone-link magnetic">
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

  const menuItems = useMemo(
    () => ["home", "philosophy", "projects", "company", "contact"],
    []
  );

  useEffect(() => {
    if ("scrollRestoration" in history) {
      history.scrollRestoration = "manual";
    }
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });

    let current = 0;
    const id = window.setInterval(() => {
      current += Math.max(4, Math.round((100 - current) * 0.24));

      if (current >= 100) {
        setProgress(100);
        window.clearInterval(id);
        window.setTimeout(() => setLoaded(true), 160);
      } else {
        setProgress(current);
      }
    }, 26);

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

    const lenis = new Lenis();
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
      gsap.fromTo(
        ".hero__background",
        { opacity: 0, scale: 1.02 },
        { opacity: 1, scale: 1, duration: 1.25, ease: "power3.out" }
      );

      gsap.fromTo(
        ".hero__title-inner",
        { yPercent: 100, opacity: 0 },
        {
          yPercent: 0,
          opacity: 1,
          duration: 1.05,
          delay: 0.15,
          ease: "expo.out",
        }
      );

      gsap.fromTo(
        ".aside-fixed",
        { opacity: 0 },
        { opacity: 1, duration: 0.6, delay: 0.35, ease: "none" }
      );

      ScrollTrigger.create({
        trigger: ".hero",
        start: () => "top+=" + window.innerHeight * 0.12 + " top",
        onEnter: () =>
          gsap.to(".hero__title", {
            autoAlpha: 0,
            duration: 0.5,
            ease: "power2.out",
          }),
        onLeaveBack: () =>
          gsap.to(".hero__title", {
            autoAlpha: 1,
            duration: 0.5,
            ease: "power2.out",
          }),
      });

      const cloudWrapper = document.querySelector<HTMLElement>(".homeHeader_cloud");
      if (cloudWrapper) {
        gsap.fromTo(
          cloudWrapper,
          { y: 0 },
          {
            y: () => cloudWrapper.getBoundingClientRect().height * 0.5,
            ease: "none",
            scrollTrigger: {
              trigger: ".hero",
              start: "top top",
              end: "bottom top",
              scrub: true,
              invalidateOnRefresh: true,
            },
          }
        );
      }

      gsap.utils.toArray<HTMLElement>(".mesh-title").forEach((title) => {
        const lines = title.querySelectorAll<HTMLElement>(".mesh-title__line");

        gsap.fromTo(
          lines,
          { yPercent: 100, opacity: 0 },
          {
            yPercent: 0,
            opacity: 1,
            duration: 1.4,
            stagger: 0.07,
            ease: "expo.out",
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
          { y: 20, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1.1,
            ease: "expo.out",
            scrollTrigger: {
              trigger: item,
              start: "top 90%",
              once: true,
            },
          }
        );
      });

      gsap.utils.toArray<HTMLElement>(".philosophy-media").forEach((media) => {
        gsap.fromTo(
          media,
          { clipPath: "inset(0 0 100% 0)" },
          {
            clipPath: "inset(0 0 0% 0)",
            duration: 1.4,
            ease: "expo.out",
            scrollTrigger: {
              trigger: media,
              start: "top 88%",
              once: true,
            },
          }
        );
      });

      gsap.fromTo(
        ".projects-intro__content",
        { opacity: 0, y: 22 },
        {
          opacity: 1,
          y: 0,
          duration: 1.1,
          ease: "expo.out",
          scrollTrigger: {
            trigger: ".projects-intro",
            start: "top 74%",
            once: true,
          },
        }
      );

      gsap.utils.toArray<HTMLElement>(".project-sticky__image img").forEach((image) => {
        gsap.fromTo(
          image,
          { yPercent: -5 },
          {
            yPercent: 5,
            ease: "none",
            scrollTrigger: {
              trigger: image.closest(".project-sticky"),
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          }
        );
      });

      if (desktop) {
        const target = document.querySelector<HTMLElement>(".project-sequence");
        const sections = document.querySelector<HTMLElement>(".project-sections");
        const items = Array.from(
          document.querySelectorAll<HTMLElement>(".project-sticky")
        );

        if (target && sections && items.length) {
          const sectionHeight = items[0].getBoundingClientRect().height;
          const targetHeight = sections.getBoundingClientRect().height;
          const finalHeight = Math.max(
            sectionHeight,
            targetHeight - sectionHeight * 0.5
          );

          target.style.height = String(finalHeight) + "px";

          const range = Math.max(finalHeight - window.innerHeight, 1);
          const half = sectionHeight * 0.5;

          items.forEach((item, index) => {
            if (index === 0) {
              item.style.top = "0px";
            } else if (index === items.length - 1) {
              item.style.top = "";
            } else {
              const raw = sectionHeight * index;
              const top = (half * raw) / (range + half);
              item.style.top = String(top) + "px";
            }
          });

          gsap.to(sections, {
            y: -half,
            ease: "none",
            scrollTrigger: {
              trigger: target,
              start: "top top",
              end: "bottom bottom",
              scrub: true,
              invalidateOnRefresh: true,
            },
          });
        }
      }

      gsap.fromTo(
        ".company__content",
        { opacity: 0, y: 24 },
        {
          opacity: 1,
          y: 0,
          duration: 1.2,
          ease: "expo.out",
          scrollTrigger: {
            trigger: ".company",
            start: "top 78%",
            once: true,
          },
        }
      );

      gsap.fromTo(
        ".footer__next-title",
        { yPercent: 100 },
        {
          yPercent: 0,
          duration: 1.0,
          ease: "expo.out",
          scrollTrigger: {
            trigger: ".footer",
            start: "top 85%",
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
      dot.style.transform =
        "translate3d(" + tx + "px," + ty + "px,0)";
    };

    const tick = () => {
      x += (tx - x) * 0.2;
      y += (ty - y) * 0.2;
      cursor.style.transform =
        "translate3d(" + x + "px," + y + "px,0)";
      frame = requestAnimationFrame(tick);
    };

    const over = (event: Event) => {
      const target = event.target as HTMLElement;
      if (target.closest(".magnetic, .project-sticky__image, .philosophy-media")) {
        cursor.classList.add("is-active");
      }
    };

    const out = (event: Event) => {
      const target = event.target as HTMLElement;
      if (target.closest(".magnetic, .project-sticky__image, .philosophy-media")) {
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

  return (
    <main ref={rootRef} className={loaded ? "site is-loaded" : "site"}>
      <div className="cursor" aria-hidden="true">
        <span>VIEW</span>
      </div>
      <div className="cursor-dot" aria-hidden="true" />

      <div className={loaded ? "loader loader--done" : "loader"}>
        <p className="loader__message">Remember who you are</p>
        <div className="loader__progress">{progress}</div>
      </div>

      <header className="header">
        <a className="header__logo magnetic" href="#home" aria-label="Kasumi home">
          <Seal />
          <span className="header__wordmark">KASUMI</span>
        </a>

        <div className="header__tools">
          <div className="language-switch">
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
          >
            <span className="menu-trigger__circle">
              <i />
              <i />
            </span>
            <span>{menuOpen ? "close" : "menu"}</span>
            <span className="menu-trigger__line" />
          </button>
        </div>
      </header>

      <nav className={menuOpen ? "menu-overlay is-open" : "menu-overlay"}>
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
        </div>
      </nav>

      <aside className="aside-fixed">
        <small>©2026</small>
        <div className="aside-fixed__clocks">
          <Clock zone="Asia/Dubai" place="gst, dubai uae" />
          <Clock zone="Asia/Tokyo" place="jst, tokyo jpn" />
        </div>
        <span className="aside-fixed__scroll">scroll</span>
      </aside>

      <section className="hero" id="home">
        <div className="hero__contents">
          <div className="hero__inner">
            <h1 className="hero__title">
              <span className="hero__title-mask">
                <span className="hero__title-inner">Remember who you are</span>
              </span>
            </h1>
          </div>
        </div>

        <div className="hero__background">
          <img src={IMAGES.hero} alt="" />
        </div>

        <CloudLayers />
      </section>

      <section className="philosophy" id="philosophy">
        <div className="layout-grid philosophy__content">
          <SectionLabel>philosophy</SectionLabel>

          <div className="philosophy__head">
            <p className="paragraph-title mesh-title">
              <span className="mesh-title__clip">
                <span className="mesh-title__line">Sharing</span>
              </span>
              <span className="mesh-title__clip">
                <span className="mesh-title__line">the quiet spirit</span>
              </span>
              <span className="mesh-title__clip">
                <span className="mesh-title__line paragraph-title__end">of harmony</span>
              </span>
            </p>

            <div className="philosophy__description text-reveal">
              <p>
                Harmony is not something to be created. It is something to be
                remembered — a quiet path back to oneself and to the world around us.
              </p>
            </div>

            <CloneLink href="#projects">View Philosophy</CloneLink>
          </div>

          <div className="philosophy__foot">
            <div className="philosophy__images">
              <div className="philosophy-media philosophy-media--one">
                <LiquidMedia src={IMAGES.philosophy1} intensity={0.22} />
              </div>
              <div className="philosophy-media philosophy-media--two">
                <LiquidMedia src={IMAGES.philosophy2} intensity={0.2} />
              </div>
              <div className="philosophy-media philosophy-media--three">
                <LiquidMedia src={IMAGES.philosophy3} intensity={0.18} />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="projects-intro" id="projects">
        <div className="projects-intro__background">
          <img src={IMAGES.projectsBackground} alt="" />
        </div>

        <div className="layout-grid projects-intro__content">
          <SectionLabel>projects</SectionLabel>

          <div className="projects-intro__main">
            <p className="paragraph-title mesh-title">
              <span className="mesh-title__clip">
                <span className="mesh-title__line">Designing</span>
              </span>
              <span className="mesh-title__clip">
                <span className="mesh-title__line">the dimensions</span>
              </span>
              <span className="mesh-title__clip">
                <span className="mesh-title__line">of life</span>
              </span>
            </p>

            <p className="projects-intro__description text-reveal">
              Through three practices, KASUMI explores how life is nurtured, how
              living is enriched, and how one returns to attention.
            </p>

            <CloneLink href="#project-sequence">View Projects</CloneLink>
          </div>
        </div>
      </section>

      <section className="project-sequence" id="project-sequence">
        <div className="project-sections">
          {PROJECTS.map((project) => (
            <section className="project-sticky" key={project.index}>
              <div className="project-sticky__inner">
                <SectionLabel>projects</SectionLabel>

                <div className="project-sticky__body">
                  <div className="project-sticky__text">
                    <h2 className="project-sticky__title">
                      <span>{project.index}</span>
                      <strong>{project.title}</strong>
                    </h2>

                    <p className="project-sticky__lead">{project.lead}</p>
                    <p className="project-sticky__description">
                      {project.description}
                    </p>

                    <CloneLink>View {project.title}</CloneLink>
                  </div>

                  <figure className="project-sticky__image">
                    <img src={project.image} alt={project.title} />
                  </figure>
                </div>
              </div>
            </section>
          ))}
        </div>
      </section>

      <section className="company" id="company">
        <div className="company__background">
          <img src={IMAGES.company} alt="" />
        </div>

        <div className="company__content">
          <SectionLabel>company</SectionLabel>

          <div className="company__main">
            <div className="company__mark">
              <Seal />
            </div>

            <div className="company__text">
              <p className="paragraph-title mesh-title">
                <span className="mesh-title__clip">
                  <span className="mesh-title__line">Who we are</span>
                </span>
              </p>

              <div className="company__description text-reveal">
                <p>
                  No matter how the world changes, what truly enriches human life
                  remains remarkably quiet: attention, beauty, craft and belonging.
                </p>
                <p>
                  Across cultures and borders, we carry a way of being that leaves
                  room for one&apos;s inner nature to unfold.
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
              <span className="footer__next-rule" />
              <span className="footer__next-clip">
                <span className="footer__next-title">Philosophy</span>
              </span>
              <span className="footer__next-rule" />
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
                <span>dubai</span>
                <p>concept office<br />uae</p>
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
              <Clock zone="Asia/Dubai" place="gst, dubai uae" />
              <Clock zone="Asia/Tokyo" place="jst, tokyo jpn" />
            </div>

            <a href="#home">top</a>
          </div>
        </div>
      </footer>
    </main>
  );
}
