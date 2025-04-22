export async function searchAdzuna({ adzunaAppId, adzunaAppKey, location, keywords, resultsPerPage = 10 }) {
  if (!adzunaAppId || !adzunaAppKey) return [];
  const what = encodeURIComponent(keywords.join(' '));
  const where = encodeURIComponent(location);
  const endpoint = [
    'https://api.adzuna.com/v1/api/jobs/br/search/1',
    `app_id=${adzunaAppId}`,
    `app_key=${adzunaAppKey}`,
    `results_per_page=${resultsPerPage}`,
    `what=${what}`,
    `where=${where}`
  ].join('&');

  try {
    const res = await fetch(endpoint, { headers: { Accept: 'application/json' } });
    if (!res.ok) return [];
    const { results = [] } = await res.json();
    return results.map(job => ({
      id: job.id,
      title: job.title,
      company: job.company.display_name,
      url: job.redirect_url,
      location: job.location.display_name
    }));
  } catch {
    return [];
  }
}
