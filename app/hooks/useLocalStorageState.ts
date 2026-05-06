import { useEffect, useRef, useState } from "react";

type InitialValue<T> = T | (() => T);

type StoredState<T> = {
   value: T;
   hasStoredValue: boolean;
};

function readStoredValue<T>(key: string, initialValue: InitialValue<T>) {
   if (typeof window === "undefined") {
      return typeof initialValue === "function"
         ? (initialValue as () => T)()
         : initialValue;
   }

   try {
      const stored = window.localStorage.getItem(key);
      if (!stored) {
         return typeof initialValue === "function"
            ? (initialValue as () => T)()
            : initialValue;
      }

      return JSON.parse(stored) as T;
   } catch {
      return typeof initialValue === "function"
         ? (initialValue as () => T)()
         : initialValue;
   }
}

export function useLocalStorageState<T>(key: string, initialValue: InitialValue<T>) {
   const previousKey = useRef(key);
   const [state, setState] = useState<StoredState<T>>(() => ({
      value: readStoredValue(key, initialValue),
      hasStoredValue: true,
   }));

   useEffect(() => {
      if (previousKey.current === key) return;

      previousKey.current = key;
      setState({
         value: readStoredValue(key, initialValue),
         hasStoredValue: true,
      });
   }, [key, initialValue]);

   useEffect(() => {
      if (typeof window === "undefined") return;
      if (!state.hasStoredValue) return;

      window.localStorage.setItem(key, JSON.stringify(state.value));
   }, [key, state]);

   const setValue = (next: T | ((prev: T) => T)) => {
      setState((prev) => ({
         value: typeof next === "function" ? (next as (v: T) => T)(prev.value) : next,
         hasStoredValue: true,
      }));
   };

   const clearValue = () => {
      if (typeof window !== "undefined") {
         window.localStorage.removeItem(key);
      }

      setState({
         value: typeof initialValue === "function"
            ? (initialValue as () => T)()
            : initialValue,
         hasStoredValue: false,
      });
   };

   return [state.value, setValue, clearValue] as const;
}
