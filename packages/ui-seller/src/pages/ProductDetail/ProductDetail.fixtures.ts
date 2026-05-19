import type { ProductDetailProps } from './ProductDetail.types'

export const productDetailCategories = [
  'Audio',
  'Electronics',
  'Fashion',
  'Home & Living',
  'Sports',
]

export const productDetailBrands = ['Lumen', 'Nimbus', 'Halo Market', 'Northwave']

export const productDetailStatuses = ['DRAFT', 'PENDING', 'LIVE', 'OUT_OF_STOCK'] as const

export const productDetailDefaultProps: Required<ProductDetailProps> = {
  title: 'New product',
  breadcrumb: [{ label: 'Seller', href: '#' }, { label: 'Products', href: '#' }, { label: 'New' }],
  previewHref: '#',
  saveDraftHref: '#',
  publishHref: '#',
  lastSavedLabel: 'Last saved 2 min ago',
  categories: [...productDetailCategories],
  brands: [...productDetailBrands],
  statuses: [...productDetailStatuses],
  initialData: {
    name: 'Wireless ANC Headphones - Studio Edition',
    category: 'Audio',
    brand: 'Lumen',
    shortDescription: '40h battery, hybrid ANC, magnetic case',
    fullDescription: "Describe materials, fit, what's in the box...",
    status: 'DRAFT',
    media: [
      {
        id: 'media-1',
        url: 'https://images.unsplash.com/photo-1491933382434-500287f9b54b?auto=format&fit=crop&w=320&q=80',
        alt: 'E-reader product shot',
      },
      {
        id: 'media-2',
        url: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=320&q=80',
        alt: 'Bridge detail shot',
      },
      {
        id: 'media-3',
        url: 'https://images.unsplash.com/photo-1473448912268-2022ce9509d8?auto=format&fit=crop&w=320&q=80',
        alt: 'Railway cover shot',
      },
    ],
    optionGroups: [
      { id: 'color', name: 'Color', values: ['Onyx', 'Sand'] },
      { id: 'size', name: 'Size', values: ['S', 'M', 'L'] },
    ],
    variantSeeds: [
      { key: 'Onyx||S', sku: 'SKU-ONYX-S', price: '49.00', stock: '25' },
      { key: 'Onyx||M', sku: 'SKU-ONYX-M', price: '49.00', stock: '18' },
      { key: 'Onyx||L', sku: 'SKU-ONYX-L', price: '52.00', stock: '12' },
      { key: 'Sand||S', sku: 'SKU-SAND-S', price: '49.00', stock: '10' },
      { key: 'Sand||M', sku: 'SKU-SAND-M', price: '49.00', stock: '8' },
      { key: 'Sand||L', sku: 'SKU-SAND-L', price: '52.00', stock: '5' },
    ],
    weightKg: '0.4',
    lengthCm: '20',
    widthCm: '18',
    heightCm: '8',
    shippingMethods: [
      { id: 'standard', label: 'Standard (2-4 days)', checked: true },
      { id: 'express', label: 'Express (1-2 days)', checked: true },
      { id: 'same-day', label: 'Same-day (city only)', checked: false },
    ],
    slug: 'wireless-anc-headphones-studio',
    metaTitle: '',
    metaDescription: '',
    visibility: [
      { id: 'storefront', label: 'Show on storefront', checked: true },
      { id: 'search', label: 'Indexable by search', checked: false },
      { id: 'reviews', label: 'Allow reviews', checked: true },
      { id: 'qa', label: 'Allow Q&A', checked: true },
    ],
    validationItems: [
      { id: 'core', label: 'Name, category, price set', complete: true },
      { id: 'media', label: 'At least one image uploaded', complete: true },
      { id: 'cost', label: 'Add cost-per-item to compute margin', complete: false },
      { id: 'seo', label: 'Set meta title for SEO', complete: false },
    ],
  },
}
