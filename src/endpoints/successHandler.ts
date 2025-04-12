import { ChipClient } from '../lib/chipClient.js'
import { PayloadHandler, PayloadRequest } from 'payload'

export const successHandler: PayloadHandler = async (req: PayloadRequest) => {
  try {
    const signature = req.headers.get('X-Signature')
    if (!signature) {
      return Response.json({ error: 'Missing signature' }, { status: 400 })
    }

    const purchase = (await req.json?.()) || {}

    const chipClient = await ChipClient.initialize(req.payload)

    // Verify payment status
    const verifiedPurchase = await chipClient.getPurchase(purchase.id)
    if (verifiedPurchase.status !== 'paid') {
      return Response.json({ error: 'Payment not completed' }, { status: 400 })
    }

    // Handle successful payment
    // TODO: Update order status, send confirmation email, etc.

    return Response.json({ success: true }, { status: 200 })
  } catch (error) {
    console.error('Success handler error:', error)
    return Response.json(
      {
        error: error instanceof Error ? error.message : 'Failed to process success callback',
      },
      { status: 500 },
    )
  }
}
