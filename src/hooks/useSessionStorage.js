/**
 * Custom hook to handle session storage operations.
 * @param {string} key - The key to store or retrieve from session storage.
 * @param {string} type - The type of operation ('get', 'set', or 'delete').
 * @returns {any} - The result of the operation.
 */
const useSessionStorage = (key, type) => {
  try {
    if (type === 'get') {
      const item = window.sessionStorage.getItem(key);
      return item ? JSON.parse(item) : '';
    } else if (type === 'set') {
      const setValue = (newValue) => {
        window.sessionStorage.setItem(key, JSON.stringify(newValue));
      };
      return [setValue];
    } else {
      const deleteValue = () => {
        window.sessionStorage.removeItem(key);
      };
      return [deleteValue];
    }
  } catch (error) {
    console.error(error, 'CHECK CUSTOM SESSION STOREAGE HOOK');
  }
};

export default useSessionStorage;
