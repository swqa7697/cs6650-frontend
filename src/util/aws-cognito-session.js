import { fetchAuthSession } from 'aws-amplify/auth';

export const getAccessToken = async () => {
  try {
    const { accessToken } = (await fetchAuthSession()).tokens ?? {};
    if (!accessToken) {
      throw new Error('No access token found');
    }

    return accessToken.toString();
  } catch (err) {
    console.log(err);
    return null;
  }
};
