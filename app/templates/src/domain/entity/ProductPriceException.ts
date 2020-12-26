export class ProductPriceException {
  constructor() {
    const error = new Error('가격 정보가 올바르지 않습니다.')
    error.name = 'ValidationError'

    throw error
  }
}
