import connect from '../../lib/db';
import mongoose from 'mongoose';
import formidable from 'formidable';
import fs from 'fs/promises';

export const config = { api: { bodyParser: false } };

const ConfigSchema = new mongoose.Schema({
  location: String,
  keywords: [String],
  resumePath: String,
  selectedAPIs: [String],
  adzunaAppId: String,
  adzunaAppKey: String,
  infoJobsClientId: String,
  infoJobsClientSecret: String,
  gcpProjectId: String,
  gcpKeyJson: String,
  smtpHost: String,
  smtpPort: Number,
  smtpUser: String,
  smtpPass: String,
  fromEmail: String,
  toEmail: String,
  subject: String,
  createdAt: { type: Date, default: Date.now }
});

const Config = mongoose.models.Config || mongoose.model('Config', ConfigSchema);

export default async function handler(req, res) {
  await connect();
  const form = new formidable.IncomingForm({ multiples: false });
  form.uploadDir = './public/uploads';
  form.keepExtensions = true;
  form.parse(req, async (err, fields, files) => {
    if (err) return res.status(500).json({ error: err.message });
    try {
      const file = files.resume;
      const resumePath = `/uploads/${file.newFilename}`;
      await fs.rename(file.filepath, `./public${resumePath}`);

      const selected = Array.isArray(fields.selectedAPIs)
        ? fields.selectedAPIs
        : fields.selectedAPIs
        ? [fields.selectedAPIs]
        : [];

      const cfg = new Config({
        location: fields.location,
        keywords: fields.keywords.split(',').map(s => s.trim()),
        resumePath,
        selectedAPIs: selected,
        adzunaAppId: fields.adzunaAppId,
        adzunaAppKey: fields.adzunaAppKey,
        infoJobsClientId: fields.infoJobsClientId,
        infoJobsClientSecret: fields.infoJobsClientSecret,
        gcpProjectId: fields.gcpProjectId,
        gcpKeyJson: fields.gcpKeyJson,
        smtpHost: fields.smtpHost,
        smtpPort: Number(fields.smtpPort),
        smtpUser: fields.smtpUser,
        smtpPass: fields.smtpPass,
        fromEmail: fields.fromEmail,
        toEmail: fields.toEmail,
        subject: fields.subject
      });
      await cfg.save();
      res.json({ ok: true });
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  });
}
