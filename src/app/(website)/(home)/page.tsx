import { H1 } from '@/components/typography/headings'
import { P } from '@/components/typography/texts'
import { PegasusStamp } from '@/pegasus/pegasus-stamp'
import { ProductSlider } from '@/components/product-slider'
import { SearchBar } from '@/components/search-bar'
import { Footer } from '@/components/footer'

export default function Home() {
  return (
    <main className='flex min-h-screen flex-col items-center'>
      <H1>Wotan Website</H1>
      <P className='text-xl'>Website institucional + eCommerce</P>

      <SearchBar />

      <ProductSlider />

      <Footer />
      <PegasusStamp />
    </main>
  )
}
