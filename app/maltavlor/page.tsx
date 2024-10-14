import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface TargetType {
  name: string
  description: string
  filename: string
}

const targets: TargetType[] = [
  {
    name: "Måltavla 1 - A4",
    description: "Standard måltavla i A4-format",
    filename: "Måltavla 1 - A4.pdf"
  }
]

export default function MaltavlorPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold mb-4">Måltavlor</h1>
        <p className="max-w-2xl mx-auto">
          Här kan du ladda ner måltavlor i A4-format för utskrift och träning.
        </p>
      </div>
      
      <div className="flex justify-center">
        <div className="grid grid-cols-1 gap-6 max-w-3xl">
          {targets.map((target) => (
            <Card key={target.name} className="w-full max-w-xl">
              <CardHeader>
                <CardTitle>{target.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-4">{target.description}</p>
                <div className="mb-4">
                  <iframe 
                    src={`/maltavlor/${target.filename}`} 
                    className="w-full h-96 border border-gray-300 rounded"
                    title={`Preview of ${target.name}`}
                  />
                </div>
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
