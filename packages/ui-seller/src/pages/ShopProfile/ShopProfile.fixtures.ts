import type { ShopProfileProps } from './ShopProfile.types'

export const shopProfileCountryOptions = ['Singapore', 'Malaysia', 'Thailand', 'Indonesia']

export const shopProfileResponseTargetOptions = [
  'within 1 hour',
  'within 4 hours',
  'within 24 hours',
  'within 2 business days',
]

export const shopProfileDefaultProps = {
  title: 'Shop profile',
  description: 'How buyers see your shop',
  breadcrumb: [{ label: 'Seller', href: '/' }, { label: 'Shop profile' }],
  submitLabel: 'Save changes',
  countryOptions: shopProfileCountryOptions,
  responseTargetOptions: shopProfileResponseTargetOptions,
  initialData: {
    shopName: 'Lumen Audio Official',
    slug: 'lumen-audio',
    tagline: 'Studio-grade audio, made for everyday.',
    about: 'Lumen Audio crafts headphones and speakers tuned by working studio engineers.',
    logoUrl:
      'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=160&q=80',
    bannerUrl:
      'https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&w=1600&q=80',
    supportEmail: 'support@lumen.co',
    supportPhone: '+65 9123 4567',
    country: 'Singapore',
    responseTarget: 'within 1 hour',
    followersLabel: '184k followers',
    ratingLabel: '4.9',
    previewUrl: 'halomarket.co/shop/lumen-audio',
  },
} satisfies Required<
  Omit<ShopProfileProps, 'onSubmit' | 'onReplaceLogo' | 'onReplaceBanner'>
>
