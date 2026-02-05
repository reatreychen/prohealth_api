import { Module } from '@nestjs/common';
import { PricingPlansService } from './pricing-plans.service';
import { PricingPlansController } from './pricing-plans.controller';

import { TypeOrmModule } from '@nestjs/typeorm';
import { PricingPlan } from './entities/pricing-plan.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PricingPlan])],
  controllers: [PricingPlansController],
  providers: [PricingPlansService],
})
export class PricingPlansModule { }
