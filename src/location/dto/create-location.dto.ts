import {
  IsString,
  IsNumber,
  IsBoolean,
  IsOptional,
  IsArray,
} from 'class-validator';

export class CreateLocationDto {
  @IsString()
  //   @ApiProperty({ description: 'Name of the location' })
  name: string;

  @IsOptional()
  @IsString()
  //   @ApiProperty({ required: false })
  description?: string;

  @IsOptional()
  @IsString()
  //   @ApiProperty({ required: false })
  address?: string;

  @IsOptional()
  @IsString()
  //   @ApiProperty({ required: false })
  city?: string;

  @IsOptional()
  @IsString()
  //   @ApiProperty({ default: 'Kenya' })
  country?: string;

  @IsNumber()
  @IsNumber({ maxDecimalPlaces: 2 })
  //   @ApiProperty({ type: 'number', format: 'decimal', maximum: 99.99999999 })
  latitude: number;

  @IsNumber()
  @IsNumber({ maxDecimalPlaces: 2 })
  //   @ApiProperty({ type: 'number', format: 'decimal', maximum: 180.99999999 })
  longitude: number;

  @IsOptional()
  @IsString()
  //   @ApiProperty({ enum: ['easy', 'medium', 'hard'], required: false })
  difficulty_level?: string;

  @IsOptional()
  @IsNumber()
  @IsNumber({ maxDecimalPlaces: 2 })
  //   @ApiProperty({ required: false })
  total_area_km?: number;

  @IsOptional()
  @IsNumber()
  //   @ApiProperty({ required: false })
  elevation_min?: number;

  @IsOptional()
  @IsNumber()
  //   @ApiProperty({ required: false })
  elevation_max?: number;

  @IsOptional()
  @IsString()
  //   @ApiProperty({ format: 'url', required: false })
  cover_image_url?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  //   @ApiProperty({ type: [String], required: false })
  images_urls?: string[];

  @IsOptional()
  @IsBoolean()
  //   @ApiProperty({ default: false })
  has_parking?: boolean;

  @IsOptional()
  @IsBoolean()
  //   @ApiProperty({ default: false })
  has_restrooms?: boolean;

  @IsOptional()
  @IsBoolean()
  //   @ApiProperty({ default: false })
  has_water?: boolean;

  @IsOptional()
  @IsNumber()
  //   @IsDecimal({ precision: 10, scale: 2 })
  //   @ApiProperty({ default: 0.0 })
  entry_fee?: number;

  @IsOptional()
  //   @ApiProperty({ type: 'string', format: 'time', required: false })
  opening_time?: Date;

  @IsOptional()
  //   @ApiProperty({ type: 'string', format: 'time', required: false })
  closing_time?: Date;

  @IsOptional()
  @IsBoolean()
  //   @ApiProperty({ default: false })
  is_open_24_7?: boolean;

  @IsOptional()
  @IsBoolean()
  //   @ApiProperty({ default: true })
  is_active?: boolean;
}
