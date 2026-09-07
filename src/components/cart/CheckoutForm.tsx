import React from 'react';
import { useForm } from '../../hooks/useForm';

export interface CheckoutFormValues {
    name: string;
    rollNumber: string;
    pickupSlot: string;
    [key: string]: string;
}

interface CheckoutFormProps {
    totalPrice: number;
    isSubmitting: boolean;
    onSubmit: (values: CheckoutFormValues) => void;
}

const PICKUP_SLOTS = ['ASAP (Next Available)', '12:30 PM - 1:00 PM', '1:00 PM - 1:30 PM', '1:30 PM - 2:00 PM'];

const validate = (values: CheckoutFormValues) => {
    const errors: Partial<Record<keyof CheckoutFormValues, string>> = {};

    if (!values.name.trim()) {
        errors.name = 'Name is required';
    }

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

export const CheckoutForm: React.FC<CheckoutFormProps> = ({ totalPrice, isSubmitting, onSubmit }) => {
    const { values, errors, touched, handleChange, handleBlur, handleSubmit } = useForm<CheckoutFormValues>(
        { name: '', rollNumber: '', pickupSlot: '' },
        validate
    );

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="pt-4 border-t border-slate-100 space-y-3">
            <div>
                <label htmlFor="checkout-name" className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">
                    Full Name
                </label>
                <input
                    id="checkout-name"
                    type="text"
                    value={values.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    onBlur={() => handleBlur('name')}
                    placeholder="e.g. Pradnyesh Patil"
                    className={inputClasses(Boolean(touched.name && errors.name))}
                />
                {touched.name && errors.name && <p className="text-[11px] text-red-500 mt-1">{errors.name}</p>}
            </div>

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
                    placeholder="e.g. INFT2024-045"
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
                <span className="font-bold text-slate-900">₹{totalPrice}</span>
            </div>

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
