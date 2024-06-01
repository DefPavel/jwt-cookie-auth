import { ConfigService } from '@nestjs/config';
import { ApplicationOption } from 'src/common/types/application-options';

export const getJwtConfig = async (
  configService: ConfigService,
): Promise<ApplicationOption> => ({
  EXPIRE_DAY_REFRESH_TOKEN: Number(
    configService.get('EXPIRE_DAY_REFRESH_TOKEN'),
  ),
  REFRESH_TOKEN_NAME: configService.get('REFRESH_TOKEN_NAME'),
});
