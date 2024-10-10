import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface TargetType {
  name: string
  description: string
  filename: string
}

const targets: TargetType[] = [
  {
    name: "Inskjutningstavla A4",
    description: "Standard inskjutningstavla i A4-format",
    filename: "A4_skjuttavla.pdf"
  },
  {
    name: "Inskjutningstavla A3",
    description: "Standard inskjutningstavla i A3-format",
    filename: "A3_skjuttavla.pdf"
  }
]

export default function MaltavlorPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold mb-4">Inskjutningstavlor</h1>
        <p className="max-w-2xl mx-auto">
          Här kan du ladda ner inskjutningstavlor i A4- och A3-format för utskrift och träning.
        </p>
      </div>
      
      <div className="flex justify-center">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl">
          {targets.map((target) => (
            <Card key={target.name} className="w-full max-w-sm">
              <CardHeader>
                <CardTitle>{target.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-4">{target.description}</p>
                <Button asChild>
                  <a href={`/maltavlor/${target.filename}`} download>Ladda ner PDF</a>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}