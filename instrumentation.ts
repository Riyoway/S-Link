
export async function register() {
  if (process.env.NEXT_ENV === 'server' && process.env.DISCORD_WEBHOOK) {
    const webhookUrl = process.env.DISCORD_WEBHOOK;

    const embed = {
      title: "🚀 Server Status",
      description: "The server has successfully started and is now online.",
      color: 5763719, // Green
      fields: [
        {
          name: "Environment",
          value: "Production (Server)",
          inline: true,
        },
        {
          name: "Time",
          value: new Date().toLocaleString("en-US", { timeZone: "Asia/Tokyo" }),
          inline: true,
        },
      ],
      footer: {
        text: "S-Link System",
      },
      timestamp: new Date().toISOString(),
    };

    try {
      await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: "S-Link Notification",
          embeds: [embed],
        }),
      });
      console.log('Startup notification sent to Discord.');
    } catch (error) {
      console.error('Failed to send Discord webhook:', error);
    }
  }
}
