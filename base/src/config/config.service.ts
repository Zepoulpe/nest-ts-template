import { Injectable } from '@nestjs/common';
import { AppConfig } from './config.schema';
import { loadConfig } from './config.loader';

@Injectable()
export class AppConfigService {
  private readonly config: AppConfig;

  constructor() {
    this.config = loadConfig();
  }

  get<K extends keyof AppConfig>(key: K): AppConfig[K] {
    return this.config[key];
  }

  get isProd(): boolean {
    return this.config.NODE_ENV === 'production';
  }

  get isDev(): boolean {
    return this.config.NODE_ENV === 'development';
  }
}
