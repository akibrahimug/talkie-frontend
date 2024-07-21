// Hook to set, get, or delete from local storage

const useLocalStorage = (key, type) => {
  try {
    if (type === 'get') {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : '';
    } else if (type === 'set') {
      const setValue = (newValue) => {
        window.localStorage.setItem(key, JSON.stringify(newValue));
      };
      return [setValue];
    } else {
      const deleteValue = () => {
        window.localStorage.removeItem(key);
      };
      return [deleteValue];
    }
  } catch (error) {
    console.error(error, 'CHECK CUSTOM LOCAL STOREAGE HOOK');
  }
};

export default useLocalStorage;
