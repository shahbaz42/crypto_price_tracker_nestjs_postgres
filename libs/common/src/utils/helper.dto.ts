import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class PhoneNumberDTO {


  @IsString()
  @IsNotEmpty()
  number: string;
}

export class S3FileWithMetadataDTO {
  @IsString()
  @IsNotEmpty()
  key: string;

  @IsString()
  @IsNotEmpty()
  host: string;

  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  extension?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  @IsOptional()
  duration?: number;
}
