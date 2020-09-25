import config from './config';
import { ready } from './docready';

ready.docReady(() => {

  let vendor1Loaded = false;
  let vendor2Loaded = false;

  const loadAppScript = () => {
    const appScript = document.createElement("script");
    appScript.type = "text/javascript";
    appScript.async = true;
    appScript.src = `${config.currentHost}/js/app.${process.env.APP_HASH}.js`;
    document.body.appendChild(appScript);
  };

  const loadVendor2 = () => {
    const vendor2 = document.createElement("script");
    vendor2.type = "text/javascript";
    vendor2.async = true;
    vendor2.src = `${config.currentHost}/js/${process.env.CHUNK_HASHES[1]}.chunk.js`;
    vendor2.onload = () {
      vendor2Loaded = true;
      if (vendor1Loaded) { loadAppScript(); }
    };
    document.body.appendChild(vendor2);
  };

  const loadVendor1 = () => {
    const vendor1 = document.createElement("script");
    vendor1.type = "text/javascript";
    vendor1.async = true;
    vendor1.src = `${config.currentHost}/js/${process.env.CHUNK_HASHES[0]}.chunk.js`;
    vendor1.onload = () {
      vendor1Loaded = true;
      if (vendor2Loaded) { loadAppScript(); }
    };
    document.body.appendChild(vendor1);
  };

  const loadStyleLink = () => {
    const l1 = document.createElement("link");
    l1.rel = "stylesheet";
    l1.async = true;
    l1.href = `${config.currentHost}/bundle.css`;
    document.head.appendChild(l1);
  };

  loadStyleLink();
  loadVendor1();
});
