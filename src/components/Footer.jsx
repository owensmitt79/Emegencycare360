import React from 'react';
import Link from 'next/link';
import { useTranslation } from '@/contexts/TranslationContext.jsx';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const { t } = useTranslation();

  return (
    <footer className="bg-card text-card-foreground border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <img
                src="https://horizons-cdn.hostinger.com/ef8d048f-5959-49b1-98b1-993f960c08a7/2462ca60eab4782df94f15cec5932557.png"
                alt="Emergencycare360 Logo"
                className="h-10 w-auto"
              />
            </div>
            <p className="text-sm text-card-foreground/80 mb-4">
              Saving lives through rapid emergency response across the Eastern Region and Nation wide.
            </p>
            <div className="flex items-center gap-3">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-card-foreground/60 hover:text-primary transition-colors duration-200">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-card-foreground/60 hover:text-primary transition-colors duration-200">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 002.856-3.915 10 10 0 01-2.836.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417a9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg>
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-card-foreground/60 hover:text-primary transition-colors duration-200">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><rect width="24" height="24" fill="none"/><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zM5.838 12a6.162 6.162 0 1112.324 0 6.162 6.162 0 01-12.324 0zM12 16a4 4 0 110-8 4 4 0 010 8zm4.965-10.322a1.44 1.44 0 110-2.881 1.44 1.44 0 010 2.881z"/></svg>
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-card-foreground/60 hover:text-primary transition-colors duration-200">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z"/></svg>
              </a>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Quick links</h3>
            <ul className="space-y-2">
              <li><Link href="/services" className="text-sm text-card-foreground/80 hover:text-primary transition-colors duration-200">{t('services')}</Link></li>
              <li><Link href="/doctors/login" className="text-sm text-card-foreground/80 hover:text-primary transition-colors duration-200">{t('doctor_dashboard')}</Link></li>
              <li><Link href="/coverage" className="text-sm text-card-foreground/80 hover:text-primary transition-colors duration-200">{t('coverage')}</Link></li>
              <li><Link href="/firstaid" className="text-sm text-card-foreground/80 hover:text-primary transition-colors duration-200">{t('first_aid')}</Link></li>
              <li><Link href="/about" className="text-sm text-card-foreground/80 hover:text-primary transition-colors duration-200">{t('about')}</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Legal</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-sm text-card-foreground/80 hover:text-primary transition-colors duration-200">Privacy Policy</a></li>
              <li><a href="#" className="text-sm text-card-foreground/80 hover:text-primary transition-colors duration-200">Terms of Service</a></li>
              <li><a href="#" className="text-sm text-card-foreground/80 hover:text-primary transition-colors duration-200">Data Protection</a></li>
              <li><a href="#" className="text-sm text-card-foreground/80 hover:text-primary transition-colors duration-200">Consent for Emergency Care</a></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Emergency contact</h3>
            <p className="text-sm text-card-foreground/80 mb-2">24/7 Emergency line:</p>
            <a href="tel:+2347038787313" className="text-lg font-bold text-destructive hover:text-destructive/80 transition-colors duration-200">
              +234 703 878 7313
            </a>
          </div>
        </div>

        <div className="pt-8 border-t border-border">
          <p className="text-xs text-card-foreground/60 mb-4">
            <span className="font-semibold">Emergency disclaimer:</span> Emergencycare360 provides emergency medical response services. In life-threatening situations, always call your local emergency number first. Our services complement but do not replace official emergency services. Response times may vary based on location, traffic, and availability.
          </p>
          <p className="text-sm text-card-foreground/80">
            © {currentYear} SP.Technologyltd. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;