import type { Page } from '@/payload/payload-types'
import { ProductSlider } from './product-slider'

import ContentSection from '../app/_sections/content'
import FeaturedGrid from '../app/_sections/featured-grid'
import Statistics from '../app/_sections/statistics'
import ClientGrid from '../app/_sections/client-grid'
import ContentMedia from '../app/_sections/content-media'
import { Background } from './section-background'

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

            const isInvert = section.invertBackground
              ? section.invertBackground
              : false

            if (Block) {
              // TODO: fix this
              return (
                <Background key={index} invert={isInvert}>
                  {/* @ts-ignore */}
                  <Block {...section} />
                </Background>
              )
            }
          }
        })}
      </>
    )
  }

  return null
}
