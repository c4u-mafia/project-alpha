/** Queue names — used by BullModule.registerQueue and @InjectQueue/@Processor. */
export const QUEUE = {
  WELCOME: 'welcome',
  MONTHLY_GREETING: 'monthly-greeting',
} as const;

/** Job names within the monthly-greeting queue. */
export const MONTHLY_JOB = {
  /** Repeatable cron job: fans out one delivery job per user. */
  DISPATCH: 'dispatch',
  /** Per-user delivery: send email + create in-app notification. */
  DELIVER: 'deliver',
} as const;
