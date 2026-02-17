import {
  IsString,
  IsOptional,
  IsUUID,
  IsInt,
  IsBoolean,
  IsDateString,
  IsNumber,
  IsJSON,
  MaxLength,
  Min,
  Matches,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateGameDto {
  @IsOptional()
  @IsUUID()
  creator_id: string;

  @IsOptional()
  @IsUUID()
  location_id?: string;

  @IsString()
  @MaxLength(255)
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsString()
  @MaxLength(50)
  game_type: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  template_id?: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  game_environment?: string = 'outdoor';
  @IsDateString()
  scheduled_date: string;

  @IsString()
  @Matches(/^([0-9]|0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/, {
    message: 'scheduled_time must be in HH:mm format',
  })
  scheduled_time: string;

  @IsInt()
  @Min(1)
  duration_minutes: number;

  @IsOptional()
  @IsDateString()
  registration_deadline?: string;

  @IsInt()
  @Min(1)
  max_participants: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  min_participants?: number = 1;

  @IsOptional()
  @IsBoolean()
  is_team_based?: boolean = false;

  @IsOptional()
  @IsInt()
  team_size?: number;

  @IsOptional()
  @IsInt()
  max_teams?: number;

  @IsOptional()
  @IsNumber()
  entry_fee?: number;

  @IsOptional()
  @IsString()
  @MaxLength(3)
  currency?: string = 'KES';

  @IsOptional()
  @IsBoolean()
  is_free?: boolean = true;

  @IsOptional()
  game_config?: any; // Represents Json type

  @IsOptional()
  @IsString()
  rules?: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  status?: string = 'draft';

  @IsOptional()
  @IsBoolean()
  is_featured?: boolean = false;

  @IsOptional()
  @IsBoolean()
  is_private?: boolean = false;

  @IsOptional()
  @IsString()
  cancellation_policy?: string;

  @IsOptional()
  @IsDateString()
  can_cancel_until?: string;

  checkpoints: CheckPoint[];
}

export interface CheckPoint {
  title: string;
  clue: string;
  task: string; // Still required by your logic
  points: number;
  latitude: number; // Flat value
  longitude: number; // Flat value
  verificationType: 'photo' | 'gps' | 'quiz' | 'qr';
  hint?: string;
  trail_marker_id: string;
}
