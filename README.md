# CHIP for PayloadCMS

A PayloadCMS plugin that integrates CHIP payment processing capabilities, allowing you to easily handle payments in your PayloadCMS application.

## Features

- Seamless integration with PayloadCMS
- Easy payment creation and handling
- Webhook support for payment status updates
- TypeScript support

## Installation

```bash
pnpm add chip-for-payload
```

## Configuration

Add the plugin to your PayloadCMS configuration:

```typescript
import { buildConfig } from 'payload/config'
import { chipPlugin } from 'chip-for-payload'

export default buildConfig({
  plugins: [
    chipPlugin({
      // Your CHIP configuration
      brandId: 'your-brand-id',
      apiKey: 'your-api-key',
    }),
  ],
})
```

## Usage

### Creating a Payment

```typescript
// Using the provided endpoint
const response = await fetch('/api/chip/purchases/create', {
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
          price: 1000, // in cents
        },
      ],
    },
    client: {
      name: 'Test Customer',
      email: 'test@test.com',
      // ...other client details
    },
  }),
})

const payment = await response.json()
```

### Handling Webhooks & Callbacks

The plugin automatically sets up webhook endpoints to handle payment status updates. Configure your CHIP webhook settings to point to:

```
/api/chip/webhook
/api/chip/callback/success
/api/chip/callback/failure
```

## Development

```bash
# Install dependencies
pnpm install

# Start development server
pnpm run dev

# Build for production
pnpm run build
```

## License

MIT
