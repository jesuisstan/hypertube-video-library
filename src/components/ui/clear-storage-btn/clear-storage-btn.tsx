import { Trash2 } from 'lucide-react';

import { ButtonCustom } from '@/components/ui/buttons/button-custom';

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
      <ButtonCustom
        variant="ghost"
        size="icon"
        title="Clear local storage data"
        onClick={handleClearLocalStorage}
        className="transition-all duration-300 ease-in-out hover:bg-transparent hover:text-destructive"
      >
        <Trash2 />
        <span className="sr-only">Clear local storage data</span>
      </ButtonCustom>
    </div>
  );
};

export default ClearLocalStorageButton;
