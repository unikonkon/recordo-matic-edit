import { getFunctions, httpsCallable } from 'firebase/functions';
import { app } from './firebase';

const functions = getFunctions(app);

export const adminService = {
  getAllUsers: async () => {
    const getAllUsersFunction = httpsCallable(functions, 'getAllUsers');
    const result = await getAllUsersFunction();
    return result.data;
  },

  setUserRole: async (uid: string, role: string) => {
    const setUserRoleFunction = httpsCallable(functions, 'setUserRole');
    const result = await setUserRoleFunction({ uid, role });
    return result.data;
  },

  createUser: async (email: string, password: string, displayName: string) => {
    const createUserFunction = httpsCallable(functions, 'createUser');
    const result = await createUserFunction({ email, password, displayName });
    return result.data;
  }
};