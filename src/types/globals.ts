import { GlobalAfterReadHook, GlobalConfig } from 'payload'

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

export const chipPaymentGlobal = (config?: ChipPaymentConfig): GlobalConfig => ({
  slug: 'chip-payment-config',
  label: 'CHIP Settings',
  access: {
    read: ({ req: { user } }) => Boolean(user),
    update: ({ req: { user } }) => Boolean(user),
  },
  hooks: {
    afterRead: [
      ({ doc }): GlobalAfterReadHook => {
        if (doc) {
          if (doc.brandId) {
            doc.brandId = doc.brandId.slice(0, 4) + '****' + doc.brandId.slice(-4)
          }
          if (doc.secretKey) {
            doc.secretKey = doc.secretKey.slice(0, 8) + '****' + doc.secretKey.slice(-8)
          }
        }
        return doc
      },
    ],
  },
  fields: [
    {
      name: 'brandId',
      label: 'CHIP Brand ID',
      type: 'text',
      defaultValue: config?.brandId,
      admin: {
        description: 'Your CHIP Brand ID',
        placeholder: 'f93c10f1-0641-4d6d-ba39-bdaf3c2ab3cb',
      },
    },
    {
      name: 'secretKey',
      label: 'CHIP Secret Key',
      type: 'text',
      defaultValue: config?.secretKey,
      admin: {
        description: 'Your CHIP Secret Key',
        placeholder:
          'ASoxOlidFZvPGj1YG58TY2ya0lZfxdy57eddP5C9Ndwdh_snIYSkInSXj_tcc9PnuEkeErc75Hrvf8bgZzcWow==',
      },
    },
    {
      name: 'enabled',
      type: 'checkbox',
      defaultValue: config?.enabled ?? true,
      admin: {
        description: 'Enable CHIP payment plugin',
      },
    },
    {
      name: 'testPurchase',
      type: 'ui',
      label: 'Create a purchase to test settings',
      admin: {
        components: {
          Field: 'chip-for-payload/client#TestButton',
        },
      },
    },
  ],
})
