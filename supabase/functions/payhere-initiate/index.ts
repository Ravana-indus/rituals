import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import md5 from 'https://esm.sh/md5@2.3.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

function generatePayHereHash(
  merchantId: string,
  orderId: string,
  amount: string,
  currency: string,
  merchantSecret: string
): string {
  const hashedSecret = (md5(merchantSecret) as string).toUpperCase();
  const hashInput = merchantId + orderId + amount + currency + hashedSecret;
  return (md5(hashInput) as string).toUpperCase();
}

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const {
      orderId,
      amount,
      currency = 'LKR',
      firstName,
      lastName,
      email,
      phone,
      address,
      city,
      country = 'Sri Lanka',
      items,
      returnUrl,
      notifyUrl,
    } = await req.json();

    const merchantId = Deno.env.get('PAYYHERE_MERCHANT_ID') ?? '';
    const merchantSecret = Deno.env.get('PAYYHERE_MERCHANT_SECRET') ?? '';
    const sandbox = Deno.env.get('PAYYHERE_SANDBOX') === 'true';

    if (!merchantId || !merchantSecret) {
      return new Response(JSON.stringify({ error: 'PayHere not configured' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const formattedAmount = parseFloat(amount).toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).replaceAll(',', '');

    const hash = generatePayHereHash(merchantId, orderId, formattedAmount, currency, merchantSecret);
    const base = sandbox ? 'https://sandbox.payhere.lk' : 'https://www.payhere.lk';

    return new Response(
      JSON.stringify({
        actionUrl: `${base}/pay/checkout`,
        params: {
          merchant_id: merchantId,
          return_url: returnUrl,
          cancel_url: returnUrl,
          notify_url: notifyUrl,
          order_id: orderId,
          items: items ?? `Order ${orderId}`,
          currency,
          amount: formattedAmount,
          first_name: firstName,
          last_name: lastName,
          email,
          phone,
          address,
          city,
          country,
          hash,
        },
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (err) {
    return new Response(JSON.stringify({ error: (err as Error).message }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
