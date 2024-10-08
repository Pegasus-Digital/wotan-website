import type { Page } from '@/payload/payload-types'
import { ProductSlider } from './product-slider'

import { FAQ } from '../app/_sections/faq'
import Timeline from '@/app/_sections/timeline'
import Statistics from '../app/_sections/statistics'
import ContentSection from '../app/_sections/content'
import ClientGrid from '../app/_sections/client-grid'
import FeaturedGrid from '../app/_sections/featured-grid'
import ContentMedia from '../app/_sections/content-media'
import ThreeColumns from '@/app/_sections/mission-vision-values'

import { Background } from './section-background'
import { VerticalPadding } from '@/pegasus/padding'

const sectionComponents = {
  'product-carousel': ProductSlider,
  'featured-section': FeaturedGrid,
  'statistic-section': Statistics,
  'content-section': ContentSection,
  'client-grid': ClientGrid,
  'content-media': ContentMedia,
  'faq-section': FAQ,
  'three-columns': ThreeColumns,
  'timeline-section': Timeline,
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

            const isInvert = section.invertBackground
              ? section.invertBackground
              : false

            let paddingTop = 'large'
            let paddingBottom = 'large'

            // if (index === sections.length - 1) {
            //   paddingBottom = 'large'
            // }

            if (Block) {
              return (
                <Background key={index} invert={isInvert}>
                  {/* @ts-ignore */}
                  <VerticalPadding top={paddingTop} bottom={paddingBottom}>
                    {/* @ts-ignore */}
                    <Block {...section} />
                  </VerticalPadding>
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
