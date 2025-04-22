import connect from '../../lib/db';
import mongoose from 'mongoose';
import { searchJobs } from '../../lib/searchJobs';
import { sendMail } from '../../lib/mailer';

const Config = mongoose.models.Config;
const SentJob = mongoose.models.SentJob || mongoose.model(
  'SentJob',
  new mongoose.Schema({
    configId: mongoose.ObjectId,
    jobExternalId: String,
    sentAt: { type: Date, default: Date.now }
  })
);

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  await connect();
  const configs = await Config.find();
  for (let cfg of configs) {
    const jobs = await searchJobs(cfg.toObject());
    for (let job of jobs) {
      const exists = await SentJob.findOne({
        configId: cfg._id,
        jobExternalId: job.id
      });
      if (exists) continue;

      const html = `
        <h2>Nova vaga: ${job.title}</h2>
        <p><strong>Empresa:</strong> ${job.company}</p>
        <p><strong>Local:</strong> ${job.location}</p>
        <p><a href="${job.url}">Ver detalhes</a></p>
      `;
      await sendMail({
        host: cfg.smtpHost,
        port: cfg.smtpPort,
        user: cfg.smtpUser,
        pass: cfg.smtpPass,
        from: cfg.fromEmail,
        to: cfg.toEmail,
        subject: cfg.subject,
        html
      });
      await new SentJob({
        configId: cfg._id,
        jobExternalId: job.id
      }).save();
    }
  }
  res.json({ ok: true, processed: configs.length });
}
