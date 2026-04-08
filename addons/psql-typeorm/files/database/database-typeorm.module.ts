import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppConfigService } from '@config/config.service';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      inject: [AppConfigService],
      useFactory: (configService: AppConfigService) => {
        const pg = configService.get('postgres');
        return {
          type: 'postgres' as const,
          host: pg.host,
          port: pg.port,
          username: pg.username,
          password: pg.password,
          database: pg.database,
          ssl: pg.ssl ? { rejectUnauthorized: false } : false,
          autoLoadEntities: true,
          synchronize: false,
          migrationsTableName: 'migrations_typeorm',
          migrations: ['dist/src/database/migrations/*.js'],
          logging: ['error', 'warn'],
        };
      },
    }),
  ],
})
export class DatabaseTypeormModule {}
