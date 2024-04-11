import { ContentHeader } from '@/components/content'
import { FinishEstimateForm } from './(form)/finish-estimate-form'

export function FinishContent() {
  return (
    <section className='relative mt-6 w-full'>
      <div className='container flex flex-col items-center rounded-lg'>
        <ContentHeader
          title='Finalize seu orçamento'
          description='Complemente algumas informações e o orçamento será enviado para análise'
          className='text-center'
        />

        <FinishEstimateForm />
        {/* Mostrar produtos relacionados */}
      </div>
    </section>
  )
}
