import { onCall, HttpsError } from 'firebase-functions/v2/https';
import * as admin from 'firebase-admin';

// Initialize Firebase Admin
admin.initializeApp();

// Example function to get all users (admin only)
export const getAllUsers = onCall(async (request) => {
  // Check if user is authenticated
  if (!request.auth) {
    throw new HttpsError(
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
    throw new HttpsError('internal', error.message);
  }
});

interface SetUserRoleData {
  uid: string;
  role: string;
}

// Example function to update user role (admin only)
export const setUserRole = onCall<SetUserRoleData>(async (request) => {
  // Check if user is authenticated
  if (!request.auth) {
    throw new HttpsError(
      'unauthenticated',
      'User must be authenticated'
    );
  }

  const { uid, role } = request.data;

  try {
    await admin.auth().setCustomUserClaims(uid, { role });
    return { success: true };
  } catch (error) {
    throw new HttpsError('internal', error.message);
  }
});

interface CreateUserData {
  email: string;
  password: string;
  displayName: string;
}

// Example function to create a new user (admin only)
export const createUser = onCall<CreateUserData>(async (request) => {
  // Check if user is authenticated
  if (!request.auth) {
    throw new HttpsError(
      'unauthenticated',
      'User must be authenticated'
    );
  }

  const { email, password, displayName } = request.data;

  try {
    const userRecord = await admin.auth().createUser({
      email,
      password,
      displayName
    });
    return { uid: userRecord.uid };
  } catch (error) {
    throw new HttpsError('internal', error.message);
  }
});