import type { Config } from 'payload'
import { chipPaymentGlobal } from './types/globals.js'
import { createPaymentEndpoint } from './endpoints/createPurchase.js'
import { webhookHandler } from './endpoints/webhookHandler.js'
import { successHandler } from './endpoints/successHandler.js'

export type ChipForPayloadConfig = {
  /**
   * Your CHIP Brand ID for payment processing
   * @example "f93c10f1-0641-4d6d-ba39-bdaf3c2ab3cb"
   */
  brandId?: string

  /**
   * Your CHIP Secret Key for API authentication
   * @example "ASoxOlidFZvPGj1YG58TY2ya0lZfxdy57eddP5C9Ndwdh_snIYSkInSXj_tcc9PnuEkeErc75Hrvf8bgZzcWow=="
   */
  secretKey?: string

  /**
   * Enable/disable CHIP payment processing
   * When disabled, the plugin will maintain database schema but won't process payments
   * @default false
   */
  disabled?: boolean
}

export const chipForPayload =
  (pluginOptions: ChipForPayloadConfig) =>
  (config: Config): Config => {
    config.globals = [
      ...(config.globals || []),
      chipPaymentGlobal({
        brandId: pluginOptions.brandId ?? '',
        secretKey: pluginOptions.secretKey ?? '',
        enabled: !pluginOptions.disabled,
      }),
    ]

    config.collections = [
      ...(config.collections || []),
      // Example collection code - commented out for reference
      // This was an example implementation showing how to add collections
      // {
      //   slug: 'plugin-collection',
      //   fields: [
      //     {
      //       name: 'id',
      //       type: 'text',
      //     },
      //   ],
      // }
    ]

    // if (pluginOptions.collections) {
    //   for (const collectionSlug in pluginOptions.collections) {
    //     const collection = config.collections.find(
    //       (collection) => collection.slug === collectionSlug,
    //     )

    //     if (collection) {
    //       collection.fields.push({
    //         name: 'addedByPlugin',
    //         type: 'text',
    //         admin: {
    //           position: 'sidebar',
    //         },
    //       })
    //     }
    //   }
    // }

    /**
     * If the plugin is disabled, we still want to keep added collections/fields so the database schema is consistent which is important for migrations.
     * If your plugin heavily modifies the database schema, you may want to remove this property.
     */
    if (pluginOptions.disabled) {
      return config
    }

    config.endpoints = [
      ...(config.endpoints || []),
      {
        handler: createPaymentEndpoint,
        method: 'post',
        path: '/chip/purchases/create',
      },
      {
        handler: successHandler,
        method: 'post',
        path: '/chip/callback/success',
      },
      {
        handler: webhookHandler,
        method: 'post',
        path: '/chip/webhook',
      },
    ]

    config.admin = {
      ...(config.admin || {}),
      components: {
        ...(config.admin?.components || {}),
        // beforeDashboard: [
        //   ...(config.admin?.components?.beforeDashboard || []),
        //   `chip-for-payload/client#BeforeDashboardClient`,
        //   `chip-for-payload/rsc#BeforeDashboardServer`,
        // ],
      },
    }

    // Example onInit code - commented out for reference
    // This was showing how to seed initial data
    // const incomingOnInit = config.onInit
    // config.onInit = async (payload) => {
    //   if (incomingOnInit) {
    //     await incomingOnInit(payload)
    //   }
    //   const { totalDocs } = await payload.count({
    //     collection: 'plugin-collection',
    //     where: {
    //       id: {
    //         equals: 'seeded-by-plugin',
    //       },
    //     },
    //   })
    //   if (totalDocs === 0) {
    //     await payload.create({
    //       collection: 'plugin-collection',
    //       data: {
    //         id: 'seeded-by-plugin',
    //       },
    //     })
    //   }
    // }

    return config
  }
