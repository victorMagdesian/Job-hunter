import { useState } from 'react';

const apiLabels = {
  adzuna: 'Adzuna',
  infojobs: 'InfoJobs',
  google_talent: 'Google Cloud Talent',
  indeed: 'Indeed (scraping)'
};

export default function Home() {
  const [selectedAPIs, setSelectedAPIs] = useState([]);
  const toggleAPI = api => {
    setSelectedAPIs(prev =>
      prev.includes(api) ? prev.filter(a => a !== api) : [...prev, api]
    );
  };

  const isSel = api => selectedAPIs.includes(api);
  const sectionStyle = api => ({
    maxHeight: isSel(api) ? '200px' : '0',
    overflow: 'hidden',
    transition: 'max-height 0.3s ease'
  });

  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    const form = new FormData(e.target);
    form.delete('selectedAPIs');
    selectedAPIs.forEach(api => form.append('selectedAPIs', api));

    const res = await fetch('/api/config', { method: 'POST', body: form });
    const json = await res.json();
    setMsg(json.ok ? 'Configuração salva!' : 'Erro: ' + json.error);
    setLoading(false);
  }

  return (
    <main style={{ maxWidth: 640, margin: '2rem auto', fontFamily: 'sans-serif' }}>
      <h1>Job‑Hunter</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Localização<br />
          <input name="location" required />
        </label>
        <br /><br />

        <label>
          Palavras‑chave (vírgulas)<br />
          <input name="keywords" required placeholder="e.g.: React, Node" />
        </label>
        <br /><br />

        <label>
          Currículo (PDF)<br />
          <input type="file" name="resume" accept="application/pdf" required />
        </label>
        <br /><br />

        <fieldset>
          <legend>Config. de E‑mail SMTP</legend>
          <label>Host<br/><input name="smtpHost" required/></label><br/>
          <label>Porta<br/><input name="smtpPort" type="number" required/></label><br/>
          <label>Usuário<br/><input name="smtpUser" required/></label><br/>
          <label>Senha<br/><input name="smtpPass" type="password" required/></label><br/>
          <label>De (from)<br/><input name="fromEmail" required/></label><br/>
          <label>Para (to)<br/><input name="toEmail" required/></label><br/>
          <label>Assunto<br/><input name="subject" required defaultValue="Nova vaga para você!"/></label>
        </fieldset>
        <br />

        <fieldset>
          <legend>Selecione APIs</legend>
          {Object.entries(apiLabels).map(([key, label]) => (
            <label key={key} style={{ display: 'block', margin: '0.5rem 0' }}>
              <input
                type="checkbox"
                checked={isSel(key)}
                onChange={() => toggleAPI(key)}
              />{' '}
              {label}
            </label>
          ))}
        </fieldset>

        <div style={sectionStyle('adzuna')}>
          <fieldset>
            <legend>Adzuna API</legend>
            <label>App ID<br/><input name="adzunaAppId" /></label><br/>
            <label>App Key<br/><input name="adzunaAppKey" /></label>
          </fieldset>
        </div>

        <div style={sectionStyle('infojobs')}>
          <fieldset>
            <legend>InfoJobs API</legend>
            <label>Client ID<br/><input name="infoJobsClientId" /></label><br/>
            <label>Client Secret<br/><input name="infoJobsClientSecret" /></label>
          </fieldset>
        </div>

        <div style={sectionStyle('google_talent')}>
          <fieldset>
            <legend>Google Cloud Talent</legend>
            <label>Project ID<br/><input name="gcpProjectId" /></label><br/>
            <label>Service Account JSON<br/>
              <textarea
                name="gcpKeyJson"
                placeholder="Cole aqui o JSON completo da service account"
                style={{ width: '100%', height: 120 }}
              />
            </label>
          </fieldset>
        </div>

        <button type="submit" disabled={loading}>
          {loading ? 'Salvando…' : 'Salvar Configuração'}
        </button>
      </form>
      {msg && <p>{msg}</p>}
    </main>
)
}
