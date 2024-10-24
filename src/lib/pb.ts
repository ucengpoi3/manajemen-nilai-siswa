import PocketBase from 'pocketbase';

export const pb = new PocketBase('https://amakkaraka.pockethost.io');

export const isErrorResponse = (error: any) => {
  return error?.response?.code === 403 || 
         error?.response?.code === 401 || 
         error?.response?.code === 400;
};

export const login = async (email: string, password: string) => {
  return await pb.collection('users').authWithPassword(email, password);
};

export const signup = async (email: string, password: string, passwordConfirm: string) => {
  return await pb.collection('users').create({
    email,
    password,
    passwordConfirm,
  });
};

export const logout = () => {
  pb.authStore.clear();
};