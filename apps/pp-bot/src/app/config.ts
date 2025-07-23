import { ConfigModule, ConfigService } from '@nestjs/config';
import { TelegrafModuleAsyncOptions } from 'nestjs-telegraf/dist/interfaces';
import { session } from 'telegraf';
import { Logger } from '@nestjs/common';

export const TelegrafConfig: TelegrafModuleAsyncOptions = {
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: (cs: ConfigService) => {
    const token = cs.getOrThrow('TELEGRAM_BOT_TOKEN');
    Logger.log('Obtained TELEGRAM_BOT_TOKEN from ConfigService:', token);
    return {
      middlewares: [session()],
      options:
        cs.getOrThrow('TELEGRAM_BOT_TEST_ENV', '0') === '1'
          ? {
              telegram: {
                testEnv: true,
              },
            }
          : {},
      token: token,
    };
  },
};
