import { useState } from 'react';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import Button from '@/components/ui/Button';

interface PaymentIntent {
  orderId: string;
  clientSecret: string;
}

interface PaymentFormProps {
  paymentIntents: PaymentIntent[];
  onSuccess: () => void;
  onError: (message: string) => void;
}

const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      fontSize: '16px',
      color: '#1a1a2e',
      '::placeholder': { color: '#9ca3af' },
      fontFamily: 'inherit',
    },
    invalid: { color: '#dc2626' },
  },
};

const PaymentForm = ({ paymentIntents, onSuccess, onError }: PaymentFormProps) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [succeededIntents, setSucceededIntents] = useState<Set<string>>(new Set());

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) return;

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) return;

    setIsProcessing(true);

    try {
      const { paymentMethod, error: pmError } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardElement,
      });

      if (pmError || !paymentMethod) {
        onError(pmError?.message ?? 'Nie udało się przetworzyć karty.');
        setIsProcessing(false);
        return;
      }

      const remaining = paymentIntents.filter((pi) => !succeededIntents.has(pi.clientSecret));

      for (const intent of remaining) {
        const { error } = await stripe.confirmCardPayment(intent.clientSecret, {
          payment_method: paymentMethod.id,
        });

        if (error) {
          onError(error.message ?? 'Płatność nie powiodła się.');
          setIsProcessing(false);
          return;
        }

        setSucceededIntents((prev) => new Set(prev).add(intent.clientSecret));
      }

      onSuccess();
    } catch {
      onError('Wystąpił nieoczekiwany błąd. Spróbuj ponownie.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="rounded-xl border border-brand-100 bg-cream-50 p-4">
        <CardElement options={CARD_ELEMENT_OPTIONS} />
      </div>

      {succeededIntents.size > 0 && succeededIntents.size < paymentIntents.length && (
        <p className="text-sm text-amber-600">
          Opłacono {succeededIntents.size} z {paymentIntents.length} zamówień. Kliknij ponownie, aby dokończyć.
        </p>
      )}

      <Button
        type="submit"
        className="w-full"
        size="lg"
        isLoading={isProcessing}
        disabled={!stripe || isProcessing}
      >
        {isProcessing ? 'Przetwarzanie płatności...' : 'Zapłać'}
      </Button>
    </form>
  );
};

export default PaymentForm;
