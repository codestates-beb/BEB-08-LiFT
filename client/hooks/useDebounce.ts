import { useEffect, useState } from 'react';

// 입력 값이 600ms 동안 변화가 없을 시 검색될 수 있도록 한다.

const useDebounce = <T = any>(value: T, delay: 600) => {
  const [debouncedValue, setDebouncedValue] = useState<T>(() => value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
};

export default useDebounce;
