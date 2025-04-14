"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { HeartHandshake } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

export default function DonationPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      <main className="container max-w-4xl mx-auto px-4 py-12">
        <div className="flex flex-col items-center text-center mb-10">
          <div className="bg-green-100 p-3 rounded-full mb-4">
            <HeartHandshake className="h-10 w-10 text-green-600" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Sua Doação Faz a Diferença!</h1>
          <p className="text-gray-600 max-w-2xl mb-6">
            Com sua contribuição, podemos continuar nosso trabalho de impacto social e transformar vidas em nossa
            comunidade. Cada PIX recebido é investido diretamente em nossos projetos.
          </p>
        </div>

        <Card className="p-6 shadow-lg border-0">
          <DonationForm />
        </Card>
      </main>
    </div>
  )
}

function DonationForm() {
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null)
  const [customAmount, setCustomAmount] = useState("")

  const presetAmounts = [10, 25, 50, 100]

  const handleAmountSelect = (amount: number) => {
    setSelectedAmount(amount)
    setCustomAmount("")
  }

  const handleCustomAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomAmount(e.target.value)
    setSelectedAmount(null)
  }

  const finalAmount = selectedAmount || (customAmount ? Number.parseFloat(customAmount) : 0)

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-medium text-gray-900 mb-4">Escolha um valor para doar</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {presetAmounts.map((amount) => (
            <Button
              key={amount}
              variant={selectedAmount === amount ? "default" : "outline"}
              className={`h-16 text-lg ${selectedAmount === amount ? "bg-green-600 hover:bg-green-700" : "hover:border-green-600 hover:text-green-600"}`}
              onClick={() => handleAmountSelect(amount)}
            >
              R$ {amount}
            </Button>
          ))}
        </div>
      </div>

      <div>
        <label htmlFor="customAmount" className="block text-sm font-medium text-gray-700 mb-2">
          Outro Valor (R$):
        </label>
        <Input
          id="customAmount"
          type="number"
          min="1"
          step="1"
          placeholder="Digite um valor personalizado"
          value={customAmount}
          onChange={handleCustomAmountChange}
          className="h-12"
        />
      </div>

      <div className="pt-4">
        <Link
          href={`/doar?valor=${finalAmount}`}
          className={`w-full h-14 flex items-center justify-center rounded-md text-white text-lg font-medium transition-colors ${
            finalAmount > 0 ? "bg-green-600 hover:bg-green-700" : "bg-gray-300 cursor-not-allowed"
          }`}
          aria-disabled={finalAmount <= 0}
          onClick={(e) => finalAmount <= 0 && e.preventDefault()}
        >
          Doar R$ {finalAmount.toFixed(2)} com PIX
        </Link>
      </div>
    </div>
  )
}
