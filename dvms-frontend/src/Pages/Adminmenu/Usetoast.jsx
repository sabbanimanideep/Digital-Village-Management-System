// src/hooks/useToast.js
// Re-usable toast notification hook

import { useCallback, useState } from "react";

export function useToast() {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = "success") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3500);
  }, []);

  const removeToast = useCallback(
    (id) => setToasts((prev) => prev.filter((t) => t.id !== id)),
    []
  );

  return { toasts, addToast, removeToast };
}