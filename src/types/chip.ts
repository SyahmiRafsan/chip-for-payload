export interface ChipPurchaseRequest {
  client?: {
    email: string // required, max length 254
    bank_account?: string // max length 34
    bank_code?: string // max length 11
    phone?: string // format: "+44 45643564564", max length 32
    full_name?: string // max length 128
    personal_code?: string // max length 32
    street_address?: string // max length 128
    country?: string // ISO 3166-1 alpha-2, max length 2
    city?: string // max length 128
    zip_code?: string // max length 32
    state?: string // max length 128
    shipping_street_address?: string // max length 128
    shipping_country?: string // ISO 3166-1 alpha-2, max length 2
    shipping_city?: string // max length 128
    shipping_zip_code?: string // max length 32
    shipping_state?: string // max length 128
    cc?: string[] // email addresses for carbon copy
    bcc?: string[] // email addresses for blind carbon copy
    legal_name?: string // max length 128
    brand_name?: string // max length 128
    registration_number?: string // max length 32
    tax_number?: string // max length 32
  }
  client_id?: string | null // Either client or client_id is required
  purchase: {
    products: Array<{
      name: string
      price: number
      quantity?: number
      discount?: number
      tax_percent?: number
      category?: string
    }>
    currency?: string // ISO 4217 format, max length 3
    language?: string // ISO 639-1 format, max length 2
    notes?: string // max length 10000
    debt?: number // default: 0
    subtotal_override?: number
    total_tax_override?: number
    total_discount_override?: number
    total_override?: number
    request_client_details?: Array<
      | 'email'
      | 'phone'
      | 'full_name'
      | 'personal_code'
      | 'brand_name'
      | 'legal_name'
      | 'registration_number'
      | 'tax_number'
      | 'bank_account'
      | 'bank_code'
      | 'billing_address'
      | 'shipping_address'
    >
    timezone?: string
    due_strict?: boolean // default: false
  }
  brand_id: string
  send_receipt?: boolean // default: false
  currency?: string
  title?: string
  reference?: string
  due?: string
  redirect_url?: string
  success_callback?: string // max 500 characters
  success_redirect?: string // max 500 characters
  failure_redirect?: string
  cancel_redirect?: string
  due_strict?: boolean
  creator_agent?: string // max 32
  platform?: 'web' | 'api' | 'ios' | 'android' | 'macos' | 'windows'
}

export type ChipStatus =
  | 'created'
  | 'sent'
  | 'viewed'
  | 'error'
  | 'cancelled'
  | 'overdue'
  | 'expired'
  | 'blocked'
  | 'hold'
  | 'released'
  | 'pending_release'
  | 'pending_capture'
  | 'preauthorized'
  | 'paid'
  | 'pending_execute'
  | 'pending_charge'
  | 'cleared'
  | 'settled'
  | 'chargeback'
  | 'pending_refund'
  | 'refunded'

export interface ChipPurchaseResponse {
  id: string
  type: string
  status: ChipStatus
  payment_url: string
  amount: number
  currency: string
  created_at: string
  updated_at: string
  created_on: number
  updated_on: number
  due?: string
  paid_at?: string
  reference?: string
  client_id?: string
  client?: {
    bank_account: string
    bank_code: string
    email: string
    phone: string
    full_name: string
    personal_code: string
    street_address: string
    country: string
    city: string
    zip_code: string
    state: string
    shipping_street_address: string
    shipping_country: string
    shipping_city: string
    shipping_zip_code: string
    shipping_state: string
    cc: string[]
    bcc: string[]
    legal_name: string
    brand_name: string
    registration_number: string
    tax_number: string
  }
  purchase?: {
    currency: string
    products: Array<{
      name: string
      quantity: number
      price: number
      discount: number
      tax_percent: number
      category: string
    }>
    total: number
    language: string
    notes: string
    debt: number
    subtotal_override: number
    total_tax_override: number
    total_discount_override: number
    total_override: number
    request_client_details: any[]
    timezone: string
    due_strict: boolean
    email_message: string
  }
  payment?: {
    is_outgoing: boolean
    payment_type: string
    amount: number
    currency: string
    net_amount: number
    fee_amount: number
    pending_amount: number
    pending_unfreeze_on: number
    description: string
    paid_on: number
    remote_paid_on: number
  }
  issuer_details?: {
    website: string
    legal_street_address: string
    legal_country: string
    legal_city: string
    legal_zip_code: string
    bank_accounts: Array<{
      bank_account: string
      bank_code: string
    }>
    legal_name: string
    brand_name: string
    registration_number: string
    tax_number: string
  }
  transaction_data?: {
    payment_method: string
    extra: Record<string, any>
    country: string
    attempts: Array<{
      type: string
      successful: boolean
      payment_method: string
      extra: Record<string, any>
      country: string
      client_ip: string
      processing_time: number
      error?: {
        code: string
        message: string
      }
    }>
  }
  status_history?: Array<{
    status: string
    timestamp: number
    related_object: {
      type: string
      id: string
    }
  }>
  viewed_on?: number
  company_id?: string
  is_test?: boolean
  user_id?: string
  brand_id?: string
  billing_template_id?: string
  send_receipt?: boolean
  is_recurring_token?: boolean
  recurring_token?: string
  skip_capture?: boolean
  force_recurring?: boolean
  reference_generated?: string
  issued?: string
  refund_availability?: 'all' | 'full_only' | 'partial_only' | 'pis_all' | 'pis_partial' | 'none'
  refundable_amount?: number
  currency_conversion?: {
    original_currency: string
    original_amount: number
    exchange_rate: number
  }
  payment_method_whitelist?: string[]
  success_redirect?: string
  failure_redirect?: string
  cancel_redirect?: string
  success_callback?: string
  creator_agent?: string
  platform?: string
  product?: string
  created_from_ip?: string
  invoice_url?: string
  checkout_url?: string
  direct_post_url?: string
  marked_as_paid?: boolean
  order_id?: string
}
