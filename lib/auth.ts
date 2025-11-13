import { fetchAuthSession, getCurrentUser, signOut as amplifySignOut } from 'aws-amplify/auth';

export interface CognitoUser {
  userId: string;
  username: string;
  email?: string;
  emailVerified?: boolean;
  groups?: string[];
}

/**
 * Get the current authenticated user
 */
export async function getAuthenticatedUser(): Promise<CognitoUser | null> {
  try {
    const user = await getCurrentUser();
    const session = await fetchAuthSession({ forceRefresh: false });
    
    const groups = session.tokens?.accessToken?.payload['cognito:groups'] as string[] || [];
    const email = session.tokens?.idToken?.payload.email as string;
    const emailVerified = session.tokens?.idToken?.payload.email_verified as boolean;
    
    return {
      userId: user.userId,
      username: user.username,
      email,
      emailVerified,
      groups,
    };
  } catch (error) {
    console.error('Error getting authenticated user:', error);
    return null;
  }
}

/**
 * Sign out the current user
 */
export async function signOut(): Promise<void> {
  try {
    await amplifySignOut();
  } catch (error) {
    console.error('Error signing out:', error);
    throw error;
  }
}

/**
 * Get the current auth session
 */
export async function getSession() {
  try {
    return await fetchAuthSession();
  } catch (error) {
    console.error('Error getting session:', error);
    return null;
  }
}

/**
 * Check if user is in a specific Cognito group
 */
export async function isUserInGroup(groupName: string): Promise<boolean> {
  const user = await getAuthenticatedUser();
  return user?.groups?.includes(groupName) || false;
}

/**
 * Get user's teams (Cognito groups)
 */
export async function getUserTeams(): Promise<string[]> {
  const user = await getAuthenticatedUser();
  return user?.groups || [];
}

/**
 * Get AWS credentials from Identity Pool (for S3 access)
 */
export async function getAwsCredentials() {
  try {
    const session = await fetchAuthSession();
    return session.credentials;
  } catch (error) {
    console.error('Error getting AWS credentials:', error);
    return null;
  }
}
