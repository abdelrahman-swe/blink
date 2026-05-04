import api from "../api";
import { ForgetPasswordPayload, ForgetPasswordResponse, LoginPayload, LoginResponse, RegisterPayload, RegisterResponse, ResendOtpPayload, ResendOtpResponse, VerifyAccountPayload, VerifyAccountResponse, VerifyForgetPasswordPayload, VerifyForgetPasswordResponse, ResetPasswordPayload, ResetPasswordResponse, ForgetResendOtpResponse, ForgetResendOtpPayload, LogoutPayload, LogoutResponse, RefreshTokenResponse } from "../types/auth";



// ===================== AUTH SERVICES =====================

////////////////////////////////////////////////////////////////
// LOGIN
////////////////////////////////////////////////////////////////

export const getLoginUser = async (body: LoginPayload): Promise<LoginResponse> => {
  const response = await api.post("/auth/login", body);
  return response.data;
};

////////////////////////////////////////////////////////////////
// REGISTER
////////////////////////////////////////////////////////////////

export const getRegisterUser = async (body: RegisterPayload): Promise<RegisterResponse> => {
  const response = await api.post("/auth/register", body);
  return response.data;
};

////////////////////////////////////////////////////////////////
// VERIFY ACCOUNT
////////////////////////////////////////////////////////////////

export const getVerifyUser = async (body: VerifyAccountPayload): Promise<VerifyAccountResponse> => {
  const response = await api.post("/auth/verify-account", body);
  return response.data;
};

////////////////////////////////////////////////////////////////
// RESEND OTP
////////////////////////////////////////////////////////////////

export const getResendOtpUser = async (body: ResendOtpPayload): Promise<ResendOtpResponse> => {
  const response = await api.post("/auth/resend-otp", body);
  return response.data;
};

////////////////////////////////////////////////////////////////
// FORGET PASSWORD
////////////////////////////////////////////////////////////////

export const getForgetPasswordUser = async (body: ForgetPasswordPayload): Promise<ForgetPasswordResponse> => {
  const response = await api.post("/auth/request-reset-otp", body);
  return response.data;
};

////////////////////////////////////////////////////////////////
// VERIFY FORGET PASSWORD
////////////////////////////////////////////////////////////////

export const getVerifyForgetPasswordUser = async (body: VerifyForgetPasswordPayload): Promise<VerifyForgetPasswordResponse> => {
  const response = await api.post("/auth/verify-reset-otp", body);
  return response.data;
};

////////////////////////////////////////////////////////////////
// RESEND FORGET OTP
////////////////////////////////////////////////////////////////
export const getForgetResendOtpUser = async (body: ForgetResendOtpPayload): Promise<ForgetResendOtpResponse> => {
  const response = await api.post("/auth/request-reset-otp", body);
  return response.data;

}

////////////////////////////////////////////////////////////////
// RESET PASSWORD
////////////////////////////////////////////////////////////////

export const getResetPasswordUser = async (body: ResetPasswordPayload): Promise<ResetPasswordResponse> => {
  const response = await api.post("/auth/reset-password", body);
  return response.data;
};

////////////////////////////////////////////////////////////////
// REFRESH TOKEN
////////////////////////////////////////////////////////////////

export const getRefreshTokenUser = async (): Promise<RefreshTokenResponse> => {
  const response = await api.post("/auth/refresh", {});
  return response.data;
};

