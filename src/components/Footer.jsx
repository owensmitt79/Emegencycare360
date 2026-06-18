import React from 'react';
import Link from 'next/link';
import Logo from '@/components/Logo.jsx';
import { Phone, Mail, MapPin, Facebook, Twitter, Instagram, Linkedin, ShieldCheck } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-900 text-slate-200 border-t border-slate-800 pt-16 pb-8 mt-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          
          {/* Brand & About */}
          <div className="col-span-1 lg:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-6">
              <Logo className="w-14 h-14" />
              <span className="text-2xl font-extrabold text-white tracking-tight">Emergencycare<span className="text-emerald-500">360</span></span>
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed mb-6">
              Providing rapid, secure, and reliable emergency medical response systems. Your health and safety are our top priorities, 24/7.
            </p>
            <div className="flex items-center gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:bg-emerald-500 hover:text-white transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:bg-emerald-500 hover:text-white transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:bg-emerald-500 hover:text-white transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:bg-emerald-500 hover:text-white transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-bold text-lg mb-6">Quick Links</h3>
            <ul className="space-y-4">
              <li><Link href="/" className="text-slate-400 hover:text-emerald-500 transition-colors text-sm flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500/50"></span> Home</Link></li>
              <li><Link href="/about" className="text-slate-400 hover:text-emerald-500 transition-colors text-sm flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500/50"></span> About Us</Link></li>
              <li><Link href="/services" className="text-slate-400 hover:text-emerald-500 transition-colors text-sm flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500/50"></span> Our Services</Link></li>
              <li><Link href="/doctors" className="text-slate-400 hover:text-emerald-500 transition-colors text-sm flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500/50"></span> Find a Doctor</Link></li>
              <li><Link href="/contact" className="text-slate-400 hover:text-emerald-500 transition-colors text-sm flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500/50"></span> Contact Support</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-white font-bold text-lg mb-6">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                <span className="text-slate-400 text-sm">No 1 Rochas close,<br/>Okigwe, Imo State</span>
              </li>
              <li className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                <span className="text-slate-400 text-sm">Emergency: <strong className="text-white">911</strong><br/>Support: 07038787313</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-emerald-500 shrink-0" />
                <span className="text-slate-400 text-sm">support@emergencycare360.com</span>
              </li>
            </ul>
          </div>

          {/* Compliance & Certifications */}
          <div>
            <h3 className="text-white font-bold text-lg mb-6">Certifications</h3>
            <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-5 h-5 text-emerald-500" />
                </div>
                <div>
                  <h4 className="text-white font-bold text-sm tracking-wide">HIPAA Compliant</h4>
                  <p className="text-emerald-500 text-xs font-semibold mt-0.5 uppercase tracking-wider">100% Secure</p>
                </div>
              </div>
              <p className="text-slate-400 text-xs leading-relaxed">
                All patient health information is fully encrypted and handled in compliance with federal HIPAA regulations.
              </p>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-800/80 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-slate-500 text-sm text-center md:text-left">
            &copy; {currentYear} S.P TechnologyLTD. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link href="/privacy-policy" className="text-slate-500 hover:text-white text-sm transition-colors">Privacy Policy</Link>
            <Link href="/terms-of-service" className="text-slate-500 hover:text-white text-sm transition-colors">Terms of Service</Link>
            <Link href="/cookie-policy" className="text-slate-500 hover:text-white text-sm transition-colors">Cookie Policy</Link>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;