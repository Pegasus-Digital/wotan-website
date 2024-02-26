import type { Page } from '@/payload/payload-types'
import { FeaturedGrid } from './featured-grid'
import { ProductSlider } from './product-slider'
import { Statistics } from './statistics'

const sectionComponents = {
  'product-carousel': ProductSlider,
  'featured-section': FeaturedGrid,
  // 'statistic-section': Statistics,
}

export function Sections({ sections }: { sections: Page['layout'][0][] }) {
  const sectionsExist =
    sections && Array.isArray(sections) && sections.length > 0

  if (sectionsExist) {
    return (
      <>
        {sections.map((section, index) => {
          const { blockName, blockType } = section
          if (blockType && blockType in sectionComponents) {
            const Block = sectionComponents[blockType]

            if (Block) {
              return <Block id={blockName} key={index} {...section} />
            }
          }
        })}
      </>
    )
  }

  return null
}
