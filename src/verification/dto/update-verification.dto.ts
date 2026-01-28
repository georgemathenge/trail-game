import { PartialType } from '@nestjs/mapped-types';
import { CreateVerificationDto } from './create-verification.dto.js';

export class UpdateVerificationDto extends PartialType(CreateVerificationDto) {}
