/// ///////////////////////////////////////////////////////
// AUTH
// ////////////////////////////////////////////////////////


export type LoginPayload = {
  identifier: string;
  password: string;
  rememberMe?: boolean;
};

export type LoginResponse = {
  status: string;
  message: string;
  data: {
    user: {
      id: number;
      full_name: string;
      email: string;
      phone: string;
      created_at: string;
    };
    token: string;
  };
};

////////////////////////////////////////////
export type LogoutPayload = {
  token: string;
};

export type LogoutResponse = {
  status: string;
  message: string;
}

////////////////////////////////////////////

export type RegisterPayload = {
  full_name: string;
  phone: string;
  email: string;
  password: string;
  password_confirmation: string;
};

export type RegisterResponse = {
  status: string;
  message: string;
  data: {
    user: {
      phone: string;
      otp: number;
    };
  };
};

////////////////////////////////////////////////

export type VerifyAccountPayload = {
  identifier: string;
  otp: string;
};
export type VerifyAccountResponse = {
  status: string;
  message: string;
  data: {
    user: {
      id: number;
      full_name: string;
      email: string;
      phone: string;
      created_at: string;
    };
    token: string;
  };
};

////////////////////////////////////////////////

export type ResendOtpPayload = {
  identifier: string;
};
export type ResendOtpResponse = {
  status: string;
  message: string;
  data: {
    otp: number;
  };
};

////////////////////////////////////////////////

export type ForgetPasswordPayload = {
  identifier: string;
};
export type ForgetPasswordResponse = {
  status: string;
  message: string;
  data: {
    otp: number;
    is_blocked: boolean;
    retry_after: number;
  };
};

////////////////////////////////////////////////

export type VerifyForgetPasswordPayload = {
  identifier: string;
  otp: string;
};
export type VerifyForgetPasswordResponse = {
  status: string;
  message: string;
};

////////////////////////////////////////////////

export type ForgetResendOtpPayload = {
  identifier: string;
};
export type ForgetResendOtpResponse = {
  status: string;
  message: string;
  data: {
    otp: number;
    is_blocked: boolean;
    retry_after: number;
  };
};



export type ResetPasswordPayload = {
  identifier: string;
  new_password: string;
  new_password_confirmation: string;
};

export type ResetPasswordResponse = {
  status: string;
  message: string;
  data: {
    user: {
      id: number;
      full_name: string;
      email: string;
      phone: string;
      created_at: string;
    };
    token: string;
  };
};

export type RefreshTokenResponse = {
  status: string;
  message: string;
  data: {
    token: string;
  };
};
