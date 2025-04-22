export async function searchInfoJobs({ infoJobsClientId, infoJobsClientSecret, location, keywords, resultsPerPage = 10 }) {
  if (!infoJobsClientId || !infoJobsClientSecret) return [];
  const auth = Buffer.from(`${infoJobsClientId}:${infoJobsClientSecret}`).toString('base64');
  const text = encodeURIComponent(keywords.join(' '));
  const province = encodeURIComponent(location);
  const url = `https://api.infojobs.net/api/7/offer?text=${text}&province=${province}&pageSize=${resultsPerPage}`;

  try {
    const res = await fetch(url, {
      headers: {
        Authorization: `Basic ${auth}`,
        Accept: 'application/json'
      }
    });
    if (!res.ok) return [];
    const data = await res.json();
    return (data.offerItems || []).map(offer => ({
      id: offer.offerId,
      title: offer.jobTitle,
      company: offer.company.description,
      url: `https://www.infojobs.com.br/vagas/${offer.offerId}`,
      location: `${offer.province}, ${offer.city}`
    }));
  } catch {
    return [];
  }
}
