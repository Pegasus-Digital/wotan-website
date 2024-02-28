import { H1 } from '@/components/typography/headings'
import { Lead, P } from '@/components/typography/texts'
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@/components/ui/accordion'

interface FAQItem {
  question: string
  answer: string
}

export interface FAQProps {
  items: FAQItem[]
}

const data: FAQProps = {
  items: [
    {
      question: 'Todos os produtos são personalizados?',
      answer:
        'Sim, todos os brindes são personalizáveis, exceto campanhas especiais em que o produto não permita impressão e/ou o cliente opte por tag, cartão e outros.',
    },
    {
      question: 'Qual o prazo de entrega?',
      answer:
        'Após a aprovação do layout e/ou amostra digital, o prazo médio é de 10 dias para entrega do produto. Enviamos brindes para todo o país, neste caso adicionar o prazo da logística.',
    },
    {
      question: 'Posso solicitar amostra digital?',
      answer:
        'Sim, a partir do fechamento do pedido enviaremos amostra digital para aprovação. Trabalhamos com o máximo cuidado para preservar a identidade visual dos clientes, respeitando normatização das marcas, proporções, formatos e cores/pantones.',
    },
    {
      question: 'Os brindes já chegam embalados?',
      answer:
        ' A maioria dos brindes são entregues em embalagem plástica transparente padrão. Trabalhamos também com embalagens de presente para que o seu produto chegue pronto para ser distribuído. Consulte orçamento em diversos tipos de papel, caixas, fitas e outros.',
    },
    {
      question: 'É possível montar kits personalizados para ações especiais?',
      answer:
        'Sim, temos muita expertise em criar kits para ações de marketing, vendas e endomarketing.  Buscamos inovação e criatividade para entregar os melhores brindes adequados a sua necessidade, verba e tema.',
    },
  ],
}

export function FAQ({ items }: FAQProps) {
  items = data.items

  return (
    <section className='w-full py-8'>
      <div className='container flex flex-col items-center text-center'>
        <H1>FAQ</H1>

        <div className='mt-6 flex w-full items-center justify-center'>
          <Accordion
            type='single'
            collapsible
            className='flex w-full flex-col gap-4'
          >
            {items.map((item, i) => {
              return (
                <AccordionItem
                  className='border-b-0'
                  key={`item-${i}`}
                  value={`item-${i}`}
                >
                  <AccordionTrigger className='rounded-sm border bg-wotan px-4 text-primary-foreground'>
                    <Lead className='text-primary-foreground'>
                      {item.question}
                    </Lead>
                  </AccordionTrigger>
                  <AccordionContent className='mx-2 mb-2 rounded-b-sm border border-t-0 p-4 text-left'>
                    <P className='text-lg font-medium'>{item.answer}</P>
                  </AccordionContent>
                </AccordionItem>
              )
            })}
          </Accordion>
        </div>
      </div>
    </section>
  )
}
