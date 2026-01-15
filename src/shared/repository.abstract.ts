import { DeepPartial, ObjectLiteral, Repository } from 'typeorm';

export class AbstractRepository<T extends ObjectLiteral> {
  protected repository: Repository<T>;

  constructor(repository: Repository<T>) {
    this.repository = repository;
  }

  // Delegate all Repository methods
  async save(entity: T): Promise<T> {
    return this.repository.save(entity);
  }

  async find(): Promise<T[]> {
    return this.repository.find();
  }

  create(entityLike?: DeepPartial<T>): T {
    return this.repository.create(entityLike as DeepPartial<T>);
  }

  async findOne(options: any): Promise<T | null> {
    return this.repository.findOne(options);
  }

  async remove(entity: T): Promise<T> {
    return this.repository.remove(entity);
  }

  async update(criteria: any, partialEntity: Partial<T>): Promise<void> {
    await this.repository.update(criteria, partialEntity);
  }

  async delete(criteria: any): Promise<void> {
    await this.repository.delete(criteria);
  }
}
