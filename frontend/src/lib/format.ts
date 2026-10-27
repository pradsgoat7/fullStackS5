export const formatPrice = (amount: number) => `₹${amount.toLocaleString('en-IN')}`;

export const formatTime = (iso: string) =>
    new Date(iso).toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit' });

export const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

export const formatDateTime = (iso: string) => `${formatDate(iso)}, ${formatTime(iso)}`;

export const itemsSummary = (items: { name: string; quantity: number }[]) =>
    items.map((item) => `${item.quantity} × ${item.name}`).join(', ');
