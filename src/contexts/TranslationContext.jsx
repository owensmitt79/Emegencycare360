import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const TranslationContext = createContext(null);

const translations = {
  en: {
    // Navigation
    home: "Home",
    emergency: "Emergency Assist",
    services: "Services",
    coverage: "Coverage Map",
    first_aid: "First Aid Info",
    about: "About Us",
    contact: "Contact",
    login: "Sign In",
    signup: "Sign Up",
    logout: "Sign Out",
    dashboard: "Dashboard",
    doctor_dashboard: "Doctor Portal",
    admin_dashboard: "Admin Portal",
    
    // Homepage Hero
    hero_title: "Rapid Emergency Response at Your Fingertips",
    hero_subtitle: "Emergencycare360 connects you to nearby ambulances, responders, and doctors in real-time during critical situations.",
    request_help: "Request Emergency Help",
    talk_to_doctor: "Consult a Doctor",
    
    // Homepage Actions
    call_emergency_line: "Call emergency line",
    speak_with_team: "Speak directly with our response team",
    get_help_now: "Get Help Now",
    submit_details: "Submit your emergency details online",
    find_facility: "Find nearest facility",
    locate_center: "Locate the closest emergency center",
    
    // Emergency request form
    emergency_form_title: "Request Emergency Help",
    emergency_form_subtitle: "If this is life-threatening, please ensure you fill this form accurately.",
    emergency_type: "Emergency Type *",
    priority_level: "Priority Level *",
    location_address: "Location / Address *",
    phone_number: "Contact Phone Number *",
    symptoms: "Describe Symptoms / Situation",
    symptoms_placeholder: "Provide details about the emergency: symptoms, injuries, what happened...",
    submit_request: "SUBMIT EMERGENCY REQUEST",
    submitting_request: "Submitting Request...",
    gps_detected: "GPS Location captured",
    gps_pending: "GPS Location pending",
  },
  yo: { // Yoruba
    home: "Ilé",
    emergency: "Iranlọwọ Pajawiri",
    services: "Awọn Iṣẹ Wa",
    coverage: "Maapu Agbegbe",
    first_aid: "Iranlọwọ Akọkọ",
    about: "Nipa Wa",
    contact: "Kan si Wa",
    login: "Wọlé",
    signup: "Forukọsilẹ",
    logout: "Jade",
    dashboard: "Dasibodu",
    doctor_dashboard: "Portal Dokita",
    admin_dashboard: "Portal Admin",
    
    hero_title: "Idahun Pajawiri Ni Dekun ni Ika Rẹ",
    hero_subtitle: "Emergencycare360 n so ọ pọ mọ awọn ọkọ alaisan pajawiri ati awọn dokita ti o wa nitosi ni akoko gidi.",
    request_help: "Gba Iranlọwọ Pajawiri",
    talk_to_doctor: "Gba Imọran Dókítà",
    
    call_emergency_line: "Pe laini pajawiri",
    speak_with_team: "Sọrọ taara pẹlu ẹgbẹ idahun wa",
    get_help_now: "Gba Iranlọwọ Ni Bayi",
    submit_details: "Firanṣẹ awọn alaye pajawiri rẹ lori ayelujara",
    find_facility: "Wa ile-iwosan to sunmọ julọ",
    locate_center: "Wa ile-iṣẹ pajawiri ti o sunmọ julọ",
    
    emergency_form_title: "Gba Iranlọwọ Pajawiri",
    emergency_form_subtitle: "Ti eyi ba jẹ eewu aye, jọwọ rii daju pe o kun fọọmu yii daradara.",
    emergency_type: "Iru Pajawiri *",
    priority_level: "Ipele Pataki *",
    location_address: "Ipo / Adirẹsi *",
    phone_number: "Nọmba Tẹlifoonu Kan si *",
    symptoms: "Ṣapejuwe Awọn Ami aisan / Ipo",
    symptoms_placeholder: "Pese awọn alaye nipa pajawiri: awọn ami aisan, awọn ipalara, kini o ṣẹlẹ...",
    submit_request: "FARA BALẸ FUN IRANLỌWỌ",
    submitting_request: "Nfi ibeere ranṣẹ...",
    gps_detected: "Ipo GPS ti gba wọle",
    gps_pending: "Ipo GPS n duro de",
  },
  ig: { // Igbo
    home: "Ụlọ",
    emergency: "Enyemaka Mberede",
    services: "Ọrụ Anyị",
    coverage: "Maapụ Ebe Anyị Nọ",
    first_aid: "Enyemaka Mbụ",
    about: "Gbasara Anyị",
    contact: "Kpọtụrụ Anyị",
    login: "Banye",
    signup: "Debanye aha",
    logout: "Pụọ",
    dashboard: "Deshibọdụ",
    doctor_dashboard: "Portal Dọkịta",
    admin_dashboard: "Portal Admin",
    
    hero_title: "Enyemaka Mberede Ngwa Ngwa na Ntanetị Gị",
    hero_subtitle: "Emergencycare360 na-ejikọ gị na ụgbọ ihe mberede na ndị dọkịta kacha nso ozugbo.",
    request_help: "Rịọ Enyemaka Mberede",
    talk_to_doctor: "Gakwuru Dọkịta",
    
    call_emergency_line: "Kpọọ nọmba mberede",
    speak_with_team: "Gwa ndị otu enyemaka anyị okwu ozugbo",
    get_help_now: "Nye Aka Ugbu a",
    submit_details: "Nyefee nkọwa mberede gị na ntanetị",
    find_facility: "Chọta ụlọ ọgwụ kacha nso",
    locate_center: "Chọta ebe mberede kacha nso",
    
    emergency_form_title: "Rịọ Enyemaka Mberede",
    emergency_form_subtitle: "Ọ bụrụ na nke a bụ ihe egwu ndụ, biko hụ na i jupụtara fọm a nke ọma.",
    emergency_type: "Ụdị Mberede *",
    priority_level: "Ọkwa Mkpa *",
    location_address: "Ebe I Nọ / Adreesị *",
    phone_number: "Nọmba ekwentị *",
    symptoms: "Kọwaa Otu Ọ Dị Gị / Ọnọdụ",
    symptoms_placeholder: "Nye nkọwa gbasara mberede ahụ: mgbaàmà, mmerụ ahụ, ihe merenụ...",
    submit_request: "RỊỌ ENYEMAKA OZUGBO",
    submitting_request: "Na-eziga arịrịọ...",
    gps_detected: "Ejidere ebe GPS nọ",
    gps_pending: "GPS ebe na-echere",
  },
  ha: { // Hausa
    home: "Gida",
    emergency: "Taimakon Gaggawa",
    services: "Ayyukanmu",
    coverage: "Taswirar Yanki",
    first_aid: "Taimakon Farko",
    about: "Game da Mu",
    contact: "Tuntube Mu",
    login: "Shiga",
    signup: "Yi Rajista",
    logout: "Fita",
    dashboard: "Dashboard",
    doctor_dashboard: "Likitoci",
    admin_dashboard: "Admin",
    
    hero_title: "Taimakon Gaggawa Cikin Sauri A Yatsun Hannunku",
    hero_subtitle: "Emergencycare360 yana haɗa ku da motocin asibiti na gaggawa da likitocin da ke kusa nan take.",
    request_help: "Nemi Taimakon Gaggawa",
    talk_to_doctor: "Tuntuɓi Likita",
    
    call_emergency_line: "Kira lambar gaggawa",
    speak_with_team: "Yi magana kai tsaye da ƙungiyarmu",
    get_help_now: "Nemi Taimako Yanzu",
    submit_details: "Aika cikakken bayanin gaggawa ta yanar gizo",
    find_facility: "Nemi asibiti mafi kusa",
    locate_center: "Nemi cibiyar gaggawa mafi kusa",
    
    emergency_form_title: "Nemi Taimakon Gaggawa",
    emergency_form_subtitle: "Idan wannan na iya barazana ga rayuwa ne, da fatan za a tabbatar kun cika wannan fam ɗin daidai.",
    emergency_type: "Nau'in Gaggawa *",
    priority_level: "Matakin Muhimmanci *",
    location_address: "Wuri / Adireshin *",
    phone_number: "Lambar Wayar Tuntube *",
    symptoms: "Kwatanta Alamomin Rashin Lafiya / Yanayi",
    symptoms_placeholder: "Ba da cikakken bayani game da gaggawa: alamomi, raunuka, abin da ya faru...",
    submit_request: "NEMI TAIMAKO YANZU",
    submitting_request: "Ana tura neman...",
    gps_detected: "An kama wurin GPS",
    gps_pending: "Wurin GPS yana jira",
  }
};

