import { IS3FileType } from '../types';

export interface IS3FileWithMetadata {
  host: string;
  key: string;
  name?: string;
  type?: IS3FileType;
  extension?: string;
  description?: string;
  duration?: number;
}

export interface IPhonenumber {
  country_code: string;
  number: string;
}
