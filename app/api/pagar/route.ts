import { NextResponse, type NextRequest } from "next/server";

import { MercadoPagoConfig, Payment } from "mercadopago";
import type { PaymentCreateRequest } from "mercadopago/dist/clients/payment/create/types";

const client = new MercadoPagoConfig({
  accessToken: process.env.MERCADO_PAGO_ACCESS_TOKEN as string,
  options: { timeout: 5000 },
});


export async function POST(req: NextRequest) {
  const { amount } = await req.json() as { amount: number };

  const payment = new Payment(client);

  const body = {
    transaction_amount: amount,
    description: "Doação para o projeto do Nando",
    payment_method_id: "pix",
    payer: {
      email: "nandomoreira.me@gmail.com",
    },
  } satisfies PaymentCreateRequest;

  const idempotencyKey = `DOA-${new Date().toISOString()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`
  const requestOptions = { idempotencyKey };

  const qrcode = await payment.create({ body, requestOptions }).then((response) => {
    return {
      qrcode: response?.point_of_interaction?.transaction_data?.qr_code,
      qrcode_base64: response?.point_of_interaction?.transaction_data?.qr_code_base64,
      ticket_url: response?.point_of_interaction?.transaction_data?.ticket_url,
    }
    })
    .catch(console.error)

  return NextResponse.json({ ...qrcode, transactionId: idempotencyKey })
}