export const TranslationProvider = ({ children }) => {
  const [lang, setLang] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('appLanguage') || 'en';
    }
    return 'en';
  });

  // On mount, keep Google Translate cookie synchronized with local storage language
  useEffect(() => {
    const savedLang = localStorage.getItem('appLanguage') || 'en';
    if (savedLang === 'en') {
      document.cookie = "googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      document.cookie = "googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=" + window.location.hostname;
    } else {
      document.cookie = "googtrans=/en/" + savedLang + "; path=/;";
      document.cookie = "googtrans=/en/" + savedLang + "; path=/; domain=" + window.location.hostname;
    }
  }, []);

  const changeLanguage = useCallback((newLang) => {
    if (translations[newLang]) {
      setLang(newLang);
      localStorage.setItem('appLanguage', newLang);
      
      if (newLang === 'en') {
        document.cookie = "googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        document.cookie = "googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=" + window.location.hostname;
      } else {
        document.cookie = "googtrans=/en/" + newLang + "; path=/;";
        document.cookie = "googtrans=/en/" + newLang + "; path=/; domain=" + window.location.hostname;
      }
      
      window.location.reload();
    }
  }, []);

  const t = useCallback((key) => {
    const dictionary = translations[lang] || translations['en'];
    return dictionary[key] || translations['en'][key] || key;
  }, [lang]);

  const value = {
    language: lang,
    setLanguage: changeLanguage,
    t,
    languages: [
      { code: 'en', name: 'English' },
      { code: 'yo', name: 'Yoruba' },
      { code: 'ig', name: 'Igbo' },
      { code: 'ha', name: 'Hausa' },
    ]
  };

  return (
    <TranslationContext.Provider value={value}>
      {children}
    </TranslationContext.Provider>
  );
};

export const useTranslation = () => {
  const context = useContext(TranslationContext);
  if (!context) {
    throw new Error('useTranslation must be used within a TranslationProvider');
  }
  return context;
};
