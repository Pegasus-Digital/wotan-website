export interface StatisticsProps {
  heading?: string
  description?: string
  statistics: [
    SingleStatisticsProps,
    SingleStatisticsProps,
    SingleStatisticsProps,
  ]
}

export interface SingleStatisticsProps {
  title: string
  value: string
}

export function Statistics({ statistics }: StatisticsProps) {
  return (
    <section className='w-full'>
      <div className='container text-center'>
        <dl className='tablet:divide-foreground/10 desktop:grid-cols-3 desktop:divide-x grid grid-cols-1 gap-4'>
          {statistics.map((statistic) => (
            <div
              className='flex flex-row  items-center justify-center gap-4 px-4 py-8 text-center '
              key={statistic.title}
            >
              <dt className=' order-last text-left text-lg font-medium'>
                {statistic.title}
              </dt>

              <dd className=' text-4xl font-extrabold md:text-5xl'>
                {statistic.value}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}
