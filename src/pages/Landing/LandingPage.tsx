import React, { useRef, useState, useEffect } from "react";
import {
  User,
  Menu,
  X,
  Play,
  Zap,
  CheckCircle,
  Sparkles,
  Settings,
  ArrowRight
} from "lucide-react";
import { showSuccess, showError } from "../../utils/alert";
import emailjs from "emailjs-com";
import "./LandingPage.css";

interface Feature {
  img: string;
  title: string;
  text: string;
}

interface Benefit {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  title: string;
  text: string;
}

const LandingPage: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMenu = () => setMenuOpen((prev) => !prev);

  const scrollToSection = (id: string) => {
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
      setMenuOpen(false);
    }
  };

  // ========================= EMAIL SEND LOGIC =========================
  const sendEmail = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formRef.current) return;

    setIsSending(true);

    emailjs
      .sendForm(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
        formRef.current,
        import.meta.env.VITE_EMAILJS_PUBLIC_KEY
      )
      .then(
        (result) => {
          console.log("✅ Email sent:", result.text);
          showSuccess("Your message has been sent successfully!");
          formRef.current?.reset();
        },
        (error) => {
          console.error("❌ Email failed:", error.text);
          showError("Failed to send email. Please try again later.");
        }
      )
      .finally(() => setIsSending(false));
  };

  const features: Feature[] = [
    {
      img: "/images/customer.png",
      title: "Customer Speaks",
      text: "Emma greets customers and takes their order naturally — quick, clear, and consistent.",
    },
    {
      img: "/images/upsell.png",
      title: "Smart Processing & Upsell",
      text: "AI verifies each order instantly and suggests add-ons or combos to boost sales.",
    },
    {
      img: "/images/kitchen.png",
      title: "Direct Kitchen Integration",
      text: "Orders go straight to the kitchen — seamless, fast, and ready to prepare.",
    },
    {
      img: "/images/happyCustomer.png",
      title: "Happy Customers",
      text: "Smooth service, accurate orders, and satisfied customers every time.",
    },
  ];

  const benefits: Benefit[] = [
    {
      icon: Zap,
      title: "Faster Service",
      text: "Emma takes orders instantly and keeps lines moving smoothly.",
    },
    {
      icon: CheckCircle,
      title: "Always Accurate",
      text: "AI ensures orders are right every time, reducing errors.",
    },
    {
      icon: Sparkles,
      title: "Smarter Upsells",
      text: "Suggests combos while you control offers from the dashboard.",
    },
    {
      icon: Settings,
      title: "Easy Menu Control",
      text: "Update menus and promotions anytime with a simple dashboard.",
    },
  ];

  const navItems = ["HOME", "HOW IT WORKS", "BENEFITS", "PRICING", "BOOK DEMO"];

  const footerLinks = [
    { label: "Home", id: "home" },
    { label: "How It Works", id: "how-it-works" },
    { label: "Benefits", id: "benefits" },
    { label: "Pricing", id: "pricing" },
    { label: "Book Demo", id: "pricing" },
  ];

  const handleNavClick = (item: string) => {
    let targetId = item.toLowerCase().replace(/\s+/g, "-"); // default e.g., "HOW IT WORKS" → "how-it-works"

    // special cases
    if (item === "BOOK DEMO") targetId = "pricing";
    if (item === "HOW IT WORKS") targetId = "how-it-works";

    scrollToSection(targetId);
  };


  return (
    <div className="landing-container">
      {/* Navbar */}
      <header className={`navbar ${scrolled ? "scrolled" : ""}`}>
        <div className="navbar-inner">
          <div className="landing-logo"><img src="/images/Logo.png" alt="Drive Thru Assistant" /></div>

          <button
            className="menu-toggle"
            onClick={toggleMenu}
            aria-label="Toggle Menu"
          >
            {menuOpen ? <X size={26} /> : <Menu size={26} />}
          </button>

          <nav className={`nav-links ${menuOpen ? "active" : ""}`}>
            {navItems.map((item) => (
              <a
                key={item}
                onClick={() => handleNavClick(item)}
              >
                {item}
              </a>
            ))}
          </nav>
          <div className="nav-right">
            <a href="signin" className="login-btn">
              <User size={18} /> LOGIN
            </a>
            <button className="get-started-btn" onClick={() => scrollToSection("pricing")}>Get Started Today</button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section id="home" className="hero-section">
        <div className="hero-left">
          <h1>
            AI-Powered <span className="highlight">Drive-Thru</span> Assistant
          </h1>

          <p className="subtext">
            Meet Emma, your smart voice-powered drive-thru order taker – faster,
            friendlier, and always accurate.
          </p>

          <button className="get-started-btn" onClick={() => scrollToSection("pricing")}>
            Get Started Today
          </button>
        </div>

        <div className="hero-right">
          <img
            src="/images/hero-image.png"
            alt="Drive Thru Screens"
            className="hero-image"
          />
        </div>
      </section>

      {/* Secondary Section */}
      <section className="secondary-section">
        <div className="secondary-content">

          <div className="secondary-image">
            <img src="/images/X1.png" alt="Decorative" />
          </div>

          <div className="secondary-text">
            <h2>
              Talk to Emma and experience{" "}
              <span className="highlight">AI-powered drive-thru ordering</span> —
              fast, accurate, and effortless.
            </h2>
          </div>
        </div>
      </section>


      {/* How It Works Section */}
      <section id="how-it-works" className="work-section">
        <div className="work-container">
          <div className="work-text">
            <p className="section-subtitle">How It Works</p>
            <h1>
              From Hello to <span className="highlight">Served in Seconds</span>
            </h1>
            <p className="description">
              Emma makes your drive-thru faster, smarter, and stress-free. From
              greeting customers to sending accurate orders straight to the
              kitchen, everything flows seamlessly in just four steps.
            </p>
          </div>

          <div className="work-features">
            {features.map((feature, index) => (
              <div key={index} className="feature-card">
                <div className="feature-icon-wrapper">
                  <img src={feature.img} alt={feature.title} className="feature-icon" />
                </div>
                <h3>{feature.title}</h3>
                <p>{feature.text}</p>
              </div>
            ))}
          </div>

        </div>
      </section>


      {/* Benefits Section */}
      <section id="benefits" className="benefit-section">
        <div className="benefit-image">
          <img src="/images/dashboard.png" alt="Dashboard" />
        </div>

        <div className="benefit-text">
          <p className="small-heading">Benefits</p>
          <h2>
            Why Restaurants Love <span className="highlight">Emma</span>
          </h2>
          <p className="description">
            Emma transforms the drive-thru into a faster, smarter, and more
            profitable channel for your restaurant. Customers enjoy a smoother
            experience while your staff can focus on what matters most.
          </p>

          <ul className="benefit-list">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <li key={index}>
                  <Icon className="benefit-icon" size={24} />
                  <div>
                    <span className="title">{benefit.title}</span>
                    <p>{benefit.text}</p>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      {/* Video Section */}
      <section className="video-section">
        <div className="video-text">
          <h2>
            What Makes <span className="highlight">Emma Khan</span> Different
          </h2>
          <p>
            Emma Khan uses AI to make drive-thru ordering faster, smarter, and
            more profitable — improving accuracy, boosting sales, and easing staff
            workload.
          </p>
        </div>

        <div className="video-container">
          <img src="/images/video-bg.png" alt="Xpress Drive Thru" />
          <div className="video-overlay">
            <button className="play-btn" aria-label="Play Video">
              <Play size={40} style={{ color: "white", marginLeft: "5px" }} />
            </button>
          </div>
        </div>
      </section>

      {/* ordering Section */}
      <section className="ordering-section">
        <div className="ordering-content">
          <div className="ordering-text">
            <h2>
              Experience faster, smarter, and more accurate{" "}
              <span className="highlight">drive-thru ordering</span> with Emma.
            </h2>
          </div>

          <div className="ordering-image">
            <img src="/images/X2.png" alt="Drive-thru Ordering Illustration" />
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="pricing" className="contact-section">
        <div className="contact-box">
          <div className="contact-left">
            <p className="mini-heading">Let's Get Started</p>
            <h3>
              Let's Talk Drive-Thru{" "}
              <span className="highlight">Transformation</span>
            </h3>
            <p className="description">
              Have questions about Emma or want to see how AI can boost your
              drive-thru? Our team is here to help. Get in touch to book a demo,
              explore pricing, or customize a solution for your restaurant.
            </p>

            <ul className="contact-links">
              <li>
                <ArrowRight size={18} /> For Pricing
              </li>
              <li>
                <ArrowRight size={18} /> For Demo Requests
              </li>
            </ul>
          </div>

          <form ref={formRef} id="contactForm" className="contact-form" onSubmit={sendEmail}>
            <div className="form-group">
              <input
                type="text"
                name="first_name"
                placeholder="First Name"
                required
              />
              <input
                type="text"
                name="last_name"
                placeholder="Last Name"
                required
              />
            </div>
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              required
            />
            <input
              type="text"
              name="company"
              placeholder="Company Name"
              required
            />
            <textarea
              name="message"
              placeholder="Your Message"
              rows={4}
            ></textarea>

            <div className="checkbox-row">
              <input type="checkbox" id="consent" required />
              <label htmlFor="consent">
                I consent to have{" "}
                <span className="highlight">Emma Khan</span> store my submitted
                information.
              </label>
            </div>

            <button type="submit" className="send-btn" disabled={isSending}>
              {isSending ? "Sending..." : "Send Message"}
            </button>
          </form>
        </div>
      </section>

      {/* Footer Section */}
      <footer id="footer-section" className="footer">
        <div className="footer-content">
          {/* Left Section */}
          <div className="footer-left">
            <img src="/images/Logo.png" alt="Emma Khan" className="footer-logo" />
            <p>AI-powered drive-thru assistant for faster,
              smarter restaurants.</p>
          </div>

          {/* Links */}
          <div className="footer-links">
            <h4>Quick Links</h4>
            <ul>
              {footerLinks.map((link) => (
                <li key={link.id} onClick={() => scrollToSection(link.id)}>
                  {link.label}
                </li>
              ))}
            </ul>
          </div>

          {/* Email & Socials */}
          <div className="footer-email">
            <h4>Follow Us On</h4>
            <div className="socials">
              <i className="ri-facebook-fill"></i>
              <i className="ri-linkedin-fill"></i>
              <i className="ri-instagram-line"></i>
            </div>
          </div>

          {/* Newsletter */}
          <div className="footer-newsletter">
            <h4>
              Subscribe to our <span className="highlight">Newsletter</span>
            </h4>
            <p>Get the freshest news from us!</p>
            <div className="subscribe-box">
              <input type="email" placeholder="Your email" />
              <button>Subscribe</button>
            </div>
          </div>
        </div>

        {/* Bottom Copyright */}
        {/* <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} <span className="highlight"><a href="https://xpresstogo.com/" target="_blank" rel="noopener noreferrer">Xpress TO GO.</a></span> All rights reserved.</p>
      </div> */}
      </footer>


    </div>
  );
};

export default LandingPage;