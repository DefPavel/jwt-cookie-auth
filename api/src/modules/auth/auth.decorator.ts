import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/guards/jwt.guard';

export const Auth = () => UseGuards(JwtAuthGuard);
