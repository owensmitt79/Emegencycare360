import './globals.css';
import ClientLayout from './client-layout.jsx';
import Script from 'next/script';

export const metadata = {
  title: 'Emergencycare360',
  description: 'Saving lives through rapid emergency response.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <div id="google_translate_element" style={{ display: 'none' }}></div>
        <Script id="google-translate-init" strategy="afterInteractive" dangerouslySetInnerHTML={{
          __html: `
            function googleTranslateElementInit() {
              new google.translate.TranslateElement({
                pageLanguage: 'en',
                includedLanguages: 'en,yo,ig,ha',
                autoDisplay: false
              }, 'google_translate_element');
            }
          `
        }} />
        <Script 
          src="https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"
          strategy="afterInteractive"
        />
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
