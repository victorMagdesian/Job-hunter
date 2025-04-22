import talent from '@google-cloud/talent';

export async function searchGoogleTalent({ gcpProjectId, gcpKeyJson, location, keywords, resultsPerPage = 10 }) {
  if (!gcpProjectId || !gcpKeyJson) return [];
  const client = new talent.v4.JobServiceClient({
    projectId: gcpProjectId,
    credentials: JSON.parse(gcpKeyJson)
  });
  const parent = client.projectPath(gcpProjectId);
  const request = {
    parent,
    jobQuery: {
      query: keywords.join(' '),
      locationFilters: [{ address: location }]
    },
    pageSize: resultsPerPage
  };
  try {
    const [response] = await client.searchJobs(request);
    return (response.matchingJobs || []).map(mj => ({
      id: mj.job.name,
      title: mj.job.title,
      company: mj.job.companyDisplayName,
      url: mj.job.applyUrl || '',
      location: (mj.job.addresses || []).join(', ')
    }));
  } catch {
    return [];
  }
}
