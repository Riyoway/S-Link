
export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs' && process.env.NEXT_ENV === 'server' && process.env.DISCORD_WEBHOOK) {
    // Prevent multiple executions (e.g. during hot reload or multiple worker starts)
    if ((globalThis as any)._isStartupNotificationSent) return;
    (globalThis as any)._isStartupNotificationSent = true;

    // File-based lock to prevent spam across process restarts
    try {
      const fs = await import('fs');
      const path = await import('path');
      const lockFile = path.join(process.cwd(), '.startup.lock');
      
      if (fs.existsSync(lockFile)) {
        const stats = fs.statSync(lockFile);
        const now = Date.now();
        // Prevent sending if last sent within 60 seconds
        if (now - stats.mtimeMs < 60000) {
          return;
        }
      }
      // Update lock file
      fs.writeFileSync(lockFile, new Date().toISOString());
    } catch (e) {
      // Ignore file system errors
      console.error('Failed to handle lock file:', e);
    }

    const webhookUrl = process.env.DISCORD_WEBHOOK;

    const embed = {
      title: "<a:Cracker:1181459766103527485> Server Status",
      description: "The server has been successfully updated and deployed.",
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
