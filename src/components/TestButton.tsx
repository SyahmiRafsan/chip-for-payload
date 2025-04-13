'use client'

import { Button, FieldDescription, FieldLabel, useConfig, useField } from '@payloadcms/ui'
import React, { useCallback } from 'react'
import { ChipPurchaseResponse } from 'src/types/chip.js'

export const TestButton: React.FC = () => {
  const { config, getEntityConfig } = useConfig()

  // const chipConfig = getEntityConfig({ globalSlug: 'chip-payment-config' })
  const { value: enabled, setValue } = useField({ path: 'enabled' })
  const handleClick = useCallback(async () => {
    try {
      const response = await fetch(`${config.serverURL}/api/chip/purchases/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          purchase: {
            products: [
              {
                name: 'Test Product',
                quantity: 1,
                price: 1000,
              },
            ],
          },
          client: {
            name: 'Test Customer',
            email: 'test@test.com',
          },
        }),
      })

      const data: ChipPurchaseResponse = await response.json()
      if (data.checkout_url) {
        window.location.href = data.checkout_url
      }
    } catch (error) {
      console.error('Error creating test purchase:', error)
      alert('Failed to create test purchase. Check console for details.')
    }
  }, [config.serverURL])

  return (
    <div className="field-type text">
      <Button buttonStyle="pill" onClick={handleClick} disabled={!enabled}>
        Create Test Purchase (RM10)
      </Button>
      <FieldLabel label={'Create a new purchase to test your CHIP API settings'} path="" />
      {/* <FieldDescription description={chipConfig.slug} path="" /> */}
    </div>
  )
}
