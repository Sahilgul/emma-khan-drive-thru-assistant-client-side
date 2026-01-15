import React, { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
import emmaPortrait from "../../assets/Emmakhan-gpt_portrait.png";

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
    const navigate = useNavigate();
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
        setTimeout(() => {
            alert("Demo form submitted! (Connect your EmailJS in production)");
            formRef.current?.reset();
            setIsSending(false);
        }, 1500);
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
        <div className="min-h-screen bg-gradient-to-br from-teal-50 via-cyan-50 to-blue-50 relative overflow-hidden">
            {/* Animated Background Orbs */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-20 left-10 w-96 h-96 bg-teal-200 rounded-full opacity-20 blur-3xl animate-pulse" />
                <div className="absolute bottom-20 right-10 w-96 h-96 bg-cyan-200 rounded-full opacity-20 blur-3xl animate-pulse delay-1000" />
                <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-blue-200 rounded-full opacity-20 blur-3xl animate-pulse delay-2000" />
            </div>

            {/* Navbar */}
            <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white/80 backdrop-blur-lg shadow-lg' : 'bg-transparent'}`}>
                <div className="max-w-7xl mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <span className="text-2xl font-bold text-teal-600">Emma</span>
                            <span className="px-2 py-1 bg-teal-100 text-teal-700 text-xs font-semibold rounded">AI</span>
                        </div>

                        <button
                            className="lg:hidden text-teal-600 hover:text-teal-700 transition-colors"
                            onClick={toggleMenu}
                        >
                            {menuOpen ? <X size={26} /> : <Menu size={26} />}
                        </button>

                        <nav className={`${menuOpen ? 'flex' : 'hidden'} lg:flex absolute lg:relative top-full left-0 right-0 lg:top-auto flex-col lg:flex-row gap-2 lg:gap-8 bg-white lg:bg-transparent p-6 lg:p-0 shadow-lg lg:shadow-none`}>
                            {navItems.map((item) => (
                                <a
                                    key={item}
                                    onClick={() => scrollToSection(item.toLowerCase().replace(/\s+/g, "-"))}
                                    className="text-gray-700 hover:text-teal-600 font-medium transition-colors cursor-pointer"
                                >
                                    {item}
                                </a>
                            ))}
                        </nav>

                        <div className="hidden lg:flex items-center gap-4">
                            <button
                                className="flex items-center gap-2 px-4 py-2 text-teal-600 hover:text-teal-700 font-medium transition-colors"
                                onClick={() => navigate("/signin")}
                            >
                                <User size={18} /> Login
                            </button>
                            <button
                                className="flex items-center gap-2 px-6 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-medium transition-all shadow-lg hover:shadow-xl"
                                onClick={() => scrollToSection("contact")}
                            >
                                Get Started
                                <ArrowRight size={18} />
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Hero Section */}
            <section id="home" className="relative pt-32 pb-20 px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <div className="space-y-8">
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-teal-100 text-teal-700 rounded-full">
                                <Sparkles size={16} />
                                <span className="text-sm font-semibold">AI-Powered Drive-Thru</span>
                            </div>

                            <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                                Meet <span className="bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">Emma</span>
                                <br />
                                Your AI Order Assistant
                            </h1>

                            <p className="text-xl text-gray-600 leading-relaxed">
                                Transform your drive-thru experience with voice-powered AI. Faster orders, zero errors, happier customers.
                            </p>

                            <div className="flex flex-wrap gap-4">
                                <button
                                    className="flex items-center gap-2 px-8 py-4 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-semibold text-lg transition-all shadow-xl hover:shadow-2xl hover:scale-105"
                                    onClick={() => scrollToSection("contact")}
                                >
                                    Appointment
                                    <ArrowRight size={20} />
                                </button>
                                <button
                                    className="flex items-center gap-2 px-8 py-4 bg-white hover:bg-gray-50 text-teal-600 rounded-lg font-semibold text-lg transition-all shadow-lg border-2 border-teal-200"
                                    onClick={() => scrollToSection("how-it-works")}
                                >
                                    <Play size={20} />
                                    Watch Demo
                                </button>
                            </div>

                            <div className="flex flex-wrap gap-8 pt-4">
                                <div>
                                    <div className="text-3xl font-bold text-teal-600">40%</div>
                                    <div className="text-sm text-gray-600">Faster Orders</div>
                                </div>
                                <div className="w-px bg-gray-300" />
                                <div>
                                    <div className="text-3xl font-bold text-teal-600">99.9%</div>
                                    <div className="text-sm text-gray-600">Accuracy</div>
                                </div>
                                <div className="w-px bg-gray-300" />
                                <div>
                                    <div className="text-3xl font-bold text-teal-600">24/7</div>
                                    <div className="text-sm text-gray-600">Available</div>
                                </div>
                            </div>
                        </div>

                        <div className="relative">
                            <div
                                className="relative bg-white rounded-3xl shadow-2xl p-8 transform transition-transform duration-300"
                                style={{
                                    transform: `perspective(1000px) rotateY(${mousePosition.x * 0.2}deg) rotateX(${-mousePosition.y * 0.2}deg)`,
                                }}
                            >
                                <div className="absolute -top-4 -left-4 w-20 h-20 bg-teal-100 rounded-full flex items-center justify-center animate-bounce shadow-lg">
                                    <Bot size={28} className="text-teal-600" />
                                </div>
                                <div className="absolute -top-2 -right-2 w-16 h-16 bg-cyan-100 rounded-full flex items-center justify-center animate-pulse shadow-lg">
                                    <Mic size={20} className="text-cyan-600" />
                                </div>
                                <div className="absolute -bottom-4 -right-4 w-18 h-18 bg-blue-100 rounded-full flex items-center justify-center animate-bounce delay-500 shadow-lg">
                                    <MessageSquare size={24} className="text-blue-600" />
                                </div>

                                <div className="relative">
                                    <div className="w-72 h-[32rem] mx-auto bg-gradient-to-br from-teal-400 to-cyan-500 rounded-[2rem] flex items-center justify-center shadow-xl overflow-hidden ring-4 ring-white relative z-10 p-2">
                                        <div className="w-full h-full bg-gradient-to-br from-teal-600 to-cyan-700 rounded-[1.5rem] flex items-center justify-center overflow-hidden">
                                            <img
                                                src={emmaPortrait}
                                                alt="Emma AI"
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                    </div>
                                    <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 px-4 py-2 bg-teal-600 text-white rounded-full flex items-center gap-2 shadow-lg z-20">
                                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                                        <span className="text-sm font-semibold">Emma is Active</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* How It Works Section */}
            <section id="how-it-works" className="py-20 px-6 bg-white/50">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <span className="inline-block px-4 py-2 bg-teal-100 text-teal-700 rounded-full text-sm font-semibold mb-4">How It Works</span>
                        <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
                            From Hello to <span className="bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">Served</span> in Seconds
                        </h2>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                            Emma makes your drive-thru faster, smarter, and stress-free with just four simple steps.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {features.map((feature, index) => {
                            const Icon = feature.icon;
                            return (
                                <div
                                    key={index}
                                    className="relative bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-teal-100"
                                >
                                    <div className="absolute -top-4 -left-4 w-12 h-12 bg-gradient-to-br from-teal-500 to-cyan-500 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg">
                                        {feature.step}
                                    </div>
                                    <div className="w-14 h-14 bg-teal-100 rounded-xl flex items-center justify-center mb-4 mt-4">
                                        <Icon size={28} className="text-teal-600" />
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h3>
                                    <p className="text-gray-600">{feature.text}</p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Benefits Section */}
            <section id="benefits" className="py-20 px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <div className="relative">
                            <div className="bg-white rounded-3xl shadow-2xl p-8">
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="w-20 h-20 bg-gradient-to-br from-teal-400 to-cyan-500 rounded-full flex items-center justify-center">
                                        <Bot size={40} className="text-white" />
                                    </div>
                                    <div>
                                        <h4 className="text-xl font-bold text-gray-900">Emma</h4>
                                        <p className="text-gray-600">Your AI Assistant</p>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-teal-50 rounded-xl p-4">
                                        <div className="text-2xl font-bold text-teal-600">2.5s</div>
                                        <div className="text-sm text-gray-600">Avg Response</div>
                                    </div>
                                    <div className="bg-cyan-50 rounded-xl p-4">
                                        <div className="text-2xl font-bold text-cyan-600">10K+</div>
                                        <div className="text-sm text-gray-600">Orders Daily</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <span className="inline-block px-4 py-2 bg-teal-100 text-teal-700 rounded-full text-sm font-semibold">Why Choose Us</span>
                            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900">
                                Why Restaurants <span className="bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">Love Emma</span>
                            </h2>
                            <p className="text-xl text-gray-600">
                                Transform your drive-thru into a faster, smarter, and more profitable channel.
                            </p>

                            <div className="space-y-4 pt-4">
                                {benefits.map((benefit, index) => {
                                    const Icon = benefit.icon;
                                    return (
                                        <div key={index} className="flex gap-4 bg-white rounded-xl p-4 shadow-md hover:shadow-lg transition-shadow">
                                            <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                                <Icon size={24} className="text-teal-600" />
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-gray-900 mb-1">{benefit.title}</h4>
                                                <p className="text-gray-600">{benefit.text}</p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Contact Section */}
            <section id="contact" className="py-20 px-6 bg-gradient-to-br from-teal-600 to-cyan-600">
                <div className="max-w-6xl mx-auto">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <div className="text-white space-y-6">
                            <span className="inline-block px-4 py-2 bg-white/20 rounded-full text-sm font-semibold">Get Started</span>
                            <h2 className="text-4xl lg:text-5xl font-bold">
                                Ready to Transform Your Drive-Thru?
                            </h2>
                            <p className="text-xl text-teal-50">
                                Book a demo to see Emma in action. Our team will help you get started with AI-powered ordering.
                            </p>

                            <div className="space-y-3 pt-4">
                                <div className="flex items-center gap-3">
                                    <ArrowRight size={20} />
                                    <span className="text-lg">Free 14-day trial</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <ArrowRight size={20} />
                                    <span className="text-lg">No credit card required</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <ArrowRight size={20} />
                                    <span className="text-lg">Setup in under 30 minutes</span>
                                </div>
                            </div>
                        </div>

                        <form ref={formRef} className="bg-white rounded-2xl p-8 shadow-2xl space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">First Name</label>
                                    <input
                                        type="text"
                                        name="first_name"
                                        placeholder="John"
                                        required
                                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Last Name</label>
                                    <input
                                        type="text"
                                        name="last_name"
                                        placeholder="Doe"
                                        required
                                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none transition-all"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="john@restaurant.com"
                                    required
                                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none transition-all"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Restaurant Name</label>
                                <input
                                    type="text"
                                    name="company"
                                    placeholder="Your Restaurant"
                                    required
                                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none transition-all"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Message (Optional)</label>
                                <textarea
                                    name="message"
                                    placeholder="Tell us about your drive-thru needs..."
                                    rows={4}
                                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none transition-all resize-none"
                                />
                            </div>

                            <button
                                type="button"
                                onClick={(e) => {
                                    e.preventDefault();
                                    sendEmail(e as any);
                                }}
                                disabled={isSending}
                                className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-semibold text-lg transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isSending ? "Sending..." : "Book a Demo"}
                                <ArrowRight size={20} />
                            </button>
                        </form>
                    </div>
                </div>
            </section >

            {/* Footer */}
            < footer className="bg-white py-12 px-6 border-t border-gray-200" >
                <div className="max-w-7xl mx-auto">
                    <div className="grid md:grid-cols-3 gap-8 mb-8">
                        <div>
                            <div className="flex items-center gap-2 mb-4">
                                <span className="text-2xl font-bold text-teal-600">Emma</span>
                                <span className="px-2 py-1 bg-teal-100 text-teal-700 text-xs font-semibold rounded">AI</span>
                            </div>
                            <p className="text-gray-600">AI-powered drive-thru assistant for faster, smarter restaurants.</p>
                        </div>

                        <div>
                            <h4 className="font-bold text-gray-900 mb-4">Quick Links</h4>
                            <ul className="space-y-2">
                                <li onClick={() => scrollToSection("home")} className="text-gray-600 hover:text-teal-600 cursor-pointer transition-colors">Home</li>
                                <li onClick={() => scrollToSection("how-it-works")} className="text-gray-600 hover:text-teal-600 cursor-pointer transition-colors">How It Works</li>
                                <li onClick={() => scrollToSection("benefits")} className="text-gray-600 hover:text-teal-600 cursor-pointer transition-colors">Benefits</li>
                                <li onClick={() => scrollToSection("contact")} className="text-gray-600 hover:text-teal-600 cursor-pointer transition-colors">Contact</li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="font-bold text-gray-900 mb-4">Stay Updated</h4>
                            <p className="text-gray-600 mb-4">Get the latest updates on AI drive-thru technology.</p>
                            <div className="flex gap-2">
                                <input
                                    type="email"
                                    placeholder="Enter your email"
                                    className="flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none"
                                />
                                <button className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-medium transition-colors">
                                    Subscribe
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="pt-8 border-t border-gray-200 text-center text-gray-600">
                        <p>© {new Date().getFullYear()} Emma AI. All rights reserved.</p>
                    </div>
                </div>
            </footer >
        </div >
    );
};

export default LandingPage;