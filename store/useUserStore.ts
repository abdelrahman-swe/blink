import { create } from 'zustand';
import Cookies from 'js-cookie';

interface User {
    id: number;
    full_name: string;
    email: string;
    phone: string;
    token: string;
}

interface UserState {
    user: User | null;
    isAuthenticated: boolean;
    setUser: (user: User) => void;
    logout: () => void;
    syncWithCookies: () => void;
    loginDialogOpen: boolean;
    setLoginDialogOpen: (val: boolean) => void;
}

export const useUserStore = create<UserState>((set) => ({
    user: null,
    isAuthenticated: false,
    loginDialogOpen: false,
    setLoginDialogOpen: (val) => set({ loginDialogOpen: val }),
    setUser: (user) => {
        // Sync with cookies FIRST to avoid race conditions with queries triggered by state change
        Cookies.set('token', user.token, { path: '/', expires: 365 });
        Cookies.set('id', user.id.toString(), { path: '/', expires: 365 });
        Cookies.set('full_name', user.full_name, { path: '/', expires: 365 });
        Cookies.set('email', user.email, { path: '/', expires: 365 });
        Cookies.set('phone', user.phone, { path: '/', expires: 365 });

        // Update store state
        set({ user, isAuthenticated: true });

        // NOTE: We intentionally do NOT clear checkout_form_data here.
        // Guest form data must survive a failed payment redirect so the
        // checkout page can restore it when the user returns.
    },
    logout: () => {
        set({ user: null, isAuthenticated: false });
        Cookies.remove('token', { path: '/' });
        Cookies.remove('id', { path: '/' });
        Cookies.remove('full_name', { path: '/' });
        Cookies.remove('email', { path: '/' });
        Cookies.remove('phone', { path: '/' });
        Cookies.remove('otp', { path: '/' }); // Remove OTP if it exists
        Cookies.remove('user', { path: '/' }); // Clean up potentially stray cookies

        // Clear form data from sessionStorage on logout
        if (typeof window !== "undefined") {
            localStorage.removeItem("checkout_form_data");
            sessionStorage.removeItem("checkout_form_data"); // Keep for backwards compatibility with any old sessions
            sessionStorage.removeItem("register-form-data");
            sessionStorage.removeItem("forget-password-phone");
        }

        const lang = Cookies.get("NEXT_LOCALE") || 'en';
        window.location.href = `/${lang}/home`;
    },
    syncWithCookies: () => {
        const token = Cookies.get('token');
        const id = Cookies.get('id');
        const full_name = Cookies.get('full_name');
        const email = Cookies.get('email');
        const phone = Cookies.get('phone');

        if (token) {
            set({
                user: {
                    token,
                    id: id ? Number(id) : 0,
                    full_name: full_name || '',
                    email: email || '',
                    phone: phone || '',
                },
                isAuthenticated: true,
            });
        } else {
            set({ user: null, isAuthenticated: false });
        }
    },
}));
