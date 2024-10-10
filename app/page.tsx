import { Metadata } from 'next'
import CalculatorForm from '@/components/calculator-form'

export const metadata: Metadata = {
  title: 'Inskjutningsverktyg',
  description: 'Beräkna kikarsiktejusteringar snabbt och enkelt',
}

export default function Home() {
  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Inskjutningsverktyg</h1>
      <p className="mb-8 text-center max-w-2xl mx-auto">
      Ställ upp ett stabilt stöd, skjut ett skott, ange hur många centimeter kulan avviker från målet, välj riktning med pilarna och få fram nödvändiga justeringar i klick.
      </p>
      <CalculatorForm />
    </main>
  )
}
