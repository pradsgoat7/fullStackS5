import React from 'react';
import { useForm } from '../../hooks/useForm';
import { PICKUP_SLOTS } from '../../types/order';
import { formatPrice } from '../../lib/format';

export interface CheckoutFormValues {
    rollNumber: string;
    pickupSlot: string;
    [key: string]: string;
}

interface CheckoutFormProps {
    customerName: string;
    totalPrice: number;
    isSubmitting: boolean;
    /** Message from the server, e.g. an item sold out */
    error: string | null;
    onSubmit: (values: CheckoutFormValues) => void;
}

const validate = (values: CheckoutFormValues) => {
    const errors: Partial<Record<keyof CheckoutFormValues, string>> = {};

    if (!values.rollNumber.trim()) {
        errors.rollNumber = 'Roll number is required';
    } else if (!/^[A-Za-z0-9-]{3,15}$/.test(values.rollNumber.trim())) {
        errors.rollNumber = 'Enter a valid roll number';
    }

    if (!values.pickupSlot) {
        errors.pickupSlot = 'Select a pickup slot';
    }

    return errors;
};

const inputClasses = (hasError: boolean) =>
    `mt-1 w-full text-sm px-3 py-2 rounded-xl border bg-white focus:outline-none focus:border-orange-400 ${hasError ? 'border-red-300' : 'border-slate-200'
    }`;

export const CheckoutForm: React.FC<CheckoutFormProps> = ({ customerName, totalPrice, isSubmitting, error, onSubmit }) => {
    const { values, errors, touched, handleChange, handleBlur, handleSubmit } = useForm<CheckoutFormValues>(
        { rollNumber: '', pickupSlot: '' },
        validate
    );

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="pt-4 border-t border-slate-100 space-y-3">
            <p className="text-xs text-slate-500">
                Ordering as <span className="font-semibold text-slate-700">{customerName}</span>
            </p>

            <div>
                <label htmlFor="checkout-roll" className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">
                    Roll Number
                </label>
                <input
                    id="checkout-roll"
                    type="text"
                    value={values.rollNumber}
                    onChange={(e) => handleChange('rollNumber', e.target.value)}
                    onBlur={() => handleBlur('rollNumber')}
                    placeholder="e.g. D15B-36"
                    className={inputClasses(Boolean(touched.rollNumber && errors.rollNumber))}
                />
                {touched.rollNumber && errors.rollNumber && (
                    <p className="text-[11px] text-red-500 mt-1">{errors.rollNumber}</p>
                )}
            </div>

            <div>
                <label htmlFor="checkout-slot" className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">
                    Pickup Slot
                </label>
                <select
                    id="checkout-slot"
                    value={values.pickupSlot}
                    onChange={(e) => handleChange('pickupSlot', e.target.value)}
                    onBlur={() => handleBlur('pickupSlot')}
                    className={inputClasses(Boolean(touched.pickupSlot && errors.pickupSlot))}
                >
                    <option value="">Select a slot...</option>
                    {PICKUP_SLOTS.map((slot) => (
                        <option key={slot} value={slot}>
                            {slot}
                        </option>
                    ))}
                </select>
                {touched.pickupSlot && errors.pickupSlot && (
                    <p className="text-[11px] text-red-500 mt-1">{errors.pickupSlot}</p>
                )}
            </div>

            <div className="flex justify-between text-sm pt-1">
                <span className="text-slate-500">Total Amount</span>
                <span className="font-bold text-slate-900">{formatPrice(totalPrice)}</span>
            </div>

            {error && <p className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-xl px-3 py-2">{error}</p>}

            <button
                type="submit"
                disabled={isSubmitting}
                className="w-full mt-2 bg-orange-500 hover:bg-orange-600 disabled:opacity-60 disabled:cursor-not-allowed text-white py-2.5 rounded-xl text-xs font-bold shadow-sm shadow-orange-500/25 transition-all"
            >
                {isSubmitting ? 'Placing order...' : 'Confirm Pre-Order & Get Token'}
            </button>
        </form>
    );
};
