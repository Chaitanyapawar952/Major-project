'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Link from 'next/link';
import { 
  Plane, 
  MapPin, 
  DollarSign, 
  Users, 
  Calendar,
  Sparkles,
  ChevronRight,
  Check,
  ArrowRight,
  Globe,
  Shield,
  Zap,
  Star,
  TrendingUp,
  Heart,
  Camera,
  Clock,
  Smartphone,
  BarChart3
} from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export default function LandingPage() {
  const heroRef = useRef(null);
  const featuresRef = useRef(null);
  const howItWorksRef = useRef(null);
  const testimonialRef = useRef(null);
  const statsRef = useRef(null);
  const ctaRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Hero Animations
      gsap.from('.hero-title', {
        y: 100,
        opacity: 0,
        duration: 1,
        ease: 'power4.out',
      });

      gsap.from('.hero-subtitle', {
        y: 80,
        opacity: 0,
        duration: 1,
        delay: 0.2,
        ease: 'power4.out',
      });

      gsap.from('.hero-buttons', {
        y: 60,
        opacity: 0,
        duration: 1,
        delay: 0.4,
        ease: 'power4.out',
      });

      gsap.from('.hero-image', {
        scale: 0.8,
        opacity: 0,
        duration: 1.2,
        delay: 0.6,
        ease: 'power4.out',
      });

      // Floating Animation
      gsap.to('.float-element', {
        y: -20,
        duration: 2,
        ease: 'power1.inOut',
        repeat: -1,
        yoyo: true,
      });

      // Feature Cards
      gsap.from('.feature-card', {
        scrollTrigger: {
          trigger: featuresRef.current,
          start: 'top 80%',
          end: 'bottom 20%',
          toggleActions: 'play none none reverse',
        },
        y: 100,
        opacity: 0,
        duration: 0.8,
        stagger: 0.2,
        ease: 'power3.out',
      });

      // How It Works Steps
      gsap.from('.step-card', {
        scrollTrigger: {
          trigger: howItWorksRef.current,
          start: 'top 80%',
        },
        x: -100,
        opacity: 0,
        duration: 0.8,
        stagger: 0.2,
        ease: 'power3.out',
      });

      // Testimonials
      gsap.from('.testimonial-card', {
        scrollTrigger: {
          trigger: testimonialRef.current,
          start: 'top 80%',
        },
        scale: 0.8,
        opacity: 0,
        duration: 0.6,
        stagger: 0.15,
        ease: 'back.out(1.7)',
      });

      // Stats Counter
      gsap.from('.stat-item', {
        scrollTrigger: {
          trigger: statsRef.current,
          start: 'top 80%',
        },
        scale: 0.5,
        opacity: 0,
        duration: 0.6,
        stagger: 0.15,
        ease: 'back.out(1.7)',
      });

      // Parallax Effect
      gsap.to('.parallax-bg', {
        scrollTrigger: {
          trigger: '.parallax-section',
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1,
        },
        y: -100,
        ease: 'none',
      });

      // CTA Section
      gsap.from('.cta-content', {
        scrollTrigger: {
          trigger: ctaRef.current,
          start: 'top 80%',
        },
        scale: 0.9,
        opacity: 0,
        duration: 1,
        ease: 'power4.out',
      });

    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <div className="bg-white overflow-hidden" ref={heroRef}>
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="bg-gradient-to-br from-purple-600 to-purple-900 p-2 rounded-xl">
                <Plane size={24} className="text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                TravelPlan
              </span>
            </div>
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-gray-700 hover:text-purple-600 font-medium transition">Features</a>
              <a href="#how-it-works" className="text-gray-700 hover:text-purple-600 font-medium transition">How It Works</a>
              <a href="#testimonials" className="text-gray-700 hover:text-purple-600 font-medium transition">Reviews</a>
            </div>
            <div className="flex items-center gap-4">
              <Link
                href="/login"
                className="text-gray-700 hover:text-purple-600 font-semibold transition"
              >
                Sign In
              </Link>
              <Link
                href="/signup"
                className="bg-gradient-to-r from-purple-600 to-purple-700 text-white px-6 py-2 rounded-xl hover:shadow-lg transition font-semibold"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center pt-20 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 -z-10" />
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse" />
        <div className="absolute bottom-20 right-10 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse" style={{ animationDelay: '1s' }} />
        
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 bg-purple-100 text-purple-700 px-4 py-2 rounded-full text-sm font-semibold">
              <Sparkles size={16} />
              AI-Powered Trip Planning
            </div>

            <h1 className="hero-title text-5xl lg:text-7xl font-bold leading-tight">
              Plan Your Dream{' '}
              <span className="bg-gradient-to-r from-purple-600 via-blue-600 to-pink-600 bg-clip-text text-transparent">
                Adventure
              </span>
            </h1>

            <p className="hero-subtitle text-xl text-gray-600 leading-relaxed">
              Smart budgeting, collaborative planning, and AI-powered insights. Your perfect trip starts here.
            </p>

            <div className="hero-buttons flex flex-col sm:flex-row gap-4">
              <Link
                href="/signup"
                className="group bg-gradient-to-r from-purple-600 to-purple-700 text-white px-8 py-4 rounded-xl hover:shadow-2xl transition font-bold text-lg flex items-center justify-center gap-2"
              >
                Start Planning Free
                <ArrowRight size={20} className="group-hover:translate-x-1 transition" />
              </Link>
              <Link
                href="#features"
                className="border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-xl hover:border-purple-600 hover:text-purple-600 transition font-bold text-lg flex items-center justify-center gap-2"
              >
                Learn More
                <ChevronRight size={20} />
              </Link>
            </div>

            <div className="flex gap-8 pt-8 border-t border-gray-200">
              <div>
                <p className="text-3xl font-bold text-gray-900">10K+</p>
                <p className="text-sm text-gray-600">Trips Planned</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-gray-900">5K+</p>
                <p className="text-sm text-gray-600">Happy Travelers</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-gray-900">4.9★</p>
                <p className="text-sm text-gray-600">User Rating</p>
              </div>
            </div>
          </div>

          <div className="relative hero-image">
            <div className="relative z-10">
              <div className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-200">
                <div className="flex items-center gap-4 mb-6">
                  <div className="bg-gradient-to-br from-purple-600 to-purple-900 p-3 rounded-2xl">
                    <MapPin size={32} className="text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">Paris, France</h3>
                    <p className="text-sm text-gray-600">7 days • 2 travelers</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Budget</span>
                    <span className="font-bold text-gray-900">$3,500</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Current Spending</span>
                    <span className="font-bold text-green-600">$2,100</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div className="bg-gradient-to-r from-purple-600 to-blue-600 h-3 rounded-full" style={{ width: '60%' }} />
                  </div>
                </div>
              </div>

              <div className="float-element absolute -top-8 -right-8 bg-gradient-to-br from-blue-500 to-blue-600 text-white p-6 rounded-2xl shadow-xl">
                <p className="text-sm font-semibold mb-1">AI Recommendation</p>
                <p className="text-2xl font-bold">Save $400</p>
              </div>

              <div className="float-element absolute -bottom-6 -left-6 bg-gradient-to-br from-pink-500 to-pink-600 text-white p-6 rounded-2xl shadow-xl" style={{ animationDelay: '1s' }}>
                <p className="text-sm font-semibold mb-1">Group Members</p>
                <div className="flex -space-x-2">
                  <div className="w-8 h-8 rounded-full bg-white border-2 border-pink-500" />
                  <div className="w-8 h-8 rounded-full bg-white border-2 border-pink-500" />
                  <div className="w-8 h-8 rounded-full bg-white border-2 border-pink-500" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" ref={featuresRef} className="py-32 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Everything You Need to Plan
            </h2>
            <p className="text-xl text-gray-600">
              Powerful features to make trip planning effortless
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Sparkles size={32} />}
              title="AI Cost Analysis"
              description="Get detailed budget breakdowns and smart recommendations powered by AI"
              color="purple"
            />
            <FeatureCard
              icon={<Users size={32} />}
              title="Collaborative Planning"
              description="Invite friends with join codes and plan trips together in real-time"
              color="blue"
            />
            <FeatureCard
              icon={<DollarSign size={32} />}
              title="Expense Tracking"
              description="Track every expense and stay within budget with visual insights"
              color="green"
            />
            <FeatureCard
              icon={<Calendar size={32} />}
              title="Smart Itinerary"
              description="Day-by-day planning with cost estimates and activity suggestions"
              color="orange"
            />
            <FeatureCard
              icon={<Globe size={32} />}
              title="Destination Guides"
              description="Discover new places with AI-powered destination recommendations"
              color="pink"
            />
            <FeatureCard
              icon={<Shield size={32} />}
              title="Secure & Private"
              description="Your data is encrypted and protected with enterprise-grade security"
              color="indigo"
            />
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" ref={howItWorksRef} className="py-32 px-6 bg-gradient-to-br from-gray-50 to-purple-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600">
              Start planning your perfect trip in just 3 simple steps
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <StepCard
              number="1"
              icon={<Plane size={40} />}
              title="Create Your Trip"
              description="Enter your destination, dates, and budget. Our AI analyzes thousands of data points to create a personalized plan."
              color="purple"
            />
            <StepCard
              number="2"
              icon={<Users size={40} />}
              title="Invite Your Group"
              description="Share a unique join code with friends and family. Everyone can collaborate on the itinerary and expenses."
              color="blue"
            />
            <StepCard
              number="3"
              icon={<BarChart3 size={40} />}
              title="Track & Enjoy"
              description="Monitor spending in real-time, get AI recommendations, and make memories without budget stress."
              color="green"
            />
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" ref={testimonialRef} className="py-32 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Loved by Travelers Worldwide
            </h2>
            <p className="text-xl text-gray-600">
              See what our users have to say about their experience
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <TestimonialCard
              name="Sarah Johnson"
              role="Travel Blogger"
              image="👩‍💼"
              rating={5}
              text="TravelPlan made planning our Europe trip so easy! The AI cost analysis saved us over $800. Highly recommend!"
            />
            <TestimonialCard
              name="Mike Chen"
              role="Software Engineer"
              image="👨‍💻"
              rating={5}
              text="The collaborative features are amazing. My friends and I planned our Tokyo trip together seamlessly. Best travel app ever!"
            />
            <TestimonialCard
              name="Emily Rodriguez"
              role="Marketing Manager"
              image="👩‍🎨"
              rating={5}
              text="I love the expense tracking. It keeps our group accountable and ensures we stay within budget. Game changer!"
            />
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section ref={statsRef} className="py-32 px-6 bg-gradient-to-br from-purple-600 via-blue-600 to-pink-600">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-4">
              Trusted by Thousands
            </h2>
            <p className="text-xl text-purple-100">
              Join the growing community of smart travelers
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="stat-item text-center">
              <div className="bg-white/20 backdrop-blur-sm w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Plane size={40} className="text-white" />
              </div>
              <p className="text-5xl font-bold text-white mb-2">10K+</p>
              <p className="text-purple-100 font-medium">Trips Planned</p>
            </div>
            <div className="stat-item text-center">
              <div className="bg-white/20 backdrop-blur-sm w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Users size={40} className="text-white" />
              </div>
              <p className="text-5xl font-bold text-white mb-2">5K+</p>
              <p className="text-purple-100 font-medium">Active Users</p>
            </div>
            <div className="stat-item text-center">
              <div className="bg-white/20 backdrop-blur-sm w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <DollarSign size={40} className="text-white" />
              </div>
              <p className="text-5xl font-bold text-white mb-2">$2M+</p>
              <p className="text-purple-100 font-medium">Budget Managed</p>
            </div>
            <div className="stat-item text-center">
              <div className="bg-white/20 backdrop-blur-sm w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Star size={40} className="text-white" />
              </div>
              <p className="text-5xl font-bold text-white mb-2">4.9</p>
              <p className="text-purple-100 font-medium">Average Rating</p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-32 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
                Why Choose TravelPlan?
              </h2>
              <p className="text-xl text-gray-600 mb-8">
                We combine cutting-edge AI technology with intuitive design to make travel planning a breeze
              </p>
              
              <div className="space-y-6">
                <BenefitItem
                  icon={<Zap size={24} />}
                  title="Lightning Fast"
                  description="Get instant AI-powered recommendations and analysis"
                />
                <BenefitItem
                  icon={<Heart size={24} />}
                  title="User Friendly"
                  description="Beautiful, intuitive interface that anyone can use"
                />
                <BenefitItem
                  icon={<Smartphone size={24} />}
                  title="Mobile Optimized"
                  description="Access your plans anywhere, anytime from any device"
                />
                <BenefitItem
                  icon={<TrendingUp size={24} />}
                  title="Smart Insights"
                  description="Data-driven recommendations to optimize your budget"
                />
              </div>
            </div>

            <div className="relative">
              <div className="bg-gradient-to-br from-purple-100 to-blue-100 rounded-3xl p-8 aspect-square flex items-center justify-center">
                <div className="text-center">
                  <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-sm">
                    <BarChart3 size={64} className="text-purple-600 mx-auto mb-4" />
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">Real-Time Analytics</h3>
                    <p className="text-gray-600">Track your spending and get insights as you travel</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section ref={ctaRef} className="py-32 px-6 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <div className="cta-content bg-gradient-to-br from-purple-600 to-blue-600 rounded-3xl p-12 text-center text-white shadow-2xl">
            <Sparkles size={48} className="mx-auto mb-6" />
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">
              Ready to Start Your Journey?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Join thousands of travelers who trust TravelPlan for stress-free trip planning
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/signup"
                className="inline-flex items-center justify-center gap-2 bg-white text-purple-600 px-8 py-4 rounded-xl hover:shadow-2xl transition font-bold text-lg"
              >
                Get Started Free
                <ArrowRight size={20} />
              </Link>
              <Link
                href="#features"
                className="inline-flex items-center justify-center gap-2 border-2 border-white text-white px-8 py-4 rounded-xl hover:bg-white/10 transition font-bold text-lg"
              >
                Learn More
              </Link>
            </div>
            <p className="text-sm mt-6 opacity-75">No credit card required • Free forever</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Plane size={24} />
                <span className="text-xl font-bold">TravelPlan</span>
              </div>
              <p className="text-gray-400 text-sm">
                Making travel planning simple, smart, and collaborative
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-4">Product</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="#features" className="hover:text-white transition">Features</a></li>
                <li><a href="#how-it-works" className="hover:text-white transition">How It Works</a></li>
                <li><a href="#testimonials" className="hover:text-white transition">Testimonials</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="#" className="hover:text-white transition">About Us</a></li>
                <li><a href="#" className="hover:text-white transition">Careers</a></li>
                <li><a href="#" className="hover:text-white transition">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Legal</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="#" className="hover:text-white transition">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition">Terms of Service</a></li>
                <li><a href="#" className="hover:text-white transition">Cookie Policy</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center">
            <p className="text-gray-400 text-sm">
              © 2025 TravelPlan. All rights reserved. Built with ❤️ for travelers.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description, color }) {
  const colors = {
    purple: 'bg-purple-100 text-purple-600',
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    orange: 'bg-orange-100 text-orange-600',
    pink: 'bg-pink-100 text-pink-600',
    indigo: 'bg-indigo-100 text-indigo-600',
  };

  return (
    <div className="feature-card bg-white rounded-2xl p-8 border border-gray-200 hover:shadow-xl transition-all hover:-translate-y-2">
      <div className={`${colors[color]} w-16 h-16 rounded-2xl flex items-center justify-center mb-6`}>
        {icon}
      </div>
      <h3 className="text-xl font-bold text-gray-900 mb-3">{title}</h3>
      <p className="text-gray-600 leading-relaxed">{description}</p>
    </div>
  );
}

