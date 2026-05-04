// Tables — exported in dependency order (upstream first)
export * from './auth.table';
export * from './user-profile.table';
export * from './tenant.table';
export * from './landlord.table';
export * from './property.table';
export * from './kyc-document.table';
export * from './viewing.table';
export * from './application.table';
export * from './tenancy.table';
export * from './payment.table';
export * from './sponsorship.table';
export * from './message.table';
export * from './notification.table';

// Relations — must come after all table exports
export * from './relations';
