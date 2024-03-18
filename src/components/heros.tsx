import React from 'react'

import { Page } from '../payload/payload-types'
import { HighImpactHero } from '../app/_sections/heros/highImpact'
import { SlideshowHero } from '@/app/_sections/heros/slideshow'

const heroes = {
  highImpact: HighImpactHero,
  slideshow: SlideshowHero,
}
export function Hero({ type, ...props }) {
  if (!type || type === 'none') return null

  const HeroToRender = heroes[type]

  if (!HeroToRender) return null

  return <HeroToRender {...props} />
}
