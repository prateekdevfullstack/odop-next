export type CfcUser = {
  id: number;
  name: string;
  email: string;
  cfc_id: number;
  district_id: number;
  cfc_name: string;
  district_name: string;
  status: number;
};

export type CfcLoginUser = CfcUser & {
  token: string;
};

export type CfcLoginResponse = {
  user: CfcLoginUser;
};

export type CfcProfileResponse = {
  user: CfcUser;
};
