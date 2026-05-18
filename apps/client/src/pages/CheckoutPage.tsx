import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import api from '@/lib/api';
import { useCartStore } from '@/stores/cartStore';
import { useAuthStore } from '@/stores/authStore';
import toast from 'react-hot-toast';

const formatPrice = (p: number) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(p);

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { items, totalPrice, clearLocalCart } = useCartStore();
  const { user } = useAuthStore();
  const [step, setStep] = useState(1);
  const [address, setAddress] = useState({ fullName: user?.name || '', phone: '', addressLine1: '', addressLine2: '', city: '', state: '', postalCode: '', country: 'India', isDefault: false });
  const [paymentMethod, setPaymentMethod] = useState<'razorpay' | 'cod'>('razorpay');
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<any>(null);

  const tax = Math.round(totalPrice * 0.18 * 100) / 100;
  const shipping = totalPrice > 500 ? 0 : 49;

  let discountAmount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.type === 'percentage') {
      discountAmount = (totalPrice * appliedCoupon.value) / 100;
      if (appliedCoupon.maxDiscount) {
        discountAmount = Math.min(discountAmount, appliedCoupon.maxDiscount);
      }
    } else {
      discountAmount = appliedCoupon.value;
    }
  }

  const total = Math.max(0, totalPrice + tax + shipping - discountAmount);

  const [showDemoGateway, setShowDemoGateway] = useState(false);
  const [demoOrderData, setDemoOrderData] = useState<any>(null);
  const [isProcessingDemo, setIsProcessingDemo] = useState(false);

  const validateCouponMutation = useMutation({
    mutationFn: (code: string) => api.get(`/coupons/validate/${code.toUpperCase()}`, { params: { cartTotal: totalPrice } }),
    onSuccess: (res) => {
      setAppliedCoupon(res.data.data);
      toast.success('Coupon applied successfully!');
    },
    onError: (e: any) => {
      toast.error(e.response?.data?.error || 'Invalid coupon code');
      setAppliedCoupon(null);
    }
  });

  const createOrderMutation = useMutation({
    mutationFn: () => api.post('/orders', { shippingAddress: address, paymentMethod, couponCode: appliedCoupon?.code || undefined }),
    onSuccess: async (res) => {
      const order = res.data.data;
      if (paymentMethod === 'cod') {
        clearLocalCart();
        toast.success('Order placed successfully!');
        navigate(`/orders`);
        return;
      }
      // Razorpay payment
      try {
        const payRes = await api.post('/payments/create-order', { orderId: order._id });
        const payData = payRes.data.data;
        if (payData.devMode) {
          // Dev mode — Show Demo Gateway
          setDemoOrderData(payData);
          setShowDemoGateway(true);
        } else {
          // Real Razorpay checkout
          const options = {
            key: payData.keyId, amount: payData.amount, currency: payData.currency, name: 'VEXO',
            description: `Order ${order.orderNumber}`, order_id: payData.orderId,
            handler: async (response: any) => {
              await api.post('/payments/verify', response);
              clearLocalCart();
              toast.success('Payment successful!');
              navigate('/orders');
            },
            prefill: { name: user?.name, email: user?.email },
            theme: { color: '#00d4ff' },
          };
          const rzp = new (window as any).Razorpay(options);
          rzp.open();
        }
      } catch { toast.error('Payment initialization failed'); }
    },
    onError: (e: any) => toast.error(e.response?.data?.error || 'Order failed'),
  });

  const handleDemoPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessingDemo(true);
    try {
      // Simulate network delay for realism
      await new Promise(resolve => setTimeout(resolve, 1500));
      await api.post('/payments/verify', { razorpay_order_id: demoOrderData.orderId, razorpay_payment_id: `dev_pay_${Date.now()}`, razorpay_signature: 'dev_simulated' });
      clearLocalCart();
      toast.success('Payment successful (Demo Mode)!');
      setShowDemoGateway(false);
      navigate('/orders');
    } catch (err) {
      toast.error('Payment verification failed');
    } finally {
      setIsProcessingDemo(false);
    }
  };

  if (items.length === 0 && !showDemoGateway) {
    navigate('/cart');
    return null;
  }

  return (
    <div className="page-container py-8 relative">
      <h1 className="section-heading mb-8">Checkout</h1>

      {/* Steps */}
      <div className="flex items-center gap-4 mb-10">
        {['Address', 'Payment', 'Review'].map((s, i) => (
          <div key={s} className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${step > i + 1 ? 'bg-vexo-green text-vexo-bg' : step === i + 1 ? 'bg-gradient-vexo text-white shadow-glow-blue' : 'bg-vexo-bg-tertiary text-vexo-text-muted'}`}>
              {step > i + 1 ? '✓' : i + 1}
            </div>
            <span className={`text-sm font-medium ${step >= i + 1 ? 'text-white' : 'text-vexo-text-muted'}`}>{s}</span>
            {i < 2 && <div className={`w-12 h-0.5 ${step > i + 1 ? 'bg-vexo-green' : 'bg-vexo-bg-tertiary'}`} />}
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {/* Step 1: Address */}
          {step === 1 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card p-6">
              <h2 className="font-heading font-bold text-lg mb-6">Shipping Address</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <input value={address.fullName} onChange={e => setAddress({ ...address, fullName: e.target.value })} placeholder="Full Name" className="input-field" required />
                <input value={address.phone} onChange={e => setAddress({ ...address, phone: e.target.value })} placeholder="Phone" className="input-field" required />
                <input value={address.addressLine1} onChange={e => setAddress({ ...address, addressLine1: e.target.value })} placeholder="Address Line 1" className="input-field md:col-span-2" required />
                <input value={address.addressLine2} onChange={e => setAddress({ ...address, addressLine2: e.target.value })} placeholder="Address Line 2 (optional)" className="input-field md:col-span-2" />
                <input value={address.city} onChange={e => setAddress({ ...address, city: e.target.value })} placeholder="City" className="input-field" required />
                <input value={address.state} onChange={e => setAddress({ ...address, state: e.target.value })} placeholder="State" className="input-field" required />
                <input value={address.postalCode} onChange={e => setAddress({ ...address, postalCode: e.target.value })} placeholder="PIN Code" className="input-field" required />
                <input value={address.country} onChange={e => setAddress({ ...address, country: e.target.value })} placeholder="Country" className="input-field" />
              </div>
              <button onClick={() => { if (address.fullName && address.phone && address.addressLine1 && address.city && address.state && address.postalCode) setStep(2); else toast.error('Fill required fields'); }}
                className="btn-primary mt-6">Continue to Payment</button>
            </motion.div>
          )}

          {/* Step 2: Payment */}
          {step === 2 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card p-6">
              <h2 className="font-heading font-bold text-lg mb-6">Payment Method</h2>
              <div className="space-y-3">
                {[{ val: 'razorpay' as const, label: 'Online Payment (Demo)', desc: 'Secure online payment simulator' },
                  { val: 'cod' as const, label: 'Cash on Delivery', desc: 'Pay when you receive' }].map(opt => (
                  <label key={opt.val} className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${paymentMethod === opt.val ? 'border-vexo-blue bg-vexo-blue/5' : 'border-vexo-border hover:border-vexo-border-hover'}`}>
                    <input type="radio" name="payment" value={opt.val} checked={paymentMethod === opt.val} onChange={() => setPaymentMethod(opt.val)} className="accent-[#00d4ff]" />
                    <div><p className="font-medium">{opt.label}</p><p className="text-sm text-vexo-text-muted">{opt.desc}</p></div>
                  </label>
                ))}
              </div>
              {/* Coupon */}
              <div className="mt-6">
                <label className="text-sm text-vexo-text-secondary mb-2 block">Coupon Code</label>
                <div className="flex gap-2">
                  <input value={couponCode} onChange={e => setCouponCode(e.target.value)} placeholder="e.g. WELCOME10" className="input-field flex-1 uppercase font-bold tracking-wider" disabled={!!appliedCoupon} />
                  {appliedCoupon ? (
                    <button
                      type="button"
                      onClick={() => {
                        setAppliedCoupon(null);
                        setCouponCode('');
                      }}
                      className="btn-secondary px-6 shrink-0 text-vexo-pink border-vexo-pink/20 hover:bg-vexo-pink/10"
                    >
                      Remove
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        if (!couponCode) {
                          toast.error('Please enter a coupon code');
                          return;
                        }
                        validateCouponMutation.mutate(couponCode);
                      }}
                      disabled={validateCouponMutation.isPending}
                      className="btn-secondary px-6 shrink-0"
                    >
                      {validateCouponMutation.isPending ? 'Applying...' : 'Apply'}
                    </button>
                  )}
                </div>
                {appliedCoupon && (
                  <p className="text-xs text-vexo-green mt-2 font-medium">
                    ✓ Coupon "{appliedCoupon.code}" applied! ({appliedCoupon.type === 'percentage' ? `${appliedCoupon.value}%` : `₹${appliedCoupon.value}`} discount)
                  </p>
                )}
              </div>
              <div className="flex gap-3 mt-6">
                <button onClick={() => setStep(1)} className="btn-secondary">Back</button>
                <button onClick={() => setStep(3)} className="btn-primary flex-1">Review Order</button>
              </div>
            </motion.div>
          )}

          {/* Step 3: Review */}
          {step === 3 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card p-6">
              <h2 className="font-heading font-bold text-lg mb-6">Order Review</h2>
              <div className="space-y-3 mb-6">
                {items.map(item => {
                  const p = typeof item.product === 'object' ? item.product : null;
                  if (!p) return null;
                  return (
                    <div key={item._id} className="flex items-center gap-4 p-3 bg-vexo-bg-tertiary/50 rounded-lg">
                      <img src={p.images?.[0]} alt={p.name} className="w-14 h-14 rounded-lg object-cover" />
                      <div className="flex-1"><p className="text-sm font-medium">{p.name}</p><p className="text-xs text-vexo-text-muted">Qty: {item.quantity}</p></div>
                      <p className="font-semibold text-sm">{formatPrice(item.price * item.quantity)}</p>
                    </div>
                  );
                })}
              </div>
              <div className="p-4 bg-vexo-bg-tertiary/50 rounded-lg text-sm space-y-1">
                <p><span className="text-vexo-text-muted">Ship to:</span> {address.fullName}, {address.addressLine1}, {address.city} {address.postalCode}</p>
                <p><span className="text-vexo-text-muted">Payment:</span> {paymentMethod === 'razorpay' ? 'Online Payment' : 'Cash on Delivery'}</p>
              </div>
              <div className="flex gap-3 mt-6">
                <button onClick={() => setStep(2)} className="btn-secondary">Back</button>
                <button onClick={() => createOrderMutation.mutate()} disabled={createOrderMutation.isPending}
                  className="btn-primary flex-1">{createOrderMutation.isPending ? 'Processing...' : 'Place Order'}</button>
              </div>
            </motion.div>
          )}
        </div>

        {/* Summary sidebar */}
        <div className="glass-card p-6 h-fit sticky top-24">
          <h3 className="font-heading font-bold mb-4">Summary</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-vexo-text-secondary">Items ({items.length})</span><span>{formatPrice(totalPrice)}</span></div>
            <div className="flex justify-between"><span className="text-vexo-text-secondary">Tax</span><span>{formatPrice(tax)}</span></div>
            <div className="flex justify-between"><span className="text-vexo-text-secondary">Shipping</span><span>{shipping === 0 ? <span className="text-vexo-green">Free</span> : formatPrice(shipping)}</span></div>
            {discountAmount > 0 && (
              <div className="flex justify-between text-vexo-green font-medium">
                <span>Discount ({appliedCoupon?.code})</span>
                <span>-{formatPrice(discountAmount)}</span>
              </div>
            )}
            <hr className="border-vexo-border my-4" />
            <div className="flex justify-between text-lg font-bold"><span>Total</span><span className="gradient-text">{formatPrice(total)}</span></div>
          </div>
        </div>
      </div>

      {/* Demo Payment Gateway Modal */}
      {showDemoGateway && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-vexo-bg-secondary border border-vexo-border p-8 rounded-2xl w-full max-w-md shadow-glow-blue">
            <div className="text-center mb-6">
              <div className="w-12 h-12 bg-gradient-vexo rounded-xl flex items-center justify-center mx-auto mb-3">
                <span className="font-heading font-black text-xl text-white">V</span>
              </div>
              <h2 className="font-heading text-xl font-bold text-white">VEXO Test Gateway</h2>
              <p className="text-sm text-vexo-text-secondary mt-1">This is a simulated payment environment.</p>
            </div>
            
            <div className="bg-vexo-bg p-4 rounded-xl mb-6 flex justify-between items-center border border-vexo-border">
              <span className="text-vexo-text-muted text-sm">Amount to Pay:</span>
              <span className="font-bold text-xl text-vexo-green">{formatPrice(demoOrderData?.amount / 100 || 0)}</span>
            </div>

            <form onSubmit={handleDemoPayment} className="space-y-4">
              <div>
                <label className="text-xs text-vexo-text-muted uppercase font-bold tracking-wider mb-1 block">Card Number</label>
                <input type="text" className="input-field font-mono" value="4111 1111 1111 1111" readOnly />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-vexo-text-muted uppercase font-bold tracking-wider mb-1 block">Expiry</label>
                  <input type="text" className="input-field font-mono" value="12/28" readOnly />
                </div>
                <div>
                  <label className="text-xs text-vexo-text-muted uppercase font-bold tracking-wider mb-1 block">CVV</label>
                  <input type="text" className="input-field font-mono" value="123" readOnly />
                </div>
              </div>
              <div>
                <label className="text-xs text-vexo-text-muted uppercase font-bold tracking-wider mb-1 block">Cardholder Name</label>
                <input type="text" className="input-field" value={address.fullName || "John Doe"} readOnly />
              </div>
              
              <div className="pt-4 flex gap-3">
                <button type="button" onClick={() => setShowDemoGateway(false)} className="btn-secondary w-full" disabled={isProcessingDemo}>Cancel</button>
                <button type="submit" className="btn-primary w-full shadow-glow-blue" disabled={isProcessingDemo}>
                  {isProcessingDemo ? 'Processing...' : 'Pay Now'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}

