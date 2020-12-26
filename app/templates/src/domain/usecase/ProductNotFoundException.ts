export class ProductNotFoundException {
  constructor() {
    const error = new Error('상품을 찾을 수 없습니다.')
    error.name = 'NotFoundError'

    throw error
  }
}
