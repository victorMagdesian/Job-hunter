import cheerio from 'cheerio';

export async function searchIndeed({ location, keywords }) {
  const query = keywords.map(k => encodeURIComponent(k)).join('+');
  const loc = encodeURIComponent(location);
  const url = `https://br.indeed.com/jobs?q=${query}&l=${loc}`;
  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
      }
    });
    const html = await res.text();
    const $ = cheerio.load(html);
    const jobs = [];
    $('div.job_seen_beacon').each((_, el) => {
      const card = $(el);
      const title = card.find('h2.jobTitle > span').text().trim();
      const link = card.find('a').attr('href');
      if (!title || !link) return;
      const id = card.attr('data-jk') || link;
      const company = card.find('.companyName').text().trim();
      const jobLocation = card.find('.companyLocation').text().trim();
      const jobUrl = link.startsWith('http') ? link : `https://br.indeed.com${link}`;
      jobs.push({ id, title, company, url: jobUrl, location: jobLocation });
    });
    return jobs.slice(0, 10);
  } catch {
    return [];
  }
}
