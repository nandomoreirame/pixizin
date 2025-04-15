'use client'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { ArrowLeft, Check, Copy } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function ConfirmationPage() {
  const searchParams = useSearchParams()
  const valor = searchParams.get('valor') || '0'
  const [copied, setCopied] = useState(false)
  const [pixCode, setPixCode] = useState('')
  const [pixCodeBase64, setPixCodeBase64] = useState('')
  const [transactionId, setTransactionId] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const handleDonate = async (amount: number) => {
      setLoading(true)
      const response = await fetch(process.env.NEXT_PUBLIC_API_URL + `/pagar`, {
        method: 'POST',
        body: JSON.stringify({ amount }),
      })
        .then((res) => {
          return res.json()
        })
        .then((json) => json)

      console.log({ response })
      setPixCode(response?.qrcode)
      setPixCodeBase64(response?.qrcode_base64)
      setTransactionId(response?.transactionId as string)
      setLoading(false)
    }

    handleDonate(Number.parseFloat(valor))
  }, [valor])

  const handleCopy = () => {
    navigator.clipboard.writeText(pixCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (loading) return <div>Carregando...</div>

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      <main className="container max-w-4xl mx-auto px-4 py-12">
        <Card className="p-6 md:p-8 shadow-lg border-0 max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="h-8 w-8 text-green-600" />
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Obrigado por sua Doação!</h1>
            <p className="text-gray-600">
              Sua contribuição de <span className="font-medium">R$ {Number.parseFloat(valor).toFixed(2)}</span> é muito
              importante para nós.
            </p>
            <p className="text-sm text-gray-500 mt-1">ID da Doação: {transactionId}</p>
          </div>

          <div className="space-y-6">
            <div className="flex flex-col items-center">
              <p className="text-sm font-medium text-gray-700 mb-3">Escaneie o QR Code com seu aplicativo bancário:</p>
              <div className="bg-white p-4 border rounded-md shadow-sm">
                <Image
                  src={pixCodeBase64 ? `data:image/jpeg;base64,${pixCodeBase64}` : '/qr-demo.png'}
                  alt="QR Code PIX"
                  width={200}
                  height={200}
                  className="w-full h-auto"
                />
              </div>
            </div>

            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">Ou copie o código PIX abaixo:</p>
              <div className="relative">
                <div className="p-3 bg-gray-50 border rounded-md text-sm text-gray-600 break-all">{pixCode}</div>
                <Button
                  variant="outline"
                  size="sm"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2"
                  onClick={handleCopy}
                >
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  <span className="ml-1">{copied ? 'Copiado!' : 'Copiar'}</span>
                </Button>
              </div>
            </div>

            <div className="bg-blue-50 p-4 rounded-md border border-blue-100">
              <h3 className="text-sm font-medium text-blue-800 mb-2">Como realizar o pagamento:</h3>
              <ol className="text-sm text-blue-700 space-y-1 pl-5 list-decimal">
                <li>Abra o aplicativo do seu banco</li>
                <li>Selecione a opção de pagamento via PIX</li>
                <li>Escaneie o QR Code ou cole o código copiado</li>
                <li>Confirme as informações e finalize o pagamento</li>
              </ol>
            </div>

            <div className="pt-4">
              <Link href="/" className="flex items-center justify-center text-green-600 hover:text-green-700">
                <ArrowLeft className="h-4 w-4 mr-1" />
                Voltar para a página inicial
              </Link>
            </div>
          </div>
        </Card>
      </main>
    </div>
  )
}
