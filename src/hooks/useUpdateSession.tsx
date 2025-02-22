import { useSession } from 'next-auth/react';

const useUpdateSession = () => {
  const { data: session, update } = useSession();

  const updateSession = async (updatedUserData: any) => {
    try {
      const response = await fetch('/api/session/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user: updatedUserData }),
      });

      if (response.ok) {
        const { token } = await response.json();

        // Update the session data in the client
        if (update) {
          update({
            ...session,
            user: token, // Transfer the updated user data to the session
          });
        }
      }
    } catch (error) {
      console.error('Error updating session:', error);
    }
  };

  return { updateSession };
};

export default useUpdateSession;
