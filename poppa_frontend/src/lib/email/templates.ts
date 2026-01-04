const baseStyles = `
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
  line-height: 1.6;
  color: #5D4037;
`;

const buttonStyle = `
  display: inline-block;
  background-color: #8B4513;
  color: white;
  text-decoration: none;
  padding: 12px 24px;
  border-radius: 6px;
  font-weight: 600;
`;

const headerStyle = `
  text-align: center;
  padding: 24px;
  background: linear-gradient(135deg, #8B4513 0%, #6D3611 100%);
`;

const logoStyle = `
  font-size: 32px;
  color: white;
  font-weight: bold;
  text-decoration: none;
`;

function baseTemplate(content: string): string {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="${baseStyles} margin: 0; padding: 0; background-color: #f9f5f2;">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 0 auto; background-color: white;">
          <tr>
            <td style="${headerStyle}">
              <a href="https://trypoppa.com" style="${logoStyle}">poppa</a>
            </td>
          </tr>
          <tr>
            <td style="padding: 32px;">
              ${content}
            </td>
          </tr>
          <tr>
            <td style="padding: 24px; text-align: center; background-color: #f9f5f2; color: #8B4513;">
              <p style="margin: 0; font-size: 14px;">
                &copy; ${new Date().getFullYear()} Poppa. Crafted with care by Naxos Labs.
              </p>
              <p style="margin: 8px 0 0; font-size: 12px; color: #8B4513; opacity: 0.7;">
                <a href="https://trypoppa.com" style="color: #8B4513;">trypoppa.com</a>
              </p>
            </td>
          </tr>
        </table>
      </body>
    </html>
  `;
}

export function welcomeEmail(firstName?: string): {
  subject: string;
  html: string;
  text: string;
} {
  const greeting = firstName ? `Hi ${firstName}` : "Hi there";

  const html = baseTemplate(`
    <h1 style="color: #8B4513; margin: 0 0 16px;">Welcome to Poppa! 🎉</h1>

    <p>${greeting},</p>

    <p>
      Thank you for joining Poppa! We're excited to help you on your language learning journey.
    </p>

    <p>
      With Poppa, you'll learn languages naturally through voice conversations using the <strong>Thinking Method</strong>—no memorization needed, just discovery.
    </p>

    <h3 style="color: #8B4513; margin: 24px 0 12px;">You've got 20 free minutes to start!</h3>

    <p>
      That's enough for a few lessons to experience how different our approach is.
    </p>

    <p style="text-align: center; margin: 32px 0;">
      <a href="https://trypoppa.com/dashboard" style="${buttonStyle}">Start Your First Lesson</a>
    </p>

    <p style="color: #8B4513; margin-top: 32px;">
      <strong>What to expect:</strong>
    </p>
    <ul style="padding-left: 20px;">
      <li>Real voice conversations with your AI tutor</li>
      <li>Lessons tailored to your pace and level</li>
      <li>No grammar drills—just natural learning</li>
    </ul>

    <p style="margin-top: 24px;">
      Happy learning!<br>
      <span style="color: #8B4513; font-weight: 600;">The Poppa Team</span>
    </p>
  `);

  const text = `
Welcome to Poppa!

${greeting},

Thank you for joining Poppa! We're excited to help you on your language learning journey.

With Poppa, you'll learn languages naturally through voice conversations using the Thinking Method—no memorization needed, just discovery.

You've got 20 free minutes to start! That's enough for a few lessons to experience how different our approach is.

Start your first lesson: https://trypoppa.com/dashboard

What to expect:
- Real voice conversations with your AI tutor
- Lessons tailored to your pace and level
- No grammar drills—just natural learning

Happy learning!
The Poppa Team
  `.trim();

  return {
    subject: "Welcome to Poppa! Your language journey begins 🌍",
    html,
    text,
  };
}

export function firstLessonReminderEmail(firstName?: string): {
  subject: string;
  html: string;
  text: string;
} {
  const greeting = firstName ? `Hi ${firstName}` : "Hi there";

  const html = baseTemplate(`
    <h1 style="color: #8B4513; margin: 0 0 16px;">Ready for Your First Lesson? 🎯</h1>

    <p>${greeting},</p>

    <p>
      We noticed you haven't started your first lesson yet. No worries—learning a new language is a big step!
    </p>

    <p>
      Here's what your first lesson will be like:
    </p>

    <ol style="padding-left: 20px;">
      <li><strong>5 minutes</strong> is all you need to start</li>
      <li>Just <strong>speak naturally</strong>—like talking to a friend</li>
      <li>Your tutor will <strong>guide you</strong> through questions</li>
      <li>No wrong answers—<strong>mistakes help you learn</strong></li>
    </ol>

    <p style="text-align: center; margin: 32px 0;">
      <a href="https://trypoppa.com/dashboard" style="${buttonStyle}">Take Your First Lesson</a>
    </p>

    <p style="background-color: #f9f5f2; padding: 16px; border-radius: 8px; margin: 24px 0;">
      💡 <strong>Tip:</strong> The Thinking Method is different from other apps.
      Instead of memorizing, you'll discover patterns yourself.
      It might feel unusual at first, but that's when the magic happens!
    </p>

    <p style="margin-top: 24px;">
      You've got this!<br>
      <span style="color: #8B4513; font-weight: 600;">The Poppa Team</span>
    </p>
  `);

  const text = `
Ready for Your First Lesson?

${greeting},

We noticed you haven't started your first lesson yet. No worries—learning a new language is a big step!

Here's what your first lesson will be like:
1. 5 minutes is all you need to start
2. Just speak naturally—like talking to a friend
3. Your tutor will guide you through questions
4. No wrong answers—mistakes help you learn

Take your first lesson: https://trypoppa.com/dashboard

Tip: The Thinking Method is different from other apps. Instead of memorizing, you'll discover patterns yourself. It might feel unusual at first, but that's when the magic happens!

You've got this!
The Poppa Team
  `.trim();

  return {
    subject: "Ready for your first lesson? Here's what to expect 🎯",
    html,
    text,
  };
}

export function streakReminderEmail(
  firstName: string | undefined,
  currentStreak: number
): { subject: string; html: string; text: string } {
  const greeting = firstName ? `Hi ${firstName}` : "Hi there";

  const html = baseTemplate(`
    <h1 style="color: #8B4513; margin: 0 0 16px;">Your ${currentStreak}-Day Streak is at Risk! 🔥</h1>

    <p>${greeting},</p>

    <p>
      You've built an amazing <strong>${currentStreak}-day streak</strong>!
      Don't let it slip away—just a quick 5-minute lesson will keep it going.
    </p>

    <p style="text-align: center; font-size: 48px; margin: 24px 0;">
      🔥
    </p>

    <p style="text-align: center; margin: 32px 0;">
      <a href="https://trypoppa.com/dashboard" style="${buttonStyle}">Keep Your Streak Alive</a>
    </p>

    <p style="background-color: #fff3e0; padding: 16px; border-radius: 8px; border-left: 4px solid #ff9800;">
      ⏰ Practice today to maintain your streak. Every day of practice builds stronger language habits!
    </p>

    <p style="margin-top: 24px;">
      Keep going!<br>
      <span style="color: #8B4513; font-weight: 600;">The Poppa Team</span>
    </p>
  `);

  const text = `
Your ${currentStreak}-Day Streak is at Risk! 🔥

${greeting},

You've built an amazing ${currentStreak}-day streak! Don't let it slip away—just a quick 5-minute lesson will keep it going.

Keep your streak alive: https://trypoppa.com/dashboard

Practice today to maintain your streak. Every day of practice builds stronger language habits!

Keep going!
The Poppa Team
  `.trim();

  return {
    subject: `Your ${currentStreak}-day streak is at risk! 🔥 Practice now`,
    html,
    text,
  };
}

export function weeklyProgressEmail(
  firstName: string | undefined,
  stats: {
    lessonsThisWeek: number;
    minutesThisWeek: number;
    currentStreak: number;
    languagesStudied: string[];
  }
): { subject: string; html: string; text: string } {
  const greeting = firstName ? `Hi ${firstName}` : "Hi there";

  const html = baseTemplate(`
    <h1 style="color: #8B4513; margin: 0 0 16px;">Your Weekly Progress Report 📊</h1>

    <p>${greeting},</p>

    <p>Here's how your language learning went this week:</p>

    <table style="width: 100%; margin: 24px 0; border-collapse: collapse;">
      <tr>
        <td style="padding: 16px; text-align: center; background-color: #f9f5f2; border-radius: 8px 0 0 8px;">
          <div style="font-size: 32px; font-weight: bold; color: #8B4513;">${stats.lessonsThisWeek}</div>
          <div style="font-size: 14px; color: #5D4037;">Lessons</div>
        </td>
        <td style="padding: 16px; text-align: center; background-color: #f9f5f2;">
          <div style="font-size: 32px; font-weight: bold; color: #8B4513;">${stats.minutesThisWeek}</div>
          <div style="font-size: 14px; color: #5D4037;">Minutes</div>
        </td>
        <td style="padding: 16px; text-align: center; background-color: #f9f5f2; border-radius: 0 8px 8px 0;">
          <div style="font-size: 32px; font-weight: bold; color: #8B4513;">🔥 ${stats.currentStreak}</div>
          <div style="font-size: 14px; color: #5D4037;">Day Streak</div>
        </td>
      </tr>
    </table>

    ${
      stats.languagesStudied.length > 0
        ? `
    <p>
      <strong>Languages practiced:</strong> ${stats.languagesStudied.join(", ")}
    </p>
    `
        : ""
    }

    <p style="text-align: center; margin: 32px 0;">
      <a href="https://trypoppa.com/dashboard" style="${buttonStyle}">Continue Learning</a>
    </p>

    <p style="margin-top: 24px;">
      Keep up the great work!<br>
      <span style="color: #8B4513; font-weight: 600;">The Poppa Team</span>
    </p>
  `);

  const text = `
Your Weekly Progress Report 📊

${greeting},

Here's how your language learning went this week:

Lessons: ${stats.lessonsThisWeek}
Minutes: ${stats.minutesThisWeek}
Day Streak: ${stats.currentStreak}
${stats.languagesStudied.length > 0 ? `Languages practiced: ${stats.languagesStudied.join(", ")}` : ""}

Continue learning: https://trypoppa.com/dashboard

Keep up the great work!
The Poppa Team
  `.trim();

  return {
    subject: `Your weekly progress: ${stats.lessonsThisWeek} lessons, ${stats.minutesThisWeek} minutes 📊`,
    html,
    text,
  };
}

export function achievementUnlockedEmail(
  firstName: string | undefined,
  achievementTitle: string,
  achievementDescription: string,
  achievementIcon: string
): { subject: string; html: string; text: string } {
  const greeting = firstName ? `Hi ${firstName}` : "Hi there";

  const html = baseTemplate(`
    <h1 style="color: #8B4513; margin: 0 0 16px;">Achievement Unlocked! 🏆</h1>

    <p>${greeting},</p>

    <p>Congratulations! You've just unlocked a new achievement:</p>

    <div style="text-align: center; margin: 32px 0; padding: 24px; background-color: #f9f5f2; border-radius: 12px;">
      <div style="font-size: 64px; margin-bottom: 16px;">${achievementIcon}</div>
      <h2 style="color: #8B4513; margin: 0 0 8px;">${achievementTitle}</h2>
      <p style="color: #5D4037; margin: 0;">${achievementDescription}</p>
    </div>

    <p style="text-align: center; margin: 32px 0;">
      <a href="https://trypoppa.com/dashboard" style="${buttonStyle}">View All Achievements</a>
    </p>

    <p>
      Keep learning and unlock more achievements on your language journey!
    </p>

    <p style="margin-top: 24px;">
      Congratulations!<br>
      <span style="color: #8B4513; font-weight: 600;">The Poppa Team</span>
    </p>
  `);

  const text = `
Achievement Unlocked! 🏆

${greeting},

Congratulations! You've just unlocked a new achievement:

${achievementIcon} ${achievementTitle}
${achievementDescription}

View all achievements: https://trypoppa.com/dashboard

Keep learning and unlock more achievements on your language journey!

Congratulations!
The Poppa Team
  `.trim();

  return {
    subject: `🏆 Achievement Unlocked: ${achievementTitle}`,
    html,
    text,
  };
}
