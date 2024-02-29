import type { Page } from '@/payload/payload-types'
import { ProductSlider } from './product-slider'

import ContentSection from '../app/_sections/content'
import FeaturedGrid from '../app/_sections/featured-grid'
import Statistics from '../app/_sections/statistics'
import ClientGrid from '../app/_sections/client-grid'
import ContentMedia from '../app/_sections/content-media'

const sectionComponents = {
  'product-carousel': ProductSlider,
  'featured-section': FeaturedGrid,
  'statistic-section': Statistics,
  'content-section': ContentSection,
  'client-grid': ClientGrid,
  'content-media': ContentMedia,
}

export function Sections({ sections }: { sections: Page['layout'][0][] }) {
  const sectionsExist =
    sections && Array.isArray(sections) && sections.length > 0
  // console.log(sections)
  if (sectionsExist) {
    return (
      <>
        {sections.map((section, index) => {
          const { blockName, blockType } = section
          if (blockType && blockType in sectionComponents) {
            const Block = sectionComponents[blockType]

            if (Block) {
              // TODO: fix this
              // @ts-expect-error
              return <Block key={index} {...section} />
            }
          }
        })}
      </>
    )
  }

  return null
}
