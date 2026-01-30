import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { MailService } from '../services/mail/mail.service.js';
import { RegisterDto, UserRole } from './dto/register.dto.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { LoginDto } from './dto/login.dto.js';
import * as bcrypt from 'bcryptjs';
@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private mailService: MailService,
  ) {}

  async register(registerDto: RegisterDto) {
    const { email, password, firstName, lastName, phone, role } = registerDto;

    // Check if user already exists
    const existingUser = await this.prisma.users.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new ConflictException('Email already registered');
    }

    // Check if phone already exists (if provided)
    if (phone) {
      const existingPhone = await this.prisma.users.findUnique({
        where: { phone },
      });

      if (existingPhone) {
        throw new ConflictException('Phone number already registered');
      }
    }

    // Hash password
    const saltRounds = 10;

    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Create user
    const user = await this.prisma.users.create({
      data: {
        email,
        password_hash: passwordHash,
        first_name: firstName,
        last_name: lastName,
        phone,
        role: role || UserRole.PLAYER,
        email_verified: false,
      },
      select: {
        id: true,
        email: true,
        first_name: true,
        last_name: true,
        role: true,
        created_at: true,
      },
    });
    const token = this.generateToken(user.id, user.email, user.role);

    await this.mailService.sendVerificationEmail(user.email, token);

    return {
      user,
      token,
    };
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    // Find user

    const user = await this.prisma.users.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        password_hash: true,
        first_name: true,
        last_name: true,
        role: true,
        is_active: true,
        is_banned: true,
      },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Check if user is banned
    if (user.is_banned) {
      throw new UnauthorizedException('Account has been banned');
    }

    // Check if user is active
    if (!user.is_active) {
      throw new UnauthorizedException('Account is inactive');
    }

    // Verify password

    const isPasswordValid = await bcrypt.compare(password, user.password_hash);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Update last login
    await this.prisma.users.update({
      where: { id: user.id },
      data: { last_login_at: new Date() },
    });

    // Generate JWT token
    const token = this.generateToken(user.id, user.email, user.role);

    const { password_hash: _password_hash, ...userWithoutPassword } = user;

    return {
      user: userWithoutPassword,
      token,
    };
  }

  async validateUser(userId: string) {
    const user = await this.prisma.users.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        first_name: true,
        last_name: true,
        role: true,
        is_active: true,
        is_banned: true,
      },
    });

    if (!user || user.is_banned || !user.is_active) {
      throw new UnauthorizedException('Invalid user');
    }

    return user;
  }

  private generateToken(userId: string, email: string, role: string): string {
    const payload = {
      sub: userId,
      email,
      role,
    };

    return this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET || 'your-secret-key-change-in-production',
    });
  }

  async refreshToken(userId: any) {
    const user = await this.validateUser(userId);
    return this.generateToken(user.id, user.email, user.role);
  }

  async markEmailAsVerified(userId: string, token: string) {
    await this.prisma.users.update({
      where: { id: userId },
      data: { email_verified: true, verification_token: token },
    });
  }
  async findUserById(userId: string) {
    return this.prisma.users.findUnique({
      where: { id: userId },
    });
  }
}

export interface AuthDto {
  register(registerDto: RegisterDto): Promise<{
    user: any;
    token: string;
  }>;
  login(loginDto: LoginDto): Promise<{
    user: any;
    token: string;
  }>;
  validateUser(userId: string): Promise<any>;
  refreshToken(userId: any): Promise<string>;
}
