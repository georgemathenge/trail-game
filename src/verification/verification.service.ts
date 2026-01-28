import { Injectable } from '@nestjs/common';
import { CreateVerificationDto } from './dto/create-verification.dto.js';
import { UpdateVerificationDto } from './dto/update-verification.dto.js';

@Injectable()
export class VerificationService {
  emailVerification(createVerificationDto: CreateVerificationDto) {
    return 'This action adds a new verification';
  }

  findAll() {
    return `This action returns all verification`;
  }

  findOne(id: number) {
    return `This action returns a #${id} verification`;
  }

  update(id: number, updateVerificationDto: UpdateVerificationDto) {
    return `This action updates a #${id} verification`;
  }

  remove(id: number) {
    return `This action removes a #${id} verification`;
  }
}
