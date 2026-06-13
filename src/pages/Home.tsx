import React from 'react';
import { Link } from 'react-router-dom';
import { useSettings } from '@/hooks/useSettings';
import { Scissors, Calendar, Star, Users, MapPin, Phone, Clock, Instagram, ArrowRight, ChevronRight, CheckCircle2 } from 'lucide-react';

const Home: React.FC = () => {
  const { data: settings } = useSettings();
  return (
    <div className="min-h-screen bg-white dark:bg-neutral-950">
      {/* Hero */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-neutral-950">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-black/40 z-10" />
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1503951914875-452162b0f3f1?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80')] bg-cover bg-center opacity-40 scale-105 animate-float" />
          {/* Decorative elements */}
          <div className="absolute top-1/4 right-10 w-72 h-72 bg-accent/10 rounded-full blur-[100px]" />
          <div className="absolute bottom-1/4 left-10 w-96 h-96 bg-gold-600/5 rounded-full blur-[120px]" />
        </div>

        <div className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-16 relative z-20 w-full py-20">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 backdrop-blur-md border border-white/10 rounded-full mb-8 animate-fade-in">
              <div className="w-2 h-2 bg-accent rounded-full animate-pulse" />
              <span className="text-xs font-semibold text-white/70 uppercase tracking-[0.2em]">Premium Barbershop</span>
            </div>

            <h1 className="text-5xl md:text-6xl lg:text-display-xl font-black text-white mb-6 font-serif leading-[1.1] tracking-tight animate-fade-in-up">
              Crafting <br />
              <span className="text-gradient-gold italic">Exceptional</span> Styles.
            </h1>

            <p className="text-lg md:text-xl text-neutral-400 mb-10 max-w-lg leading-relaxed animate-fade-in-up stagger-1">
              Traditional grooming meets modern technique. Our master barbers ensure you leave looking and feeling your absolute best.
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 animate-fade-in-up stagger-2">
              <Link
                to="/booking"
                className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-accent to-gold-600 hover:from-accent-hover hover:to-gold-700 text-white font-bold text-lg px-8 py-4 rounded-xl transition-all duration-200 shadow-gold hover:shadow-gold-lg cursor-pointer group"
              >
                Book Appointment
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/login"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 border border-white/20 text-white font-bold rounded-xl hover:bg-white/10 transition-all duration-200 cursor-pointer backdrop-blur-sm"
              >
                Member Sign In
              </Link>
            </div>

            {/* Trust indicators */}
            <div className="flex items-center gap-6 mt-12 animate-fade-in-up stagger-3">
              <div className="flex items-center gap-2">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="w-8 h-8 rounded-full bg-neutral-700 border-2 border-neutral-950 flex items-center justify-center text-xs font-bold text-white">
                      {String.fromCharCode(64 + i)}
                    </div>
                  ))}
                </div>
                <div className="text-sm">
                  <span className="text-white font-semibold">2,000+</span>
                  <span className="text-neutral-500 ml-1">Happy Clients</span>
                </div>
              </div>
              <div className="hidden sm:block w-px h-8 bg-neutral-700" />
              <div className="hidden sm:flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star key={i} className="w-4 h-4 fill-gold-500 text-gold-500" />
                ))}
                <span className="text-sm text-neutral-400 ml-2">4.9/5</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-16 py-24">
        <div className="section-header">
          <p>Why Choose Us</p>
          <h2>The Suma Barber Experience</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { icon: Scissors, title: 'Master Barbers', desc: 'Certified stylists with minimum 5 years of professional grooming experience.', color: 'bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400' },
            { icon: Calendar, title: 'Quick Booking', desc: 'Online reservation system that secures your spot in less than 30 seconds.', color: 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400' },
            { icon: Star, title: 'Premium Service', desc: 'Every haircut includes consultation, wash, and premium pomade styling.', color: 'bg-amber-50 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400' },
            { icon: Users, title: 'Loyalty Rewards', desc: 'Earn points for every visit, redeemable for exclusive services and products.', color: 'bg-purple-50 dark:bg-purple-950/30 text-purple-600 dark:text-purple-400' },
          ].map((feature, i) => (
            <div
              key={i}
              className="group p-6 bg-white dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 rounded-2xl hover:border-accent/20 dark:hover:border-accent/20 transition-all duration-300 hover-lift cursor-pointer"
            >
              <div className={`w-12 h-12 ${feature.color} rounded-xl flex items-center justify-center mb-5 transition-transform group-hover:scale-110`}>
                <feature.icon className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-neutral-900 dark:text-white mb-2">{feature.title}</h3>
              <p className="text-neutral-500 dark:text-neutral-400 text-sm leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Services Preview */}
      <section className="bg-neutral-50 dark:bg-neutral-900/50 py-24 border-y border-neutral-100 dark:border-neutral-800">
        <div className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-16">
          <div className="section-header">
            <p>Our Services</p>
            <h2>Premium Grooming Services</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { name: 'Haircut & Styling', price: '75K', duration: '45 min', features: ['Consultation', 'Shampoo', 'Styling'] },
              { name: 'Beard Grooming', price: '50K', duration: '30 min', features: ['Trimming', 'Shaping', 'Oil Treatment'] },
              { name: 'Premium Package', price: '150K', duration: '90 min', features: ['Haircut', 'Beard', 'Hot Towel', 'Massage'] },
            ].map((service, i) => (
              <div key={i} className="bg-white dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 rounded-2xl p-6 hover:border-accent/20 transition-all duration-300 hover-lift cursor-pointer group">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-neutral-900 dark:text-white group-hover:text-accent transition-colors">{service.name}</h3>
                  <span className="badge-neutral">{service.duration}</span>
                </div>
                <div className="mb-4">
                  <span className="text-3xl font-black text-accent">Rp {service.price}</span>
                </div>
                <ul className="space-y-2 mb-6">
                  {service.features.map((feature, j) => (
                    <li key={j} className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Link
                  to="/booking"
                  className="inline-flex items-center gap-1 text-sm font-bold text-accent hover:text-accent-hover transition-colors cursor-pointer group/link"
                >
                  Book Now
                  <ChevronRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-16">
          <div className="section-header">
            <p>Testimonials</p>
            <h2>What Our Clients Say</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { name: 'Rizky Pratama', role: 'Regular Customer', text: 'Best barbershop in town! The online booking is so convenient. No more waiting in line.', rating: 5 },
              { name: 'Ahmad Fauzi', role: 'Member', text: 'Been coming here for 2 years. The quality never drops. Every barber knows exactly what I want.', rating: 5 },
              { name: 'Dimas Putra', role: 'Premium Member', text: 'The premium package was worth every rupiah. Hot towel treatment and scalp massage made it luxurious.', rating: 5 },
            ].map((t, i) => (
              <div key={i} className="bg-white dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 rounded-2xl p-6 hover:border-accent/20 transition-all duration-300 hover-lift cursor-pointer">
                <div className="flex items-center gap-1 mb-4">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <Star key={j} className="w-4 h-4 fill-gold-500 text-gold-500" />
                  ))}
                </div>
                <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed mb-6 text-sm">"{t.text}"</p>
                <div className="flex items-center gap-3 pt-4 border-t border-neutral-50 dark:border-neutral-800">
                  <div className="w-10 h-10 bg-gradient-to-br from-accent to-gold-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <div className="font-bold text-neutral-900 dark:text-white text-sm">{t.name}</div>
                    <div className="text-xs text-neutral-500 dark:text-neutral-400">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-16">
          <div className="relative bg-neutral-900 rounded-3xl p-10 md:p-16 flex flex-col md:flex-row items-center justify-between gap-10 overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-accent/10 rounded-full blur-[80px]" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-gold-600/10 rounded-full blur-[60px]" />
            
            <div className="max-w-xl text-center md:text-left relative z-10">
              <h2 className="text-3xl md:text-4xl font-black text-white font-serif mb-4 leading-tight">
                Ready for Your New <span className="text-gradient-gold">Signature Look?</span>
              </h2>
              <p className="text-neutral-400 text-lg">
                Join 2,000+ satisfied clients who trust Suma Barber with their image.
              </p>
            </div>
            <Link
              to="/register"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-accent to-gold-600 hover:from-accent-hover hover:to-gold-700 text-white font-bold text-lg px-8 py-4 rounded-xl transition-all duration-200 shadow-gold hover:shadow-gold-lg cursor-pointer whitespace-nowrap relative z-10 group"
            >
              Get Started
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-neutral-950 text-white border-t border-neutral-800">
        <div className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-16 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
            <div>
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 bg-gradient-to-br from-accent to-gold-600 rounded-xl flex items-center justify-center">
                  <Scissors className="w-5 h-5 text-white transform -rotate-45" />
                </div>
                <span className="text-xl font-black text-white font-serif tracking-tighter">
                  {settings?.businessName?.toUpperCase() || 'SUMA'} <span className="text-gradient-gold">BARBER</span>
                </span>
              </div>
              <p className="text-neutral-400 text-sm leading-relaxed mb-5">
                Premium grooming experience combining traditional craftsmanship with modern style.
              </p>
              <div className="flex items-center gap-3">
                <a href="#" className="w-9 h-9 bg-neutral-800 hover:bg-accent rounded-lg flex items-center justify-center transition-all duration-200 cursor-pointer hover-lift" aria-label="Instagram">
                  <Instagram className="w-4 h-4" />
                </a>
                <a href="#" className="w-9 h-9 bg-neutral-800 hover:bg-accent rounded-lg flex items-center justify-center transition-all duration-200 cursor-pointer hover-lift" aria-label="TikTok">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 00-.79-.05A6.34 6.34 0 003.15 15.2a6.34 6.34 0 0010.86 4.43V13.1a8.28 8.28 0 005.58 2.16V11.8a4.83 4.83 0 01-3.45-1.39V6.69h3.45z" /></svg>
                </a>
              </div>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase tracking-[0.2em] mb-5 text-accent">Quick Links</h4>
              <ul className="space-y-3">
                <li><Link to="/" className="text-neutral-400 hover:text-white transition-colors text-sm cursor-pointer">Home</Link></li>
                <li><Link to="/barbers" className="text-neutral-400 hover:text-white transition-colors text-sm cursor-pointer">Our Barbers</Link></li>
                <li><Link to="/booking" className="text-neutral-400 hover:text-white transition-colors text-sm cursor-pointer">Book Appointment</Link></li>
                <li><Link to="/login" className="text-neutral-400 hover:text-white transition-colors text-sm cursor-pointer">Member Login</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase tracking-[0.2em] mb-5 text-accent">Services</h4>
              <ul className="space-y-3">
                <li><span className="text-neutral-400 text-sm">Haircut & Styling</span></li>
                <li><span className="text-neutral-400 text-sm">Beard Grooming</span></li>
                <li><span className="text-neutral-400 text-sm">Hot Towel Shave</span></li>
                <li><span className="text-neutral-400 text-sm">Scalp Treatment</span></li>
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase tracking-[0.2em] mb-5 text-accent">Contact</h4>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
                  <span className="text-neutral-400 text-sm">{settings?.address || 'Jl. Sudirman No. 123, Jakarta Pusat'}</span>
                </li>
                <li className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-accent flex-shrink-0" />
                  <span className="text-neutral-400 text-sm">{settings?.phone || '+62 812 3456 7890'}</span>
                </li>
                <li className="flex items-center gap-3">
                  <Clock className="w-4 h-4 text-accent flex-shrink-0" />
                  <span className="text-neutral-400 text-sm">
                    Mon-Sun: {settings?.operatingHours?.open || '09:00'} - {settings?.operatingHours?.close || '21:00'}
                  </span>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-neutral-800 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-neutral-500 text-sm">&copy; 2026 {settings?.businessName || 'Suma Barber'} Shop. All rights reserved.</p>
            <div className="flex items-center gap-6">
              <a href="#" className="text-neutral-500 hover:text-neutral-300 text-xs uppercase tracking-[0.15em] transition-colors cursor-pointer">Privacy</a>
              <a href="#" className="text-neutral-500 hover:text-neutral-300 text-xs uppercase tracking-[0.15em] transition-colors cursor-pointer">Terms</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
