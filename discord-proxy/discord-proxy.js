const express = require('express');
const axios = require('axios');
const app = express();
app.use(express.json());

const DISCORD_WEBHOOK_URL = process.env.DISCORD_WEBHOOK_URL;

app.post('/', async (req, res) => {
  try {
    const alerts = req.body.alerts || [];
    for (const alert of alerts) {
      const message = {
        content: `🚨 *${alert.labels.alertname}* (${alert.labels.severity})\n> ${alert.annotations.summary}\n${alert.annotations.description || ''}`
      };
      await axios.post(DISCORD_WEBHOOK_URL, message);
    }
    res.status(200).send('🟢Sent to Discord');
  } catch (err) {
    console.error(err);
    res.status(500).send('🔴Failed to send to Discord');
  }
});

app.listen(9600, () => {
  console.log('Discord proxy running on port 9600');
});
