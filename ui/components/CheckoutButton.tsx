// /client/components/CheckoutButton.tsx
'use client';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

type CheckoutButtonProps = {
    amount: number;
    listing:any,
    userId:string
};

export default function CheckoutButton({ amount,listing, userId }: CheckoutButtonProps) {
    const handleClick = async () => {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/stripe/create-checkout-session`, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ amount, listing, userId }),
        });

        const data = await res.json();
        const stripe = await stripePromise;
        await stripe?.redirectToCheckout({ sessionId: data.id });
    };

    return (
        <button
            className="
      ml-2 px-6 py-3 
      text-
      bg-gradient-to-r from-blue-500 to-indigo-500 
      text-white font-semibold 
      rounded-xl shadow-md 
      hover:from-blue-600 hover:to-indigo-700 
      hover:shadow-lg 
      active:scale-95 active:shadow-sm 
      transition duration-200 ease-in-out transform
    "
            onClick={handleClick}
        >
            Pay ₹{amount}
        </button>
    );
}
