import { ChipClient } from '../lib/chipClient.js'
import { PayloadHandler, PayloadRequest } from 'payload'

export const createPaymentEndpoint: PayloadHandler = async (req: PayloadRequest) => {
  try {
    const data = (await req.json?.()) || {}

    const { purchase, client } = data

    const chipClient = await ChipClient.initialize(req.payload)
    const payment = await chipClient.createPurchase({
      purchase,
      client,
      brand_id: chipClient.getBrandId(),
    })

    return Response.json(payment, { status: 200 })
  } catch (error) {
    console.error('Payment creation error:', error)
    return Response.json(
      {
        error: error instanceof Error ? error.message : 'Failed to create payment',
      },
      { status: 500 },
    )
  }
}