function StepCard({ number, icon, title, description, color }) {
  const colors = {
    purple: 'from-purple-600 to-purple-700',
    blue: 'from-blue-600 to-blue-700',
    green: 'from-green-600 to-green-700',
  };

  return (
    <div className="step-card bg-white rounded-2xl p-8 shadow-lg border border-gray-200 relative">
      <div className={`absolute -top-6 -left-6 bg-gradient-to-br ${colors[color]} text-white w-16 h-16 rounded-2xl flex items-center justify-center text-3xl font-bold shadow-xl`}>
        {number}
      </div>
      <div className="mb-6 mt-6 text-gray-600">
        {icon}
      </div>
      <h3 className="text-2xl font-bold text-gray-900 mb-4">{title}</h3>
      <p className="text-gray-600 leading-relaxed">{description}</p>
    </div>
  );
}

function TestimonialCard({ name, role, image, rating, text }) {
  return (
    <div className="testimonial-card bg-white rounded-2xl p-8 shadow-lg border border-gray-200">
      <div className="flex items-center gap-4 mb-4">
        <div className="text-5xl">{image}</div>
        <div>
          <h4 className="font-bold text-gray-900">{name}</h4>
          <p className="text-sm text-gray-600">{role}</p>
        </div>
      </div>
      <div className="flex gap-1 mb-4">
        {[...Array(rating)].map((_, i) => (
          <Star key={i} size={18} className="fill-yellow-400 text-yellow-400" />
        ))}
      </div>
      <p className="text-gray-600 leading-relaxed">{text}</p>
    </div>
  );
}

function BenefitItem({ icon, title, description }) {
  return (
    <div className="flex gap-4 items-start">
      <div className="bg-purple-100 text-purple-600 p-3 rounded-xl flex-shrink-0">
        {icon}
      </div>
      <div>
        <h4 className="font-bold text-gray-900 mb-1">{title}</h4>
        <p className="text-gray-600">{description}</p>
      </div>
    </div>
  );
}
