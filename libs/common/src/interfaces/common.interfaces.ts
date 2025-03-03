export interface IS3FileWithMetadata {
  host: string;
  key: string;
  name?: string;
  extension?: string;
  description?: string;
  duration?: number;
}

export interface IPhonenumber {
  country_code: string;
  number: string;
}
