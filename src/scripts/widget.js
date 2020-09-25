import config from './config';
import { ready } from './docready';

ready.docReady(() => {

  const loadS2 = () => {
    const s2 = document.createElement("script");
    s2.type = "text/javascript";
    s2.async = true;
    s2.src = `${config.currentHost}/js/app.${process.env.APP_HASH}.js`;
    document.body.appendChild(s2);
  };

  const loadS1 = () => {
    const s1 = document.createElement("script");
    s1.type = "text/javascript";
    s1.async = true;
    s1.src = `${config.currentHost}/js/${process.env.CHUNK_HASH}.chunk.js`;
    s1.onload = loadS2;
    document.body.appendChild(s1);
  };

  const loadStyleLink = () => {
    const l1 = document.createElement("link");
    l1.rel = "stylesheet";
    l1.async = true;
    l1.href = `${config.currentHost}/bundle.css`;
    document.head.appendChild(l1);
  };

  loadStyleLink();
  loadS1();
});
