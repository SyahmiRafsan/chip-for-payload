import { Payload } from 'payload'
import { ChipPaymentConfig } from '../types/globals.js'
import { ChipPurchaseRequest, ChipPurchaseResponse } from '../types/chip.js'
import crypto from 'crypto'

export class ChipClient {
  private brandId: string
  private secretKey: string
  private enabled: boolean
  private baseUrl = 'https://gate.chip-in.asia/api/v1'

  constructor(config: ChipPaymentConfig) {
    this.brandId = config.brandId
    this.secretKey = config.secretKey
    this.enabled = config.enabled
  }

  getBrandId(): string {
    return this.brandId
  }

  private async request(endpoint: string, options: RequestInit = {}) {
    if (!this.enabled) {
      throw new Error('CHIP payments are not enabled')
    }

    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.secretKey}`,
      // 'X-Brand-ID': this.brandId,
    }

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers: {
        ...headers,
        ...options.headers,
      },
    })

    if (!response.ok) {
      throw new Error(`CHIP API error: ${response.statusText}`)
    }

    return response.json()
  }

  async createPurchase(request: ChipPurchaseRequest): Promise<ChipPurchaseResponse> {
    return this.request('/purchases/create', {
      method: 'POST',
      body: JSON.stringify({
        ...request,
        currency: request.currency || 'MYR',
        success_callback:
          request.success_callback ||
          `${process.env.NEXT_PUBLIC_SERVER_URL}/api/chip/success-callback`,
        // TODO implement redirects, callbacks and webhooks
      }),
    })
  }

  async getPurchase(purchaseId: string): Promise<ChipPurchaseResponse> {
    return this.request(`/purchases/${purchaseId}`)
  }

  async refundPurchase(purchaseId: string, amount?: number): Promise<ChipPurchaseResponse> {
    return this.request(`/purchases/${purchaseId}/refund`, {
      method: 'POST',
      body: JSON.stringify({ amount }),
    })
  }

  validateWebhook(payload: any, signature: string): boolean {
    const hmac = crypto.createHmac('sha256', this.secretKey)
    const computedSignature = hmac.update(JSON.stringify(payload)).digest('hex')
    return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(computedSignature))
  }

  static async initialize(payload: Payload) {
    const config = (await payload.findGlobal({
      slug: 'chip-payment-config',
    })) as ChipPaymentConfig

    return new ChipClient(config)
  }
}
