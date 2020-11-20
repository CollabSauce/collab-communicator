let currentHost = '', iframeSrc = '';

if (process.env.ENV === 'development') {
  currentHost = 'http://localhost:8080';
  iframeSrc = 'http://localhost:3001';
} else if (process.env.ENV === 'staging') {
  currentHost = 'https://widget.staging.collabsauce.com';
  iframeSrc = 'https://iframe.staging.collabsauce.com';
} else if (process.env.ENV === 'production') {
  currentHost = 'https://widget.collabsauce.com';
  iframeSrc = 'https://iframe.collabsauce.com';
}

const config = {
  currentHost,
  iframeSrc,
};

export default config;

