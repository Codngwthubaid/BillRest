import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { X, Plus, Trash2 } from 'lucide-react';
import { z } from 'zod';
import { useAuthStore } from '@/store/authStore';
import { createOrUpdateBusiness, getBusinessByUser } from '@/services/businessService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FormError } from '@/components/FormError';
import { businessSchema } from '@/lib/schemas';

interface GSTSlab {
  id: string;
  name: string;
  rate: number;
}

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type BusinessFormData = z.infer<typeof businessSchema>;

const OnboardingModal: React.FC<OnboardingModalProps> = ({ isOpen, onClose }) => {
  const { user, setAuth, token } = useAuthStore();
  const [gstSlabs, setGstSlabs] = useState<GSTSlab[]>([
    { id: '1', name: 'No Tax', rate: 0 },
    { id: '2', name: 'GST 5%', rate: 5 },
    { id: '3', name: 'GST 12%', rate: 12 },
    { id: '4', name: 'GST 18%', rate: 18 },
    { id: '5', name: 'GST 28%', rate: 28 },
  ]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
    reset,
  } = useForm<BusinessFormData>({
    resolver: zodResolver(businessSchema),
    defaultValues: {
      name: user?.name || '',
      phone: '',
      businessName: '',
      address: '',
      defaultCurrency: 'INR',
      gstNumber: '',
    },
  });

  useEffect(() => {
    const fetchBusiness = async () => {
      if (!user) return;
      try {
        const business = await getBusinessByUser();
        reset({
          name: user.name,
          phone: user.phone || '',
          businessName: business.businessName || '',
          address: business.address || '',
          defaultCurrency: business.defaultCurrency || 'INR',
        });
        if (business.gstSlabs?.length) {
          setGstSlabs(
            business.gstSlabs.map((slab: { label: string; value: number }, index: number) => ({
              id: `${index + 1}`,
              name: slab.label,
              rate: slab.value,
            }))
          );
        }
      } catch (error) {
        console.error('Error fetching business data:', error);
      }
    };
    fetchBusiness();
  }, [user, reset]);

  const handleAddGSTSlab = () => {
    const newSlab: GSTSlab = {
      id: Date.now().toString(),
      name: '',
      rate: 0,
    };
    setGstSlabs([...gstSlabs, newSlab]);
  };

  const handleGSTSlabChange = (id: string, field: keyof GSTSlab, value: string | number) => {
    setGstSlabs(gstSlabs.map(slab => (slab.id === id ? { ...slab, [field]: value } : slab)));
  };

  const handleRemoveGSTSlab = (id: string) => {
    setGstSlabs(gstSlabs.filter(slab => slab.id !== id));
  };

  const onSubmit = async (data: BusinessFormData) => {
    try {
      const payload = {
        ...data,
        gstSlabs: gstSlabs.map(slab => ({ label: slab.name, value: slab.rate })),
      };
      const response = await createOrUpdateBusiness(payload);
      setAuth({ ...user!, name: response.user.name, phone: response.user.phone, isOnboarded: true }, token!);
      onClose();
    } catch (error: any) {
      setError('root', { message: error.response?.data?.message || 'Failed to update business details' });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">Complete Your Setup</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Business Name *</label>
              <Input {...register('businessName')} />
              <FormError message={errors.businessName?.message} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
              <Input type="email" {...register('email')} />
              <FormError message={errors.email?.message} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number *</label>
              <Input type="tel" {...register('phone')} />
              <FormError message={errors.phone?.message} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">GST Number</label>
              <Input {...register('gstNumber')} />
              <FormError message={errors.gstNumber?.message} />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Business Address *</label>
            <textarea
              {...register('address')}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <FormError message={errors.address?.message} />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Default Currency *</label>
            <select
              {...register('defaultCurrency')}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="INR">INR</option>
              <option value="USD">USD</option>
              <option value="AED">AED</option>
            </select>
            <FormError message={errors.defaultCurrency?.message} />
          </div>

          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">GST Tax Slabs</h3>
              <Button type="button" onClick={handleAddGSTSlab} className="flex items-center text-sm">
                <Plus className="w-4 h-4 mr-2" />
                Add Slab
              </Button>
            </div>
            <div className="space-y-3">
              {gstSlabs.map((slab) => (
                <div key={slab.id} className="flex items-center space-x-3">
                  <Input
                    value={slab.name}
                    onChange={(e) => handleGSTSlabChange(slab.id, 'name', e.target.value)}
                    placeholder="Tax name"
                  />
                  <Input
                    type="number"
                    value={slab.rate}
                    onChange={(e) => handleGSTSlabChange(slab.id, 'rate', parseFloat(e.target.value) || 0)}
                    placeholder="Rate %"
                    min="0"
                    max="100"
                    step="0.01"
                    className="w-24"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => handleRemoveGSTSlab(slab.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>

          <FormError message={errors.root?.message} />
          <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
            <Button type="button" variant="outline" onClick={onClose}>
              Skip for Now
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : 'Complete Setup'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default OnboardingModal;