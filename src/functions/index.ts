import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

// Initialize Firebase Admin
admin.initializeApp();

// Example function to get all users (admin only)
export const getAllUsers = functions.https.onCall(async (data, context) => {
  // Check if user is authenticated
  if (!context.auth) {
    throw new functions.https.HttpsError(
      'unauthenticated',
      'User must be authenticated'
    );
  }

  try {
    const usersList = await admin.auth().listUsers();
    return { users: usersList.users.map(user => ({
      uid: user.uid,
      email: user.email,
      displayName: user.displayName
    }))};
  } catch (error) {
    throw new functions.https.HttpsError('internal', error.message);
  }
});

// Example function to update user role (admin only)
export const setUserRole = functions.https.onCall(async (data, context) => {
  // Check if user is authenticated
  if (!context.auth) {
    throw new functions.https.HttpsError(
      'unauthenticated',
      'User must be authenticated'
    );
  }

  const { uid, role } = data;

  try {
    await admin.auth().setCustomUserClaims(uid, { role });
    return { success: true };
  } catch (error) {
    throw new functions.https.HttpsError('internal', error.message);
  }
});

// Example function to create a new user (admin only)
export const createUser = functions.https.onCall(async (data, context) => {
  // Check if user is authenticated
  if (!context.auth) {
    throw new functions.https.HttpsError(
      'unauthenticated',
      'User must be authenticated'
    );
  }

  const { email, password, displayName } = data;

  try {
    const userRecord = await admin.auth().createUser({
      email,
      password,
      displayName
    });
    return { uid: userRecord.uid };
  } catch (error) {
    throw new functions.https.HttpsError('internal', error.message);
  }
});