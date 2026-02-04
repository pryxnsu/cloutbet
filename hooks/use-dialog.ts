import { useCallback, useState } from "react";

export default function useDialog(defaultOpen = false) {
    const [isOpen, setIsOpen] = useState(defaultOpen);

    const close = useCallback(() => setIsOpen(false), []);

    return { isOpen, setIsOpen, close };
}