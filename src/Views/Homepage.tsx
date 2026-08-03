import { CSSProperties, memo, useState } from "react";
import LogoImg from "../components/general/LogoImg";
import { useMediaQuery } from "../hooks/ViewPortHooks";
import { useThemeContext } from "../hooks/ProviderHooks";
import IconWrapper, { IconName } from "../components/general/IconWrapper";
import { Link } from "react-router-dom";
import Skeleton from "../components/skeleton/Skeleton";
import { TaskProgressBar } from "../components/tasks/ProgressBarContainer";
import { motion, Variants } from "framer-motion";
import { StatsGrid } from "../components/general/StatsGrid";
import ThemeBtn from "../components/general/ThemeBtn";


const CURRENT_YEAR = new Date().getFullYear();

const letterVariants: Variants = {
  hidden: { opacity: 0, scale: 0 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { ease: "easeOut", duration: 0.2 }
  },
};

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.03,
    },
  },
};

const FEATURES = [
  {
    icon: 'TbLayoutDashboardFilled',
    title: "Kanban & List Views",
    desc: "Switch between board and list views to match how your team thinks. Drag, reorder, and organize with ease.",
    colorClass: "icon-violet"
  },
  {
    icon: 'LuUser',
    title: "Team Collaboration",
    desc: "Assign tasks, mention teammates, and keep everyone aligned with real-time updates and shared workspaces.",
    colorClass: "icon-sky"
  },
  {
    icon: 'PiLightning',
    title: "Smart Prioritization",
    desc: "Surface what matters with priority badges, due-date alerts, and subtask progress rings at a glance.",
    colorClass: "icon-amber"

  },
  {
    icon: 'LuChartColumn',
    title: "Progress Tracking",
    desc: "Visual progress indicators and sprint analytics so you always know how close you are to the finish line.",
    colorClass: "icon-emerald"
  },
  {
    icon: 'FiShield',
    title: "Secure by Default",
    desc: "Enterprise-grade permissions, SSO, and audit logs keep your data safe without slowing your team down.",
    colorClass: "icon-rose"
  },
  {
    icon: 'CheckedIcon',
    title: "Subtask Checklists",
    desc: "Break big tasks into actionable steps. Check them off one by one and watch your progress ring fill up.",
    colorClass: "icon-indigo",
  },
];

const TESTIMONIALS = [
  {
    name: "Sarah Ramos",
    role: "Engineering Lead, Vercel",
    initials: "SR",
    color: "#6B5FED",
    quote: "Tasker cut our sprint planning time in half. The kanban view is exactly what our distributed team needed.",
    stars: 5,
  },
  {
    name: "Marcus Lee",
    role: "Product Manager, Linear",
    initials: "ML",
    color: "#D4518B",
    quote: "Finally a task tool that feels designed. The subtask rings and priority badges make status obvious at a glance.",
    stars: 5,
  },
  {
    name: "Aisha Okonkwo",
    role: "Design Director, Figma",
    initials: "AO",
    color: "#D4621A",
    quote: "We migrated from Jira and never looked back. The list view + dark mode alone was worth the switch.",
    stars: 5,
  },
];

const isLight: CSSProperties = { color: '#fff', backgroundColor: '#0F0F10' };
const isDark: CSSProperties = { color: '#0F0F10', backgroundColor: '#fff' };

