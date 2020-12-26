import { BaseEntity, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm'
import { ProductPriceException } from '@domain/entity/ProductPriceException'

@Entity('product')
export class Product extends BaseEntity {
  @PrimaryGeneratedColumn({ unsigned: true })
  productId!: number

  @Column('varchar', { length: 255, nullable: false })
  productName!: string

  @Column('varchar', { length: 500, nullable: false })
  description!: string

  @Column('decimal', { precision: 20, scale: 4, nullable: false })
  price!: number

  @Column('boolean', { nullable: false, default: false })
  isDisplay!: boolean

  @Column('boolean', { nullable: false, default: false })
  deleted!: boolean

  @CreateDateColumn({ type: 'datetime' })
  createdAt!: Date

  @UpdateDateColumn({ type: 'datetime' })
  updatedAt!: Date

  @Column({ type: 'datetime' })
  deletedAt!: Date

  public create(productName: string, description: string, price: number, isDisplay: boolean): Product {
    const product: Product = new Product()
    product.productName = productName
    product.description = description
    product.price = price
    product.isDisplay = isDisplay

    return product
  }

  public validatePrice(): void {
    if (this.price < 0) {
      throw new ProductPriceException()
    }
  }
}
