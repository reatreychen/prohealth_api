import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PricingPlan } from './entities/pricing-plan.entity';
import { CreatePricingPlanDto } from './dto/create-pricing-plan.dto';
import { UpdatePricingPlanDto } from './dto/update-pricing-plan.dto';

@Injectable()
export class PricingPlansService {
  constructor(
    @InjectRepository(PricingPlan)
    private readonly pricingPlanRepository: Repository<PricingPlan>,
  ) { }

  async create(createPricingPlanDto: CreatePricingPlanDto) {
    const plan = this.pricingPlanRepository.create(createPricingPlanDto);
    const saved = await this.pricingPlanRepository.save(plan);
    return {
      success: true,
      message: 'Pricing plan created successfully',
      data: saved,
    };
  }

  async findAll() {
    const plans = await this.pricingPlanRepository.find({
      order: { createdAt: 'DESC' },
    });
    return {
      success: true,
      data: plans,
    };
  }

  async findOne(id: string) {
    const plan = await this.pricingPlanRepository.findOne({ where: { id } });
    if (!plan) {
      throw new NotFoundException(`Pricing plan with ID ${id} not found`);
    }
    return {
      success: true,
      data: plan,
    };
  }

  async update(id: string, updatePricingPlanDto: UpdatePricingPlanDto) {
    const plan = await this.pricingPlanRepository.preload({
      id: id,
      ...updatePricingPlanDto,
    });
    if (!plan) {
      throw new NotFoundException(`Pricing plan with ID ${id} not found`);
    }
    const saved = await this.pricingPlanRepository.save(plan);
    return {
      success: true,
      message: 'Pricing plan updated successfully',
      data: saved,
    };
  }

  async remove(id: string) {
    const planRes = await this.findOne(id);
    await this.pricingPlanRepository.remove(planRes.data);
    return {
      success: true,
      message: 'Pricing plan deleted successfully',
    };
  }
}
