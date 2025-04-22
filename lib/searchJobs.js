import { searchAdzuna } from './searchAdzuna';
import { searchInfoJobs } from './searchInfoJobs';
import { searchGoogleTalent } from './searchGoogleTalent';
import { searchIndeed } from './searchIndeed';

/**
 * Busca vagas combinando os provedores selecionados.
 */
export async function searchJobs(cfg) {
  const results = [];
  for (const api of cfg.selectedAPIs || []) {
    if (api === 'adzuna') {
      results.push(...await searchAdzuna(cfg));
    }
    if (api === 'infojobs') {
      results.push(...await searchInfoJobs(cfg));
    }
    if (api === 'google_talent') {
      results.push(...await searchGoogleTalent(cfg));
    }
    if (api === 'indeed') {
      results.push(...await searchIndeed(cfg));
    }
  }
  const uniq = results.reduce((acc, job) => {
    acc[job.id] = acc[job.id] || job;
    return acc;
  }, {});
  return Object.values(uniq).slice(0, cfg.resultsPerPage || 10);
}
