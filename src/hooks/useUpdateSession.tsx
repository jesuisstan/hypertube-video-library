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

        // Обновляем сессию локально
        if (update) {
          update({
            ...session,
            user: token, // Передаём новые данные в локальную сессию
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
