let currentHost = 'http://localhost:8080';
let developmentProjectKey = '';
let iframeSrc = 'http://localhost:3001';
let isDevelopment = true;

if (process.env.ENV === 'development') {
  developmentProjectKey = process.env.PROJECT_KEY;
} if (process.env.ENV === 'staging') {
  currentHost = 'https://widget.staging.collabsauce.com';
  iframeSrc = 'https://iframe.staging.collabsauce.com';
  isDevelopment = false;
} else if (process.env.ENV === 'production') {
  currentHost = 'https://widget.collabsauce.com';
  iframeSrc = 'https://iframe.collabsauce.com';
  isDevelopment = false;
}

const config = {
  currentHost,
  developmentProjectKey,
  iframeSrc,
  isDevelopment
};

export default config;
