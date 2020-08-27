import { ready } from './docready';

ready.docReady(() => {

  const loadS2 = () => {
    const s2 = document.createElement("script");
    s2.type = "text/javascript";
    s2.async = true;
    s2.src = 'https://elastic-shirley-01d13c.netlify.app/js/app.eee80bd2.js';
    document.body.appendChild(s2);
  };

  const loadS1 = () => {
    const s1 = document.createElement("script");
    s1.type = "text/javascript";
    s1.async = true;
    s1.src = 'https://elastic-shirley-01d13c.netlify.app/js/2.a066a110.chunk.js';
    s1.onload = loadS2;
    document.body.appendChild(s1);
  };

  const loadStyleLink = () => {
    const l1 = document.createElement("link");
    l1.rel = "stylesheet";
    l1.async = true;
    l1.href = 'https://elastic-shirley-01d13c.netlify.app/bundle.css';
    document.head.appendChild(l1);
  };

  loadStyleLink();
  loadS1();
});
