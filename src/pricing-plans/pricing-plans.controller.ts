import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { PricingPlansService } from './pricing-plans.service';
import { CreatePricingPlanDto } from './dto/create-pricing-plan.dto';
import { UpdatePricingPlanDto } from './dto/update-pricing-plan.dto';
import { AcessJwtGuard } from '../auth/guards/access-jwt.guard';
import { Public } from '../shared/decorators/public.decorator';

@Controller('pricing-plans')
export class PricingPlansController {
  constructor(private readonly pricingPlansService: PricingPlansService) { }

  @Post()
  @UseGuards(AcessJwtGuard)
  create(@Body() createPricingPlanDto: CreatePricingPlanDto) {
    return this.pricingPlansService.create(createPricingPlanDto);
  }

  @Get()
  @Public() // Pricing plans usually public for customers to see, but we can restrict if needed. 
  // For the admin UI, we'll keep it public for now to avoid auth issues while testing, 
  // but usually admin list would be guarded.
  findAll() {
    return this.pricingPlansService.findAll();
  }

  @Get(':id')
  @Public()
  findOne(@Param('id') id: string) {
    return this.pricingPlansService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(AcessJwtGuard)
  update(@Param('id') id: string, @Body() updatePricingPlanDto: UpdatePricingPlanDto) {
    return this.pricingPlansService.update(id, updatePricingPlanDto);
  }

  @Delete(':id')
  @UseGuards(AcessJwtGuard)
  remove(@Param('id') id: string) {
    return this.pricingPlansService.remove(id);
  }
}
