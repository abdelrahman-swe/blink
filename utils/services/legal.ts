import api from "../api";
export interface LegalResponse {
  status: string;
  data: {
    title: string;
    content: string;
  };
}

////////////////////////////////////////////////////////////////
// PRIVACY POLICY
////////////////////////////////////////////////////////////////

export const getPrivacyPolicy = async (): Promise<LegalResponse> => {
  const response = await api.get("/legal/privacy_policy");
  return response.data;
};

////////////////////////////////////////////////////////////////
// TERMS AND CONDITIONS
////////////////////////////////////////////////////////////////

export const getTermsAndConditions = async (): Promise<LegalResponse> => {
  const response = await api.get("/legal/terms_conditions");
  return response.data;
};

////////////////////////////////////////////////////////////////
// RETURN POLICY
////////////////////////////////////////////////////////////////

export const getReturnPolicy = async (): Promise<LegalResponse> => {
  const response = await api.get("/legal/return_policy");
  return response.data;
};


////////////////////////////////////////////////////////////////
// RETURN POLICY
////////////////////////////////////////////////////////////////

export const getContactUs = async (): Promise<LegalResponse> => {
  const response = await api.get("/legal/contact_us");
  return response.data;
};
