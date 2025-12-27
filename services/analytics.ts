
declare global {
  interface Window {
    dataLayer: any[];
    gtag: (...args: any[]) => void;
  }
}

export const initSafeAnalytics = (measurementId: string) => {
  if (!measurementId) return;

  // Initialize dataLayer
  window.dataLayer = window.dataLayer || [];
  function gtag(...args: any[]) {
    window.dataLayer.push(args);
  }
  window.gtag = gtag;

  gtag('js', new Date());

  // STRICT PRIVACY CONFIGURATION FOR KIDS
  gtag('config', measurementId, {
    // 1. IP Anonymization
    anonymize_ip: true, 
    
    // 2. Disable Ad Features / Personalization
    allow_google_signals: false,
    allow_ad_personalization_signals: false,
    restricted_data_processing: true, // CCPA compliance

    // 3. Child Directed Treatment (COPPA)
    child_directed_treatment: true,
    
    // 4. No User Profiling
    user_id: undefined, // Ensure no user ID is passed
    
    // 5. Cookie Config
    cookie_flags: 'SameSite=None;Secure',
    cookie_expires: 60 * 60 * 24 * 28 // 28 days
  });

  // Load the script
  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
  document.head.appendChild(script);
};
