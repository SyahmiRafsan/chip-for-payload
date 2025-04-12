import { PayloadHandler, PayloadRequest } from 'payload'
import { ChipClient } from '../lib/chipClient.js'

export const webhookHandler: PayloadHandler = async (req: PayloadRequest) => {
  try {
    if (req.method !== 'POST') {
      return Response.json({ error: 'Method not allowed' }, { status: 405 })
    }

    const signature = req.headers.get('x-signature')
    if (!signature) {
      return Response.json({ error: 'Missing signature' }, { status: 400 })
    }

    const payload = (await req.json?.()) || {}
    const chipClient = await ChipClient.initialize(req.payload)

    if (!chipClient.validateWebhook(payload, signature)) {
      return Response.json({ error: 'Invalid signature' }, { status: 400 })
    }

    // Handle different webhook events
    switch (payload.event) {
      case 'purchase.paid':
        // Handle successful payment
        console.log('Payment successful:', payload.purchase.id)
        return Response.json({ success: true, id: payload.purchase.id, status: 'paid' })
      case 'purchase.failed':
        // Handle failed payment
        console.log('Payment failed:', payload.purchase.id)
        return Response.json({ success: false, id: payload.purchase.id, status: 'failed' })
      case 'purchase.expired':
        // Handle expired payment
        console.log('Payment expired:', payload.purchase.id)
        return Response.json({ success: false, id: payload.purchase.id, status: 'expired' })
      default:
        return Response.json({ success: false, error: 'Unknown event type' }, { status: 400 })
    }
  } catch (error) {
    console.error('Webhook processing error:', error)
    return Response.json(
      { error: error instanceof Error ? error.message : 'Failed to process webhook' },
      { status: 500 },
    )
  }
}
