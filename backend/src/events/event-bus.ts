import { EventEmitter } from 'node:events';

/**
 * Process-wide event bus.
 *
 * Why a plain singleton instead of `@nestjs/event-emitter`?
 * The better-auth config in `src/auth/index.ts` is a plain object that runs
 * OUTSIDE Nest's dependency-injection container, so it cannot inject the
 * DI-bound `EventEmitter2`. A module-level singleton is reachable from both
 * the auth hooks and Nest providers, which is exactly the bridge we need to
 * keep all queue wiring inside Nest while still reacting to auth lifecycle.
 */
class AppEventBus extends EventEmitter {}

export const eventBus = new AppEventBus();

// A few subscribers (welcome listener) attach lazily; bump the cap so Node
// doesn't warn as the app grows more listeners.
eventBus.setMaxListeners(20);

export const AppEvent = {
  UserCreated: 'user.created',
} as const;

export type UserCreatedPayload = {
  userId: string;
};

export function emitUserCreated(payload: UserCreatedPayload): void {
  eventBus.emit(AppEvent.UserCreated, payload);
}
