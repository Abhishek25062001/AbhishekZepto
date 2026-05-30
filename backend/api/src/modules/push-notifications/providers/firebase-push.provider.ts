import { env, getFirebaseConfig } from '../../../config/env';
import { PUSH_NOTIFICATION_ERROR_CODES } from '../constants/push-notification-error-codes.constant';

type FirebaseAppModule = {
  cert: (config: {
    clientEmail: string;
    privateKey: string;
    projectId: string;
  }) => unknown;
  getApps: () => unknown[];
  initializeApp: (options: { credential: unknown }) => unknown;
};

type FirebaseMessagingModule = {
  getMessaging: () => {
    send: (message: {
      data: Record<string, string>;
      notification: { body: string; title: string };
      token: string;
    }) => Promise<string>;
  };
};

export type FirebasePushSendResult =
  | { success: true; providerMessageId: string }
  | { success: false; failureReason: string; invalidToken: boolean };

const optionalImport = async <TModule>(moduleName: string): Promise<TModule> => {
  const importer = Function('moduleName', 'return import(moduleName)');
  return (await importer(moduleName)) as TModule;
};

const isInvalidTokenError = (error: unknown): boolean => {
  const message = error instanceof Error ? error.message : String(error);
  return (
    message.includes('registration-token-not-registered') ||
    message.includes('invalid-registration-token') ||
    message.includes('invalid-argument')
  );
};

const normalizeFailureReason = (error: unknown): string =>
  error instanceof Error ? error.message : String(error);

let firebaseInitialized = false;

const ensureFirebaseInitialized = async (): Promise<boolean> => {
  if (!env.PUSH_NOTIFICATIONS_ENABLED) {
    return false;
  }

  const firebaseConfig = getFirebaseConfig();
  if (
    !firebaseConfig.projectId ||
    !firebaseConfig.clientEmail ||
    !firebaseConfig.privateKey
  ) {
    return false;
  }

  if (firebaseInitialized) {
    return true;
  }

  const appModule = await optionalImport<FirebaseAppModule>('firebase-admin/app');
  if (appModule.getApps().length === 0) {
    appModule.initializeApp({
      credential: appModule.cert({
        clientEmail: firebaseConfig.clientEmail,
        privateKey: firebaseConfig.privateKey,
        projectId: firebaseConfig.projectId,
      }),
    });
  }

  firebaseInitialized = true;
  return true;
};

export const sendToToken = async (
  fcmToken: string,
  title: string,
  body: string,
  dataPayload: Record<string, string>,
): Promise<FirebasePushSendResult> => {
  const configured = await ensureFirebaseInitialized();
  if (!configured) {
    return {
      failureReason: PUSH_NOTIFICATION_ERROR_CODES.PUSH_PROVIDER_NOT_CONFIGURED,
      invalidToken: false,
      success: false,
    };
  }

  try {
    const messagingModule =
      await optionalImport<FirebaseMessagingModule>('firebase-admin/messaging');
    const providerMessageId = await messagingModule.getMessaging().send({
      data: dataPayload,
      notification: { body, title },
      token: fcmToken,
    });

    return { providerMessageId, success: true };
  } catch (error) {
    return {
      failureReason: normalizeFailureReason(error),
      invalidToken: isInvalidTokenError(error),
      success: false,
    };
  }
};
