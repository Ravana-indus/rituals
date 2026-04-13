import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import md5 from 'https://esm.sh/md5@2.3.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

function verifyMd5sig(
  merchantId: string,
  orderId: string,
  payhereAmount: string,
  payhereCurrency: string,
  statusCode: string,
  merchantSecret: string
): string {
  const hashedSecret = (md5(merchantSecret) as string).toUpperCase();
  const input = merchantId + orderId + payhereAmount + payhereCurrency + statusCode + hashedSecret;
  return (md5(input) as string).toUpperCase();
}

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const formData = await req.formData();
    const merchantId = formData.get('merchant_id') as string;
    const orderId = formData.get('order_id') as string;
    const payhereAmount = formData.get('payhere_amount') as string;
    const payhereCurrency = formData.get('payhere_currency') as string;
    const statusCode = formData.get('status_code') as string;
    const md5sig = formData.get('md5sig') as string;
    const paymentId = formData.get('payment_id') as string | null;
    const method = formData.get('method') as string | null;

    const merchantSecret = Deno.env.get('PAYYHERE_MERCHANT_SECRET') ?? '';
    if (!merchantSecret) {
      return new Response('Server misconfigured', { status: 500 });
    }

    const expectedSig = verifyMd5sig(
      merchantId,
      orderId,
      payhereAmount,
      payhereCurrency,
      statusCode,
      merchantSecret
    );

    if (expectedSig !== md5sig) {
      console.error('PayHere webhook: signature mismatch', { expected: expectedSig, received: md5sig });
      return new Response('Invalid signature', { status: 403 });
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    let paymentStatus: string;
    let orderStatus: string;

    switch (statusCode) {
      case '2':
        paymentStatus = 'paid';
        orderStatus = 'confirmed';
        break;
      case '0':
        paymentStatus = 'pending';
        orderStatus = 'pending';
        break;
      case '-1':
      case '-2':
        paymentStatus = 'failed';
        orderStatus = 'cancelled';
        break;
      case '-3':
        paymentStatus = 'refunded';
        orderStatus = 'refunded';
        break;
      default:
        paymentStatus = 'pending';
        orderStatus = 'pending';
    }

    const { error: orderError } = await supabase
      .from('orders')
      .update({
        payment_status: paymentStatus,
        status: orderStatus,
        payhere_payment_id: paymentId,
      })
      .eq('order_number', orderId);

    if (orderError) {
      console.error('PayHere webhook: failed to update order', orderError);
    }

    if (paymentId && statusCode === '2') {
      const amountCents = Math.round(parseFloat(payhereAmount) * 100);
      await supabase.from('payments').insert({
        order_id: orderId,
        amount_cents: amountCents,
        payment_method: method ?? 'payhere',
        payment_status: 'completed',
        provider: 'payhere',
        provider_txn_id: paymentId,
      }).catch(e => console.error('PayHere payment record insert error', e));
    }

    return new Response('OK', { status: 200 });
  } catch (err) {
    console.error('PayHere webhook error:', err);
    return new Response('Error', { status: 500 });
  }
});
