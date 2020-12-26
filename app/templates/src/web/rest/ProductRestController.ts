import { Context } from 'koa'
import { route, POST, GET, PATCH, DELETE } from 'awilix-koa'
import ProductService from '@domain/usecase/ProductService'
import { Product } from '@domain/entity/Product'
import util from 'util'

@route('/products')
export default class ProductRestController {
  private readonly productService: ProductService

  constructor(productService: ProductService) {
    this.productService = productService
  }

  @POST()
  public createProduct = async (ctx: Context): Promise<Context> => {
    try {
      await this.validateProduct(ctx)

      const {
        productName,
        description,
        price,
        isDisplay,
      }: { productName: string; description: string; price: number; isDisplay: boolean } = ctx.request.body

      const product: Product = await this.productService.createProduct(productName, description, price, isDisplay)

      return ctx.success({ ...product })
    } catch (error) {
      if (error.name === 'ValidationError') {
        return ctx.throw(400, error.message)
      }

      throw error
    }
  }

  @GET()
  public findProducts = async (ctx: Context): Promise<Context> => {
    const { start = 0, count = 10 }: { start: number; count: number } = ctx.request.query

    const [items, total]: [Product[], number] = await this.productService.findProducts(start, count)

    return ctx.success({ items, start, count, total })
  }

  @PATCH()
  @route('/:productId')
  public updateProduct = async (ctx: Context): Promise<Context> => {
    try {
      await this.validateProduct(ctx)
      await this.validateProductId(ctx)

      const {
        productName,
        description,
        price,
        isDisplay,
      }: { productName: string; description: string; price: number; isDisplay: boolean } = ctx.request.body
      const { productId } = ctx.params

      const product: Product = await this.productService.updateProduct(
        productId,
        productName,
        description,
        price,
        isDisplay,
      )

      return ctx.success({ ...product })
    } catch (error) {
      if (error.name === 'ValidationError') {
        return ctx.throw(400, error.message)
      }

      if (error.name === 'NotFoundError') {
        return ctx.throw(404, error.message)
      }

      throw error
    }
  }

  @DELETE()
  @route('/:productId')
  public deleteProduct = async (ctx: Context): Promise<Context> => {
    try {
      await this.validateProductId(ctx)

      const { productId } = ctx.params

      await this.productService.deleteProduct(productId)

      ctx.status = 204
      return ctx
    } catch (error) {
      if (error.name === 'NotFoundError') {
        return ctx.throw(404, error.message)
      }

      throw error
    }
  }

  private validateProduct = async (ctx): Promise<void> => {
    ctx.checkBody('productName', 'Invalid productName').notEmpty()
    ctx.checkBody('description', 'Invalid description').notEmpty()
    ctx.checkBody('price', 'Invalid price').notEmpty().isInt()
    ctx.checkBody('isDisplay', 'Invalid isDisplay').notEmpty()

    const errors = await ctx.validationErrors()

    if (errors) {
      ctx.throw(400, `There have been validation errors: ${util.inspect(errors)}`)
    }
  }

  private validateProductId = async (ctx): Promise<void> => {
    ctx.checkParams('productId').notEmpty().isInt()

    const errors = await ctx.validationErrors()

    if (errors) {
      ctx.throw(400, `There have been validation errors: ${util.inspect(errors)}`)
    }
  }
}
