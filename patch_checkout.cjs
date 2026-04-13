const fs = require('fs');
let content = fs.readFileSync('src/pages/Checkout.tsx', 'utf-8');

content = content.replace(
  /const \[deliveryMethod, setDeliveryMethod\] = useState\('standard'\);/,
  `const [deliveryMethod, setDeliveryMethod] = useState('standard');\n  const [paymentMethod, setPaymentMethod] = useState('payhere');`
);

content = content.replace(
  /payment_method: 'payhere',/g,
  `payment_method: paymentMethod,`
);

const submitCode = `      // Set PayHere params to trigger hidden form submission
      console.log('Setting PayHere params...');
      setPayHereParams({
        merchant_id: '1226500',
        return_url: \`\${window.location.origin}/order-confirmed?order_id=\${orderNumber}\`,
        cancel_url: \`\${window.location.origin}/checkout?cancel=true\`,
        notify_url: \`https://api.theheritagecurator.com/webhooks/payhere\`,
        order_id: order.id,
        items: items.map(i => i.title).join(', '),
        currency: 'LKR',
        amount: totalAmount,
        first_name: formData.firstName,
        last_name: formData.lastName,
        email: user.email,
        phone: formData.phone || '',
        address: formData.address,
        city: formData.city,
        country: 'Sri Lanka'
      });

      // Store order ID for return
      localStorage.setItem('pending_order_id', order.id);

      // Submit form after a brief delay to allow React to render
      setTimeout(() => {
        if (formRef.current) {
          console.log('Submitting PayHere form...');
          formRef.current.submit();
        } else {
          console.error('Form ref not available');
          setPayHereError('Failed to initiate payment. Please try again.');
          setPlacingOrder(false);
        }
      }, 100);`;

const newSubmitCode = `      if (paymentMethod === 'payhere') {
        // Set PayHere params to trigger hidden form submission
        console.log('Setting PayHere params...');
        setPayHereParams({
          merchant_id: '1226500',
          return_url: \`\${window.location.origin}/order-confirmed?order_id=\${orderNumber}\`,
          cancel_url: \`\${window.location.origin}/checkout?cancel=true\`,
          notify_url: \`https://api.theheritagecurator.com/webhooks/payhere\`,
          order_id: order.id,
          items: items.map(i => i.title).join(', '),
          currency: 'LKR',
          amount: totalAmount,
          first_name: formData.firstName,
          last_name: formData.lastName,
          email: user.email,
          phone: formData.phone || '',
          address: formData.address,
          city: formData.city,
          country: 'Sri Lanka'
        });

        // Store order ID for return
        localStorage.setItem('pending_order_id', order.id);

        // Submit form after a brief delay to allow React to render
        setTimeout(() => {
          if (formRef.current) {
            console.log('Submitting PayHere form...');
            formRef.current.submit();
          } else {
            console.error('Form ref not available');
            setPayHereError('Failed to initiate payment. Please try again.');
            setPlacingOrder(false);
          }
        }, 100);
      } else {
        await clearCart(user.id);
        navigate(\`/order-confirmed?order_id=\${orderNumber}\`);
      }`;

content = content.replace(submitCode, newSubmitCode);

const paymentStepOldRegex = /\{step === 3 && \([\s\S]*?<\/section>\n            \)\}/;

const paymentStepNew = `{step === 3 && (
              <section className="space-y-8">
                <h1 className="font-noto-serif text-3xl text-on-surface">Payment Details</h1>
                <div className="space-y-4">
                  <label className={\`flex items-center justify-between p-6 rounded-xl border-2 cursor-pointer transition-all \${paymentMethod === 'payhere' ? 'border-primary bg-primary/5' : 'border-outline-variant/30 hover:border-primary/50'}\`}>
                    <div className="flex items-center gap-4">
                      <input
                        type="radio"
                        name="payment"
                        value="payhere"
                        checked={paymentMethod === 'payhere'}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="w-4 h-4 text-primary"
                      />
                      <div>
                        <h3 className="font-bold text-on-surface">Credit / Debit Card</h3>
                        <p className="text-sm text-on-surface-variant">Secure payment via PayHere</p>
                      </div>
                    </div>
                    <img src="https://www.payhere.lk/images/logo.png" alt="PayHere" className="h-6" />
                  </label>

                  <label className={\`flex items-center justify-between p-6 rounded-xl border-2 cursor-pointer transition-all \${paymentMethod === 'cod' ? 'border-primary bg-primary/5' : 'border-outline-variant/30 hover:border-primary/50'}\`}>
                    <div className="flex items-center gap-4">
                      <input
                        type="radio"
                        name="payment"
                        value="cod"
                        checked={paymentMethod === 'cod'}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="w-4 h-4 text-primary"
                      />
                      <div>
                        <h3 className="font-bold text-on-surface">Cash on Delivery</h3>
                        <p className="text-sm text-on-surface-variant">Pay with cash upon delivery</p>
                      </div>
                    </div>
                    <Icon name="payments" className="text-2xl text-on-surface-variant" />
                  </label>

                  <label className={\`flex items-center justify-between p-6 rounded-xl border-2 cursor-pointer transition-all \${paymentMethod === 'bank_transfer' ? 'border-primary bg-primary/5' : 'border-outline-variant/30 hover:border-primary/50'}\`}>
                    <div className="flex items-center gap-4">
                      <input
                        type="radio"
                        name="payment"
                        value="bank_transfer"
                        checked={paymentMethod === 'bank_transfer'}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="w-4 h-4 text-primary"
                      />
                      <div>
                        <h3 className="font-bold text-on-surface">Bank Transfer</h3>
                        <p className="text-sm text-on-surface-variant">Transfer directly to our bank account</p>
                      </div>
                    </div>
                    <Icon name="account_balance" className="text-2xl text-on-surface-variant" />
                  </label>
                </div>

                {paymentMethod === 'payhere' && (
                  <div className="p-6 bg-surface-container dark:bg-[#1e1e1a] rounded-xl space-y-6">
                    <div className="flex items-center gap-3 text-sm text-on-surface-variant">
                      <Icon name="lock" className="text-primary" />
                      <span>Your payment is processed securely by PayHere. We never store your card details.</span>
                    </div>
                    {payHereError && (
                      <div className="p-4 bg-error/10 border border-error/30 rounded-lg text-sm text-error">
                        {payHereError}
                      </div>
                    )}
                  </div>
                )}

                {paymentMethod === 'bank_transfer' && (
                  <div className="p-6 bg-surface-container dark:bg-[#1e1e1a] rounded-xl space-y-4">
                    <h4 className="font-bold text-sm">Bank Account Details</h4>
                    <div className="text-sm text-on-surface-variant space-y-1">
                      <p>Bank: Commercial Bank</p>
                      <p>Branch: Colombo 01</p>
                      <p>Account Name: The Heritage Curator</p>
                      <p>Account Number: 1234567890</p>
                    </div>
                    <p className="text-xs text-on-surface-variant mt-4 italic">Please use your Order ID as the payment reference. Your order will not be shipped until the funds have cleared in our account.</p>
                  </div>
                )}
              </section>
            )}`;

content = content.replace(paymentStepOldRegex, paymentStepNew);

fs.writeFileSync('src/pages/Checkout.tsx', content);
