// Hook to set, get, or delete from local storage

/**
 * Custom hook to handle local storage operations.
 * @param {string} key - The key to store or retrieve from local storage.
 * @param {string} type - The type of operation ('get', 'set', or 'delete').
 * @returns {any} - The result of the operation.
 */
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
