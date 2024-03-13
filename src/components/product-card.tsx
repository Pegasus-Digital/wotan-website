import { Lead, P } from './typography/texts'
import { Card, CardContent, CardFooter } from './ui/card'
import { ProductCardActions } from './product-card-actions'
import type { Product } from '@/payload/payload-types'

type ProductCardProps = Pick<
  Product,
  'title' | 'categories' | 'id' | 'minimumQuantity'
>

const attributes = ['#F00', '#0F0', '#00F']

export function ProductCard({ id, title, categories }: ProductCardProps) {
  const mainCategory =
    typeof categories[0] === 'string' ? categories[0] : categories[0].title

  return (
    <Card className='group my-3 shadow-wotan-light'>
      <CardContent className='relative m-0 rounded-md p-0'>
        <img
          className='aspect-square h-full max-h-[300px] min-h-[300px] w-full rounded-t-md object-cover'
          alt='random'
          src='https://source.unsplash.com/random/'
        />

        {/* Actions Wrapper */}
        <div className='absolute bottom-2 flex w-full items-center justify-center gap-2.5 transition duration-200 tablet:translate-y-10 tablet:opacity-0 tablet:group-hover:translate-y-0 tablet:group-hover:opacity-100'>
          <ProductCardActions productId={id} />
        </div>
      </CardContent>

      <CardFooter className='z-10 flex flex-col items-start space-y-2.5 py-4'>
        <Lead className='text-sm font-bold text-wotanRed-500'>
          {mainCategory}
        </Lead>

        <P className='text-base font-bold text-foreground'>{title}</P>

        <div className='flex items-center gap-1'>
          {attributes.map((attribute) => (
            <div
              key={attribute}
              style={{ backgroundColor: attribute }}
              className='h-4 w-4 rounded-full border'
            />
          ))}
        </div>
      </CardFooter>
    </Card>
  )
}
