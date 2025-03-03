import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateIf,
} from 'class-validator';

export class PaginationAndOrderDTO {
  @ApiProperty({
    description: 'Limit the number of results returned',
    type: Number,
    required: false,
    example: 10,
  })
  @IsString()
  @IsOptional()
  limit?: number;

  @ApiProperty({
    description: 'Number of records to skip (for pagination)',
    type: Number,
    required: false,
    example: 0,
  })
  @IsString()
  @IsOptional()
  skip?: number;

  @ApiProperty({
    description: 'Field name to order results by',
    type: String,
    required: false,
    example: 'created_at',
  })
  @IsString()
  @IsOptional()
  order_by?: string;

  @ApiProperty({
    description: 'Sorting order (ASC or DESC)',
    enum: ['ASC', 'DESC'],
    required: false,
    example: 'ASC',
  })
  @ValidateIf((o) => o.order_by)
  @IsEnum(['ASC', 'DESC'])
  @IsNotEmpty()
  order?: 'ASC' | 'DESC';
}
