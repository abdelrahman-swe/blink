'use client';

import { useState } from 'react';
import { useUserStore } from '@/store/useUserStore';

export const useRequireAuth = () => {
    const { isAuthenticated } = useUserStore();
    const [showLoginDialog, setShowLoginDialog] = useState(false);

    const handleActionWithAuth = (action: () => void) => {
        if (!isAuthenticated) {
            setShowLoginDialog(true);
        } else {
            action();
        }
    };

    return {
        showLoginDialog,
        setShowLoginDialog,
        handleActionWithAuth,
        isAuthenticated
    };
};
