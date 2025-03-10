// User Response
export type UserResponse = {
  data: UserResponseData;
  status: number;
  statusText: string;
};

export type UserResponseData = {
  data: DataUser;
};

export type DataUser = {
  username: string;
  name: string;
  token?: string;
};
