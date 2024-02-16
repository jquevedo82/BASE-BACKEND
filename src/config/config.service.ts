import { TypeOrmModuleOptions } from '@nestjs/typeorm';


// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();

class ConfigService {
  constructor(private env: { [k: string]: string | undefined }) {}

  getValue(key: string, throwOnMissing = true): string {
    const value = this.env[key];
    if (!value && throwOnMissing) {
      throw new Error(`config error - missing env.${key}`);
    }

    return value;
  }

  public ensureValues(keys: string[]) {
    keys.forEach((k) => this.getValue(k, true));
    return this;
  }

  public getTypeOrmConfig(): TypeOrmModuleOptions {
    return {
      //type: 'postgres',
      type: 'mysql',
      //type: this.getValue('TUTORIAL_CONNECTION'),
      host: this.getValue('TUTORIAL_HOST'),
      port: parseInt(this.getValue('TUTORIAL_PORT')),
      username: this.getValue('TUTORIAL_USER'),
      //password: this.getValue('TUTORIAL_PASSWORD'),
      database: this.getValue('TUTORIAL_DATABASE'),

      entities: ['dist/**/*.entity.js'],
      autoLoadEntities: true,
      //entities: [Cliente, Usuario, Rol, Pais, Localidad],
      //synchronize: false,
      synchronize: false,
      logging: false,
      //options: { encrypt: false },
    };
  }
}

const configService = new ConfigService(process.env).ensureValues([
  'TUTORIAL_HOST',
  'TUTORIAL_PORT',
  'TUTORIAL_USER',
  // 'TUTORIAL_PASSWORD',
  'TUTORIAL_DATABASE',
]);

export { configService };
