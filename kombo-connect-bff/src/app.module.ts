import { Module } from '@nestjs/common';
import { CompaniesModule } from './companies/companies.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Company } from './companies/company.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL,
      entities: [Company],
      synchronize: true, // Forcer la synchronisation
      autoLoadEntities: true,
      ssl:
        process.env.NODE_ENV === 'production'
          ? { rejectUnauthorized: false }
          : false,
    }),

    ConfigModule.forRoot({ isGlobal: true }),
    CompaniesModule,
  ],
})
export class AppModule {}
