import { Trash2 } from 'lucide-react';

import { ButtonHypertube } from '@/components/ui/buttons/button-hypertube';

const ClearLocalStorageButton = () => {
  const handleClearLocalStorage = () => {
    localStorage.clear();
    sessionStorage.clear();

    // Clear all cookies
    document.cookie.split(';').forEach((cookie) => {
      const [name] = cookie.split('=');
      document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
    });

    window.location.reload();
  };

  return (
    <div className="items-center">
      <ButtonHypertube
        variant="ghost"
        size="icon"
        title="Clear local storage data"
        onClick={handleClearLocalStorage}
        className="hover:text-destructive transition-all duration-300 ease-in-out hover:bg-transparent"
      >
        <Trash2 />
        <span className="sr-only">Clear local storage data</span>
      </ButtonHypertube>
    </div>
  );
};

export default ClearLocalStorageButton;
