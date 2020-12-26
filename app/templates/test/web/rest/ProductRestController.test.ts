import { Connection } from 'typeorm'
import request from 'supertest'
import Koa from 'koa'
import koa from '@infrastructure/koa'
import { initContainer } from '@container'
import { Product } from '@domain/entity/Product'
import InitDB from '../../support/InitDB'
import CleanDB from '../../support/cleanDB'

describe('API (WEB REST) :: products', () => {
  let dbConnection: Connection
  let app: Koa
  const productName = 'nike pants'
  const description = 'nike product'
  const price = 10000
  const isDisplay = true

  beforeAll(async () => {
    dbConnection = await InitDB()
    app = await koa(await initContainer())
  })

  afterAll(async () => {
    await dbConnection.close()
  })

  afterEach(async () => {
    await CleanDB()
  })

  describe('POST /products', () => {
    test('상품을 생성할 수 있다.', async () => {
      const newPrice = 20000

      const { status, body } = await request(app.callback())
        .post('/products')
        .send({ productName, description, price: newPrice, isDisplay })

      expect(status).toBe(200)
      expect(body.status).toBe('success')
      expect(body.data.productName).toBe(productName)
      expect(body.data.description).toBe(description)
      expect(body.data.price).toBe(newPrice)
      expect(body.data.isDisplay).toBe(isDisplay)
    })

    test('상품 가격이 0보다 작으면 예외를 반환한다.', async () => {
      const newPrice = -20000

      const { status, body } = await request(app.callback())
        .post('/products')
        .send({ productName, description, price: newPrice, isDisplay })

      expect(status).toBe(400)
      expect(body.status).toBe('error')
      expect(body.message).toBe('가격 정보가 올바르지 않습니다.')
    })

    test('상품 생성 필수 값이 없으면 예외를 반환한다.', async () => {
      const { status, body } = await request(app.callback())
        .post('/products')
        .send({ productName, description, isDisplay })

      expect(status).toBe(400)
      expect(body.status).toBe('error')
      expect(body.message).toContain('Invalid price')
    })
  })

  describe('GET /products', () => {
    test('상품 목록을 조회할 수 있다.', async () => {
      await new Product().create(productName, description, price, isDisplay).save()

      const { status, body } = await request(app.callback()).get('/products')

      expect(status).toBe(200)
      expect(body.status).toBe('success')
      expect(body.data.items[0].productName).toBe(productName)
      expect(body.data.total).toBe(1)
    })
  })

  describe('PATCH /products/:productId', () => {
    test('상품을 수정할 수 있다.', async () => {
      const productNameToModify = 'adidas pants'

      const product: Product = await new Product().create(productName, description, price, isDisplay).save()
      const { productId } = product

      const { status, body } = await request(app.callback())
        .patch(`/products/${productId}`)
        .send({ productName: productNameToModify, description, price, isDisplay })

      expect(status).toBe(200)
      expect(body.status).toBe('success')
      expect(body.data.productName).toBe(productNameToModify)
    })

    test('존재하지 않는 상품 요청 시 예외를 반환한다.', async () => {
      const { status, body } = await request(app.callback())
        .patch('/products/1')
        .send({ productName, description, price, isDisplay })

      expect(status).toBe(404)
      expect(body.status).toBe('error')
      expect(body.message).toBe('상품을 찾을 수 없습니다.')
    })

    test('상품 가격이 0보다 작으면 예외를 반환한다.', async () => {
      const product: Product = await new Product().create(productName, description, price, isDisplay).save()
      const { productId } = product

      const { status, body } = await request(app.callback())
        .patch(`/products/${productId}`)
        .send({ productName, description, price: -2000, isDisplay })

      expect(status).toBe(400)
      expect(body.status).toBe('error')
      expect(body.message).toBe('가격 정보가 올바르지 않습니다.')
    })
  })

  describe('DELETE /products/:productId', () => {
    test('상품을 삭제할 수 있다.', async () => {
      const product: Product = await new Product().create(productName, description, price, isDisplay).save()
      const { productId } = product

      const { status } = await request(app.callback()).delete(`/products/${productId}`)

      expect(status).toBe(204)
    })

    test('존재하지 않는 상품 요청 시 예외를 반환한다.', async () => {
      const { status, body } = await request(app.callback()).delete('/products/1')

      expect(status).toBe(404)
      expect(body.status).toBe('error')
      expect(body.message).toBe('상품을 찾을 수 없습니다.')
    })
  })
})
