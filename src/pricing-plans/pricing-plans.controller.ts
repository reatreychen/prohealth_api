import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PricingPlansService } from './pricing-plans.service';
import { CreatePricingPlanDto } from './dto/create-pricing-plan.dto';
import { UpdatePricingPlanDto } from './dto/update-pricing-plan.dto';

@Controller('pricing-plans')
export class PricingPlansController {
  constructor(private readonly pricingPlansService: PricingPlansService) {}

  @Post()
  create(@Body() createPricingPlanDto: CreatePricingPlanDto) {
    return this.pricingPlansService.create(createPricingPlanDto);
  }

  @Get()
  findAll() {
    return this.pricingPlansService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.pricingPlansService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePricingPlanDto: UpdatePricingPlanDto) {
    return this.pricingPlansService.update(+id, updatePricingPlanDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.pricingPlansService.remove(+id);
  }
}
