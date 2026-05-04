import {
  getForgetPasswordUser,
  getLoginUser,
  getRegisterUser,
  getVerifyUser,
  getVerifyForgetPasswordUser,
  getResetPasswordUser,
  getResendOtpUser,
  getForgetResendOtpUser,
  getRefreshTokenUser,
} from "@/utils/services/auth";
import {
  ForgetPasswordPayload,
  ForgetPasswordResponse,
  LoginPayload,
  LoginResponse,
  RegisterPayload,
  RegisterResponse,
  ResendOtpPayload,
  ResendOtpResponse,
  VerifyAccountPayload,
  VerifyAccountResponse,
  VerifyForgetPasswordPayload,
  VerifyForgetPasswordResponse,
  ResetPasswordPayload,
  ResetPasswordResponse,
  ForgetResendOtpPayload,
  ForgetResendOtpResponse,
} from "@/utils/types/auth";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { useUserStore } from "@/store/useUserStore";
import { useEffect } from "react";

// LOGIN
export function useLogin() {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation<LoginResponse, Error, LoginPayload>({
    mutationFn: (data) => getLoginUser(data),
    onSuccess: (data) => {
      toast.success("Logged in successfully");
      if (data.data?.token) {
        useUserStore.getState().setUser({
          token: data.data.token,
          id: data.data.user.id ?? 0,
          full_name: data.data.user.full_name,
          email: data.data.user.email,
          phone: data.data.user.phone,
        });
      }

      // Invalidate all product queries to refetch with authentication
      queryClient.invalidateQueries({ queryKey: ["deals-of-the-day-products"] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["products-by-category"] });
      queryClient.invalidateQueries({ queryKey: ["search-products"] });
      queryClient.invalidateQueries({ queryKey: ["best-selling-products"] });
      queryClient.invalidateQueries({ queryKey: ["new-arrival-products"] });
      queryClient.invalidateQueries({ queryKey: ["product"] });

      if (typeof window !== "undefined") {
        const searchParams = new URLSearchParams(window.location.search);
        const callbackUrl = searchParams.get("callbackUrl");
        if (callbackUrl) {
          window.location.href = callbackUrl; // Bypass Next.js router cache
        } else {
          window.location.href = "/";
        }
      } else {
        router.push("/");
      }
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Login failed");
    },
  });
}

// REGISTER
export function useRegister() {
  const router = useRouter();

  return useMutation<RegisterResponse, Error, RegisterPayload>({
    mutationFn: (data) => getRegisterUser(data),
    onSuccess: (response) => {
    },
    onError: (error: any, variables: RegisterPayload) => {
      toast.error(error.response?.data?.message || "Registration failed");
    },
  });
}

// VERIFY ACCOUNT
export function useVerifyAccount() {
  const queryClient = useQueryClient();

  return useMutation<VerifyAccountResponse, Error, VerifyAccountPayload>({
    mutationFn: (data) => getVerifyUser(data),
    onSuccess: (response) => {
      toast.success(`Welcome, "${response.data.user.full_name}" Account verified successfully!`);
      if (response.data?.token) {
        useUserStore.getState().setUser({
          token: response.data.token,
          id: response.data.user.id ?? 0,
          full_name: response.data.user.full_name,
          email: response.data.user.email,
          phone: response.data.user.phone,
        });
      }

      // Invalidate all product queries to refetch with authentication
      queryClient.invalidateQueries({ queryKey: ["deals-of-the-day-products"] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["products-by-category"] });
      queryClient.invalidateQueries({ queryKey: ["search-products"] });
      queryClient.invalidateQueries({ queryKey: ["best-selling-products"] });
      queryClient.invalidateQueries({ queryKey: ["new-arrival-products"] });
      queryClient.invalidateQueries({ queryKey: ["product"] });

      // Redirect to callbackUrl if present, else /home
      const searchParams = new URLSearchParams(window.location.search);
      const callbackUrl = searchParams.get("callbackUrl");
      window.location.href = callbackUrl ?? "/home"; // Bypass Next.js router cache
    },
    onError: (error: any, variables: VerifyAccountPayload) => {
      toast.error(error.response?.data?.message || "Invalid verification code");
    },
  });
}

//VERIFY ACCOUNT RESEND OTP
export function useResendOtp() {
  const router = useRouter();

  return useMutation<ResendOtpResponse, Error, ResendOtpPayload>({
    mutationFn: (data) => getResendOtpUser(data),
    onSuccess: (response) => {
      console.log("✅ RESEND OTP SUCCESS:", response);

      toast.success(response.message || "Otp resend successfully!");
      if (response.data?.otp) {
        toast.success(`Your new code is: ${response.data.otp}`);
      }
    },
    onError: (error: any, variables: ResendOtpPayload) => {
      toast.error(error.response?.data?.message || "Invalid identifier");
    },
  });
}

//FORGET PASSWORD
export function useForgetPassword() {
  const router = useRouter();

  return useMutation<ForgetPasswordResponse, Error, ForgetPasswordPayload>({
    mutationFn: (data) => getForgetPasswordUser(data),
    onSuccess: (response) => {
      toast.success(response.message || "Otp resend successfully!");
      if (response.data?.otp) {
        toast.success(`Your new code is: ${response.data.otp}`);
      }
    },
    onError: (error: any, variables: ForgetPasswordPayload) => {
      toast.error(error.response?.data?.message || "Invalid identifier");
    },
  });
}

// VERIFY FORGET PASSWORD
export function useVerifyForgetPassword() {
  const router = useRouter();

  return useMutation<
    VerifyForgetPasswordResponse,
    Error,
    VerifyForgetPasswordPayload
  >({
    mutationFn: (data) => getVerifyForgetPasswordUser(data),
    onSuccess: (response) => {
      toast.success(response.message || "Account verified successfully!");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Invalid verification code");
    },
  });
}


//VERIFY FORGET ACCOUNT RESEND OTP
export function useForgetResendOtp() {
  const router = useRouter();

  return useMutation<ForgetResendOtpResponse, Error, ForgetResendOtpPayload>({
    mutationFn: (data) => getForgetResendOtpUser(data),
    onSuccess: (response) => {
      console.log("✅ RESEND OTP SUCCESS:", response);

      toast.success(response.message || "Otp resend successfully!");
      if (response.data?.otp) {
        toast.success(`Your new code is: ${response.data.otp}`);
      }
    },
    onError: (error: any, variables: ForgetResendOtpPayload) => {
      toast.error(error.response?.data?.message || "Invalid identifier");
    },
  });
}


// RESET PASSWORD
export function useResetPassword() {
  const router = useRouter();

  return useMutation<ResetPasswordResponse, Error, ResetPasswordPayload>({
    mutationFn: (data: ResetPasswordPayload) => getResetPasswordUser(data),
    onSuccess: (response) => {
      toast.success(response.message || "Password reset successfully!");
      sessionStorage.removeItem("forget-password-identifier");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Password reset failed");
    },
  });
}

// REFRESH TOKEN
export function useTokenRefresh() {
  const { isAuthenticated, user, setUser } = useUserStore();

  useEffect(() => {
    // Only start interval if user is authenticated
    if (!isAuthenticated || !user) return;

    const interval = setInterval(async () => {
      try {
        const response = await getRefreshTokenUser();
        if (response?.status === "success" && response?.data?.token) {
          setUser({ ...user, token: response.data.token });
        }
      } catch (error) {
      }
    }, 12 * 60 * 60 * 1000);

    return () => clearInterval(interval);
  }, [isAuthenticated, user, setUser]);
}

