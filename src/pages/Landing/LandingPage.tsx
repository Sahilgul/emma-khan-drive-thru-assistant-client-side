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
    ArrowRight,
    Bot,
    Mic,
    MessageSquare,
} from "lucide-react";
import { showSuccess, showError } from "../../utils/alert";
import emailjs from "emailjs-com";
import emmaHero from "../../assets/Emmakhan-gpt_portrait.png";
import "./LandingPage.css";

interface Feature {
    icon: React.ComponentType<{ size?: number; className?: string }>;
    title: string;
    text: string;
    step: number;
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
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const formRef = useRef<HTMLFormElement>(null);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // Track mouse for parallax effects
    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            setMousePosition({
                x: (e.clientX / window.innerWidth - 0.5) * 20,
                y: (e.clientY / window.innerHeight - 0.5) * 20,
            });
        };
        window.addEventListener("mousemove", handleMouseMove);
        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, []);

    const toggleMenu = () => setMenuOpen((prev) => !prev);

    const scrollToSection = (id: string) => {
        const section = document.getElementById(id);
        if (section) {
            section.scrollIntoView({ behavior: "smooth" });
            setMenuOpen(false);
        }
    };

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
            icon: Mic,
            title: "Voice-First Ordering",
            text: "Emma greets customers naturally and takes orders with human-like conversation.",
            step: 1,
        },
        {
            icon: Bot,
            title: "AI-Powered Processing",
            text: "Intelligent order verification with smart upselling suggestions.",
            step: 2,
        },
        {
            icon: MessageSquare,
            title: "Seamless Integration",
            text: "Direct kitchen connection for instant order transmission.",
            step: 3,
        },
        {
            icon: CheckCircle,
            title: "Perfect Accuracy",
            text: "Every order confirmed correctly, every time.",
            step: 4,
        },
    ];

    const benefits: Benefit[] = [
        {
            icon: Zap,
            title: "Faster Service",
            text: "Reduce wait times by 40% with instant AI processing.",
        },
        {
            icon: CheckCircle,
            title: "Zero Errors",
            text: "AI ensures perfect order accuracy every time.",
        },
        {
            icon: Sparkles,
            title: "Smart Upsells",
            text: "Boost revenue with intelligent combo suggestions.",
        },
        {
            icon: Settings,
            title: "Easy Control",
            text: "Update menus and settings from your dashboard.",
        },
    ];

    const navItems = ["Home", "How It Works", "Benefits", "Contact"];

    return (
        <div className="landing-container">
            {/* Animated Background Orbs */}
            <div className="background-orbs">
                <div className="orb orb-1" />
                <div className="orb orb-2" />
                <div className="orb orb-3" />
            </div>

            {/* Navbar */}
            <header className={`navbar ${scrolled ? "scrolled" : ""}`}>
                <div className="navbar-inner">
                    <div className="landing-logo">
                        <span className="logo-text">Emma</span>
                        <span className="logo-badge">AI</span>
                    </div>

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
                                onClick={() =>
                                    scrollToSection(item.toLowerCase().replace(/\s+/g, "-"))
                                }
                            >
                                {item}
                            </a>
                        ))}
                    </nav>

                    <div className="nav-right">
                        <a href="signin" className="login-btn">
                            <User size={18} /> Login
                        </a>
                        <button
                            className="cta-btn-primary"
                            onClick={() => scrollToSection("contact")}
                        >
                            Get Started
                            <ArrowRight size={18} />
                        </button>
                    </div>
                </div>
            </header>

            {/* Hero Section */}
            <section id="home" className="hero-section">
                <div className="hero-content">
                    <div className="hero-text">
                        <div className="hero-badge">
                            <Sparkles size={16} />
                            <span>AI-Powered Drive-Thru</span>
                        </div>

                        <h1 className="hero-title">
                            Meet <span className="gradient-text">Emma</span>
                            <br />
                            Your AI Order Assistant
                        </h1>

                        <p className="hero-subtitle">
                            Transform your drive-thru experience with voice-powered AI.
                            Faster orders, zero errors, happier customers.
                        </p>

                        <div className="hero-cta-group">
                            <button
                                className="cta-btn-primary large"
                                onClick={() => scrollToSection("contact")}
                            >
                                Start Free Trial
                                <ArrowRight size={20} />
                            </button>
                            <button
                                className="cta-btn-secondary"
                                onClick={() => scrollToSection("how-it-works")}
                            >
                                <Play size={20} />
                                Watch Demo
                            </button>
                        </div>

                        <div className="hero-stats">
                            <div className="stat-item">
                                <span className="stat-value">40%</span>
                                <span className="stat-label">Faster Orders</span>
                            </div>
                            <div className="stat-divider" />
                            <div className="stat-item">
                                <span className="stat-value">99.9%</span>
                                <span className="stat-label">Accuracy</span>
                            </div>
                            <div className="stat-divider" />
                            <div className="stat-item">
                                <span className="stat-value">24/7</span>
                                <span className="stat-label">Available</span>
                            </div>
                        </div>
                    </div>

                    <div className="hero-visual">
                        {/* 3D Card Container */}
                        <div
                            className="hero-3d-card"
                            style={{
                                transform: `perspective(1000px) rotateY(${mousePosition.x * 0.5}deg) rotateX(${-mousePosition.y * 0.5}deg)`,
                            }}
                        >
                            {/* Floating Elements */}
                            <div className="floating-element floating-1">
                                <Bot size={24} />
                            </div>
                            <div className="floating-element floating-2">
                                <Mic size={20} />
                            </div>
                            <div className="floating-element floating-3">
                                <MessageSquare size={22} />
                            </div>

                            {/* Emma Avatar */}
                            <div className="emma-avatar-container">
                                <div className="avatar-glow" />
                                <img
                                    src={emmaHero}
                                    alt="Emma - AI Assistant"
                                    className="emma-avatar"
                                />
                                <div className="avatar-ring" />
                            </div>

                            {/* Status Card */}
                            <div className="status-card">
                                <div className="status-dot active" />
                                <span>Emma is Active</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Gradient Overlay */}
                <div className="hero-gradient-bottom" />
            </section>

            {/* How It Works Section */}
            <section id="how-it-works" className="section-how-it-works">
                <div className="section-container">
                    <div className="section-header">
                        <span className="section-tag">How It Works</span>
                        <h2 className="section-title">
                            From Hello to <span className="gradient-text">Served</span> in
                            Seconds
                        </h2>
                        <p className="section-description">
                            Emma makes your drive-thru faster, smarter, and stress-free with
                            just four simple steps.
                        </p>
                    </div>

                    <div className="features-grid">
                        {features.map((feature, index) => {
                            const Icon = feature.icon;
                            return (
                                <div
                                    key={index}
                                    className="feature-card-3d"
                                    style={{ animationDelay: `${index * 0.1}s` }}
                                >
                                    <div className="feature-card-inner">
                                        <div className="feature-step">{feature.step}</div>
                                        <div className="feature-icon-wrapper">
                                            <Icon size={28} className="feature-icon" />
                                        </div>
                                        <h3 className="feature-title">{feature.title}</h3>
                                        <p className="feature-text">{feature.text}</p>
                                    </div>
                                    <div className="feature-card-shine" />
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Benefits Section */}
            <section id="benefits" className="section-benefits">
                <div className="section-container benefits-container">
                    <div className="benefits-visual">
                        <div className="benefits-3d-showcase">
                            <div className="showcase-card">
                                <img
                                    src={emmaHero}
                                    alt="Emma"
                                    className="showcase-avatar"
                                />
                                <div className="showcase-info">
                                    <h4>Emma</h4>
                                    <p>Your AI Assistant</p>
                                </div>
                            </div>
                            <div className="showcase-stats">
                                <div className="showcase-stat">
                                    <span className="value">2.5s</span>
                                    <span className="label">Avg Response</span>
                                </div>
                                <div className="showcase-stat">
                                    <span className="value">10K+</span>
                                    <span className="label">Orders Daily</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="benefits-content">
                        <span className="section-tag">Why Choose Us</span>
                        <h2 className="section-title">
                            Why Restaurants <span className="gradient-text">Love Emma</span>
                        </h2>
                        <p className="section-description">
                            Transform your drive-thru into a faster, smarter, and more
                            profitable channel.
                        </p>

                        <div className="benefits-list">
                            {benefits.map((benefit, index) => {
                                const Icon = benefit.icon;
                                return (
                                    <div key={index} className="benefit-item">
                                        <div className="benefit-icon-wrapper">
                                            <Icon size={24} className="benefit-icon" />
                                        </div>
                                        <div className="benefit-content">
                                            <h4>{benefit.title}</h4>
                                            <p>{benefit.text}</p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </section>

            {/* Contact Section */}
            <section id="contact" className="section-contact">
                <div className="section-container">
                    <div className="contact-wrapper">
                        <div className="contact-info">
                            <span className="section-tag">Get Started</span>
                            <h2 className="section-title">
                                Ready to <span className="gradient-text">Transform</span> Your
                                Drive-Thru?
                            </h2>
                            <p className="section-description">
                                Book a demo to see Emma in action. Our team will help you get
                                started with AI-powered ordering.
                            </p>

                            <div className="contact-features">
                                <div className="contact-feature">
                                    <ArrowRight size={20} />
                                    <span>Free 14-day trial</span>
                                </div>
                                <div className="contact-feature">
                                    <ArrowRight size={20} />
                                    <span>No credit card required</span>
                                </div>
                                <div className="contact-feature">
                                    <ArrowRight size={20} />
                                    <span>Setup in under 30 minutes</span>
                                </div>
                            </div>
                        </div>

                        <form
                            ref={formRef}
                            className="contact-form"
                            onSubmit={sendEmail}
                        >
                            <div className="form-row">
                                <div className="form-group">
                                    <label htmlFor="first_name">First Name</label>
                                    <input
                                        type="text"
                                        id="first_name"
                                        name="first_name"
                                        placeholder="John"
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="last_name">Last Name</label>
                                    <input
                                        type="text"
                                        id="last_name"
                                        name="last_name"
                                        placeholder="Doe"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label htmlFor="email">Email Address</label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    placeholder="john@restaurant.com"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="company">Restaurant Name</label>
                                <input
                                    type="text"
                                    id="company"
                                    name="company"
                                    placeholder="Your Restaurant"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="message">Message (Optional)</label>
                                <textarea
                                    id="message"
                                    name="message"
                                    placeholder="Tell us about your drive-thru needs..."
                                    rows={4}
                                />
                            </div>

                            <button
                                type="submit"
                                className="cta-btn-primary full-width"
                                disabled={isSending}
                            >
                                {isSending ? "Sending..." : "Book a Demo"}
                                <ArrowRight size={20} />
                            </button>
                        </form>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="footer">
                <div className="footer-content">
                    <div className="footer-brand">
                        <div className="landing-logo">
                            <span className="logo-text">Emma</span>
                            <span className="logo-badge">AI</span>
                        </div>
                        <p>AI-powered drive-thru assistant for faster, smarter restaurants.</p>
                    </div>

                    <div className="footer-links">
                        <h4>Quick Links</h4>
                        <ul>
                            <li onClick={() => scrollToSection("home")}>Home</li>
                            <li onClick={() => scrollToSection("how-it-works")}>
                                How It Works
                            </li>
                            <li onClick={() => scrollToSection("benefits")}>Benefits</li>
                            <li onClick={() => scrollToSection("contact")}>Contact</li>
                        </ul>
                    </div>

                    <div className="footer-newsletter">
                        <h4>Stay Updated</h4>
                        <p>Get the latest updates on AI drive-thru technology.</p>
                        <div className="newsletter-form">
                            <input type="email" placeholder="Enter your email" />
                            <button className="cta-btn-primary small">Subscribe</button>
                        </div>
                    </div>
                </div>

                <div className="footer-bottom">
                    <p>
                        © {new Date().getFullYear()} Emma AI. All rights reserved.
                    </p>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