function Homepage()
{
  const [isNavOpen, setIsNavOpen] = useState(false);
  const letters = Array.from('Ship faster with');

  const isMobile = useMediaQuery("(max-width: 768px)");
  const { currentTheme} = useThemeContext();
  const heroTotal = 15;
  const heroCompleted = 10;
  const percentage = Math.round((heroCompleted / heroTotal) * 100);

  const signUpLinkStyles = currentTheme === 'dark' ? isDark : isLight;

  return (
    <div className="container homepage">
      <header className="homepage-header el-grd">
        <div className="header-wrapper el-flx">
          <div className="logo-wrapper el-flx">
            <LogoImg />
            <h1>Tasker</h1>
          </div>

          {!isMobile && <nav className="header-nav">
            <ul className="nav-list el-flx">
              {["Features", "Pricing", "Changelog", "Docs"].map(item => (<li key={item} className="">
                <a className="nav-link" href="#">{item}</a>
              </li>))}
            </ul>
          </nav>}

          <div className="header-secondary--wrapper el-flx">
            <ThemeBtn />
            {isMobile ?
              <button type="button" className="menu-btn mobile-only" onClick={() => { setIsNavOpen(prev => !prev) }}>
                <IconWrapper name={isNavOpen ? 'FaXmark' : 'FaBarsStaggered'} className="menu-icon" />
              </button> :
              <nav className="header-nav header-nav--secondary">
                <ul className="el-flx">
                  <li className="nav-item">
                    <a className="nav-link" href="/auth/login">Log in</a>
                  </li>
                  <li className="nav-item" >
                    <a className="nav-link signup-link" href="/auth/signup" style={signUpLinkStyles}>Get started for free</a>
                  </li>
                </ul>
              </nav>
            }
          </div>
        </div>

        {(isNavOpen && isMobile) && <nav className="main-nav--mobile header-nav">
          <ul className="nav-list el-flx" style={{ flexDirection: 'column' }}>
            {["Features", "Pricing", "Changelog", "Docs"].map(item => (<li key={item} className="nav-item">
              <a className="nav-link" href="#">{item}</a>
            </li>))}
          </ul>
          <ul>
            <li className="nav-item"><a className="nav-link" href="/auth/login">Log in</a></li>
            <li className="nav-item" ><a className="nav-link signup-link" href="/auth/signup" style={signUpLinkStyles}
            >Get started for free</a></li>
          </ul>
        </nav>}
      </header>
      <main>
        {/* Hero section */}
        <section className="hero-section">
          {/* background gradient */}
          <div className="gradient-container">
            <div className="bg-glow-violet" />
            <div className="bg-glow-indigo" />
          </div>
          {/* hero main */}
          <div className="hero-main el-flx">
            <div className="badge el-flx">
              <IconWrapper name='PiLightning' />
              Upcoming Features · AI task suggestions
              <IconWrapper name='FaAngleRight' />
            </div>
            <motion.h1
              className={'hero-title'}
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              style={{ overflow: "hidden" }}
            >
              {letters.map((char, index) => (
                <motion.span
                  key={`${char}-${String(index)}`}
                  variants={letterVariants}
                  style={{ display: "inline-block", whiteSpace: "pre" }}
                >
                  {char === " " ? "\u00A0" : char}
                </motion.span>
              ))}<br />
              <span className="gradient-text">
                beautiful task boards
              </span>
            </motion.h1>

            <p className="hero-description">
              Tasker gives your team kanban boards, list views, subtask checklists, and sprint analytics — all in one polished workspace.
            </p>

            <div className="auth-links--wrapper">
              <Link to={'/auth/signup'}
                className="signup-link el-flx" style={signUpLinkStyles}
              >Start for free <IconWrapper name='FaAngleRight' />
              </Link>
            </div>
            {/* Social proof */}
            <div className="social-proof--wrapper el-flx">
              <span className="el-flx">
                <IconWrapper name="CheckedIcon" style={{ color: 'var(--primary-green)' }} />
                No credit card required
              </span>
              <span className="el-flx">
                <IconWrapper name="CheckedIcon" style={{ color: 'var(--primary-green)' }} />
                Free for teams up to 5
              </span>
              <span className="el-flx">
                <IconWrapper name="CheckedIcon" style={{ color: 'var(--primary-green)' }} />
                Set up in under 2 minutes
              </span>
            </div>
          </div>

          {/* dashboard preview */}
          <div className="dashboard-preview">
            <div className="preview-card">
              {/* Fake browser chrome */}
              <div className="browser-bar el-flx">
                <div className="window-dots el-flx">
                  <div className="dot dot-close" />
                  <div className="dot dot-minimize" />
                  <div className="dot dot-maximize" />
                </div>
                <div className="url-bar-wrapper">
                  <div className="url-bar">
                    app.tasker.io/dashboard
                  </div>
                </div>
              </div>
              {/* Mini dashboard mockup */}
              <div className="card-content">
                <div className="kanban-grid el-grd">
                  {[
                    { label: "To Do", count: 4, dot: "var(--status-todo-dot)" },
                    { label: "In Progress", count: 3, dot: "var(--status-progress-dot)" },
                    { label: "Done", count: 6, dot: "var(--status-done-dot)" },
                  ].map((col) => (
                    <div key={col.label} className="kanban-column">
                      <div className="kanban-header el-flx">
                        <div className={`status-dot`} style={{ backgroundColor: col.dot }} />
                        <span className="kanban-title">{col.label}</span>
                        <span className="kanban-count">{col.count}</span>
                      </div>
                      <div className="el-flx" style={{ gap: '.375rem', flexDirection: 'column' }}>
                        {Array.from({ length: col.count > 3 ? 3 : col.count }).map((_, i) => (
                          <Skeleton key={`mock-${String(i)}`} type="box" height={32} width={'100%'} />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
                <TaskProgressBar completed={heroCompleted} total={heroTotal} />
                <p className="progress-label" >Sprint 14 · {percentage}% complete</p>
              </div>
            </div>
          </div>

        </section>
        {/* stats */}
        <section className="stats-section">
          <div className="stats-container">
            <StatsGrid />
          </div>
        </section>
        {/* features */}
        <section className="features-section">
          <div className="section-header">
            <p className="section-eyebrow">Everything you need</p>
            <h2 className="section-title">Built for how teams actually work</h2>
            <p className="section-subtitle">Six core pillars that make Tasker the last project management tool you&apos;ll ever need.</p>
          </div>

          <div className="features-grid el-grd">
            {FEATURES.map(({ icon, title, desc, colorClass }) => (
              <div key={title} className="feature-card">
                <div className={`icon-wrapper el-flx ${colorClass}`}>
                  <IconWrapper name={icon as IconName} />
                </div>
                <h3 className="feature-item-title">{title}</h3>
                <p>{desc}</p>
              </div>
            ))}
          </div>
        </section>
        {/* testimonials */}
        <section className="testimonials-section">
          <div className="testimonials-container">
            <div className="section-header">
              <p className="section-eyebrow">Loved by teams</p>
              <h2 className="section-title">
                Don&apos;t take our word for it
              </h2>
            </div>

            <div className="testimonials-grid el-grd">
              {TESTIMONIALS.map((t) => (
                <div key={t.name} className="testimonial-card el-flx">
                  <div className="el-flx" style={{ gap: '.125rem' }}>
                    {Array.from({ length: t.stars }).map((_, i) => (
                      <IconWrapper key={`${t.name}-${String(i)}`} name="HiOutlineStar" style={{ color: '#fbbf24', fill: '#fbbf24', fontSize: '.875rem' }} />
                    ))}
                  </div>
                  <p className="testimonial-quote">&ldquo;{t.quote}&rdquo;</p>
                  <div className="testimonial-author el-flx">
                    <div className="author-avatar el-flx" style={{ backgroundColor: t.color }}>
                      {t.initials}
                    </div>
                    <div>
                      <p className="author-name">{t.name}</p>
                      <p className="author-role">{t.role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
        {/* CTA */}
        <section className="cta-section">
          <div className="cta-banner">
            <div className="cta-bg-pattern" style={{ backgroundImage: "radial-gradient(circle at 70% 30%, white 1px, transparent 1px)", backgroundSize: "40px 40px" }} />
            <div className="cta-content">
              <h2 className="cta-title">Ready to ship faster?</h2>
              <p className="cta-subtitle">Join 12,000+ teams already using Tasker. Free forever for small teams.</p>
              <div className="cta-actions el-flx">
                <Link to={'/auth/signup'} className="el-flx signup-link">Create free account <IconWrapper name='FaAngleRight' />
                </Link>
                <Link to={'/auth/login'} className="login-link">Sign in</Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      {/* Footer */}
      <footer className="homepage-footer">
        <div className="footer-container el-flx">
          <div className="flex items-center gap-2">
            <div className="logo-wrapper el-flx" style={{ alignItems: 'center', gap: '.5rem' }}>
              <LogoImg />
              <span style={{ fontFamily: "var(--font-header)", fontSize: '.8rem', fontWeight: 600 }}>Tasker</span>
            </div>
          </div>
          <p className="footer-copyright" style={{ fontSize: '.75rem', color: 'var(--text-muted)' }}>© {CURRENT_YEAR} Tasker. All rights reserved.</p>
          <div className="el-flx footer-links" style={{ alignItems: 'center', gap: '1rem' }}>
            {["Privacy", "Terms", "Status"].map((item) => (
              <Link to="#" key={item} className="footer-link">{item}</Link>
            ))}
          </div>
        </div>
      </footer>

    </div >)
}

export default memo(Homepage);

