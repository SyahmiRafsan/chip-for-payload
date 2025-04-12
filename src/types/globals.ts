import { GlobalConfig } from 'payload'

export type ChipPaymentConfig = {
  /**
   * CHIP Brand ID for payment processing
   */
  brandId: string
  /**
   * CHIP Secret Key for API authentication
   */
  secretKey: string
  /**
   * Enable/disable CHIP payment processing
   */
  enabled: boolean
}

export const chipPaymentGlobal: GlobalConfig = {
  slug: 'chip-payment-config',
  access: {
    read: ({ req: { user } }) => Boolean(user),
    update: ({ req: { user } }) => Boolean(user),
  },
  fields: [
    {
      name: 'brandId',
      type: 'text',
      required: true,
      admin: {
        description: 'Your CHIP Brand ID',
      },
    },
    {
      name: 'secretKey',
      type: 'text',
      required: true,
      admin: {
        description: 'Your CHIP Secret Key',
      },
    },
    {
      name: 'enabled',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'Enable CHIP payment processing',
      },
    },
  ],
}
