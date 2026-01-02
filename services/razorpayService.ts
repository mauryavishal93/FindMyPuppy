
export interface RazorpayResponse {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

export const loadRazorpay = (): Promise<boolean> => {
  return new Promise((resolve) => {
    if ((window as any).Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

export const initializeRazorpayPayment = async (options: {
  amount: number;
  playerName: string;
  playerEmail: string;
  packName: string;
  hintsCount: number;
  onSuccess: (response: RazorpayResponse) => void;
  onError: (error: any) => void;
}) => {
  try {
    const isLoaded = await loadRazorpay();
    if (!isLoaded) {
      options.onError(new Error('Razorpay SDK failed to load.'));
      return;
    }

    // Flag to track if payment was already handled by success/fail events
    let isHandled = false;

    // 1. Create order on the backend
    const orderResponse = await fetch('/api/razorpay/create-order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        amount: options.amount,
        receipt: `receipt_${Date.now()}`
      })
    });

    const orderData = await orderResponse.json();
    if (!orderData.success) {
      throw new Error(orderData.message || 'Failed to create order');
    }

    // 2. Open Razorpay Checkout
    const razorpayOptions = {
      key: 'rzp_test_RyzZQD56IABhEH', // This should be your public key
      amount: orderData.order.amount,
      currency: orderData.order.currency,
      name: 'Find My Puppy',
      description: `Purchase ${options.packName}`,
      image: 'https://raw.githubusercontent.com/mauryavishal93/FindMyPuppy/main/apk/release/icon.png',
      order_id: orderData.order.id,
      handler: function (response: RazorpayResponse) {
        isHandled = true;
        options.onSuccess(response);
      },
      prefill: {
        name: options.playerName,
        email: options.playerEmail
      },
      theme: {
        color: '#FF69B4'
      },
      modal: {
        ondismiss: function() {
          if (!isHandled) {
            isHandled = true;
            options.onError({
              type: 'cancelled',
              description: 'Payment cancelled'
            });
          }
        }
      }
    };

    const rzp = new (window as any).Razorpay(razorpayOptions);
    
    // Handle payment failure (Decline/Reject)
    rzp.on('payment.failed', function (response: any) {
      isHandled = true;
      options.onError({
        type: 'failed',
        description: response.error.description,
        code: response.error.code
      });
    });

    rzp.open();

  } catch (error) {
    options.onError(error);
  }
};

