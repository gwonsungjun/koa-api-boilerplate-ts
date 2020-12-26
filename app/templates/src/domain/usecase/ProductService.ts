import { Product } from '@domain/entity/Product'
import { ProductNotFoundException } from '@domain/usecase/ProductNotFoundException'

export default class ProductService {
  public createProduct = async (
    productName: string,
    description: string,
    price: number,
    isDisplay: boolean,
  ): Promise<Product> => {
    const product: Product = new Product().create(productName, description, price, isDisplay)
    product.validatePrice()

    return product.save()
  }

  public findProducts = async (start: number, count: number): Promise<[Product[], number]> =>
    Product.findAndCount({ skip: start, take: count })

  public updateProduct = async (
    productId: number,
    productName: string,
    description: string,
    price: number,
    isDisplay: boolean,
  ): Promise<Product> => {
    const product: Product = await ProductService.findProduct(productId)
    product.productName = productName
    product.description = description
    product.price = price
    product.isDisplay = isDisplay

    product.validatePrice()

    return product.save()
  }

  public deleteProduct = async (productId: number): Promise<void> => {
    const product: Product = await ProductService.findProduct(productId)
    await product.remove()
  }

  private static async findProduct(productId: number) {
    const product: Product | undefined = await Product.findOne({ productId })

    if (!product) {
      throw new ProductNotFoundException()
    }

    return product
  }
}
