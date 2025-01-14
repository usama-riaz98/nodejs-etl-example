export type MessageResponse = {
  message: string;
};

export type UniversityData = {
  name: string;
  domains: string[];
  web_pages: string[];
  alpha_two_code: string;
  country: string;
  'state-province': string;
};

export type ErrorResponse = {
  path: string;
  statusCode: number;
  message: string;
  timestamp: string;
};
