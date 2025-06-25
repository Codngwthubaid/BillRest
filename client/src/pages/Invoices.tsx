// import React, { useState, useEffect } from 'react';
// import {
//     Plus, Search, Filter, Eye, Download, Send, Edit, Trash2, FileText, DollarSign, Clock, Calendar
// } from 'lucide-react';
// import { useAuthStore } from '@/store/authStore';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
// import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
// import { useForm } from 'react-hook-form';
// import { zodResolver } from '@hookform/resolvers/zod';
// import { z } from 'zod';
// import { getInvoices, createInvoice, downloadInvoicePDF, sendInvoiceWhatsApp } from '@/services/invoiceService';
// import { getProducts } from '@/services/productService';
// import type { Invoice, Product as ProductType } from '@/types/index';
// import { FormError } from '@/components/FormError';
// import { Link } from 'react-router-dom';

// const invoiceSchema = z.object({
//     customerName: z.string().min(1, 'Customer name is required'),
//     phoneNumber: z.string().min(10, 'Phone number must be at least 10 digits'),
//     paymentMethod: z.enum(['Cash', 'UPI', 'Card', 'Other']),
//     currency: z.enum(['INR', 'USD', 'AED']),
//     products: z.array(
//         z.object({
//             product: z.string().min(1, 'Product is required'),
//             quantity: z.number().min(1, 'Quantity must be at least 1'),
//             price: z.number().min(0, 'Price must be non-negative'),
//             gstRate: z.number().min(0, 'GST rate must be non-negative'),
//         })
//     ).min(1, 'At least one product is required'),
// });

// type InvoiceFormData = z.infer<typeof invoiceSchema>;

// const Invoices: React.FC = () => {
//     const { user, token } = useAuthStore();
//     const [invoices, setInvoices] = useState<Invoice[]>([]);
//     const [products, setProducts] = useState<ProductType[]>([]);
//     const [searchTerm, setSearchTerm] = useState('');
//     const [statusFilter, setStatusFilter] = useState('');
//     const [showCreateModal, setShowCreateModal] = useState(false);
//     const [loading, setLoading] = useState(true);
//     const [productsLoading, setProductsLoading] = useState(true);
//     const [productsError, setProductsError] = useState<string | null>(null);

//     const { register, handleSubmit, formState: { errors, isSubmitting }, reset, setValue, watch } = useForm<InvoiceFormData>({
//         resolver: zodResolver(invoiceSchema),
//         defaultValues: {
//             customerName: '',
//             phoneNumber: '',
//             paymentMethod: 'Cash',
//             currency: 'INR',
//             products: [{ product: '', quantity: 1, price: 0, gstRate: 0 }],
//         },
//     });

//     const selectedProducts = watch('products');

//     useEffect(() => {
//         const fetchData = async () => {
//             if (!token || !user) return;
//             setLoading(true);
//             setProductsLoading(true);
//             try {
//                 const invoicesData = await getInvoices();
//                 setInvoices(invoicesData);
//                 const productsData = await getProducts();
//                 // Filter out invalid products
//                 const validProducts = productsData.filter(p => p._id && p.name && p.price >= 0 && p.gstRate >= 0);
//                 setProducts(validProducts);
//                 if (validProducts.length === 0) {
//                     setProductsError('No valid products available. Please add products first.');
//                 }
//                 // Initialize form with first product if available
//                 if (validProducts.length > 0) {
//                     setValue('products', [{
//                         product: validProducts[0]._id,
//                         quantity: 1,
//                         price: validProducts[0].price,
//                         gstRate: validProducts[0].gstRate
//                     }]);
//                 }
//             } catch (error) {
//                 console.error('Error fetching data:', error);
//                 setProductsError('Failed to load products. Please try again.');
//             } finally {
//                 setLoading(false);
//                 setProductsLoading(false);
//             }
//         };
//         fetchData();
//     }, [user, token, setValue]);

//     const filteredInvoices = invoices.filter(invoice => {
//         const matchesSearch =
//             invoice.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
//             invoice.customerName.toLowerCase().includes(searchTerm.toLowerCase());
//         const matchesStatus = !statusFilter || invoice.status === statusFilter;
//         return matchesSearch && matchesStatus;
//     });

//     const getStatusColor = (status: string) => {
//         switch (status) {
//             case 'paid': return 'bg-green-100 text-green-800';
//             case 'pending': return 'bg-yellow-100 text-yellow-800';
//             case 'overdue': return 'bg-red-100 text-red-800';
//             case 'draft': return 'bg-gray-100 text-gray-800';
//             default: return 'bg-gray-100 text-gray-800';
//         }
//     };

//     const getStatusIcon = (status: string) => {
//         switch (status) {
//             case 'paid': return <DollarSign className="w-4 h-4" />;
//             case 'pending': return <Clock className="w-4 h-4" />;
//             case 'overdue': return <Calendar className="w-4 h-4" />;
//             default: return <FileText className="w-4 h-4" />;
//         }
//     };

//     const handleAddProduct = () => {
//         if (products.length > 0) {
//             setValue('products', [...selectedProducts, {
//                 product: products[0]._id,
//                 quantity: 1,
//                 price: products[0].price,
//                 gstRate: products[0].gstRate
//             }]);
//         }
//     };

//     const handleRemoveProduct = (index: number) => {
//         setValue('products', selectedProducts.filter((_, i) => i !== index));
//     };

//     const handleProductChange = (index: number, field: keyof InvoiceFormData['products'][0], value: any) => {
//         const updatedProducts = [...selectedProducts];
//         updatedProducts[index] = { ...updatedProducts[index], [field]: value };
//         if (field === 'product') {
//             const selectedProduct = products.find(p => p._id === value);
//             if (selectedProduct) {
//                 updatedProducts[index].price = selectedProduct.price;
//                 updatedProducts[index].gstRate = selectedProduct.gstRate;
//             }
//         }
//         setValue('products', updatedProducts);
//     };

//     const onSubmit = async (data: InvoiceFormData) => {
//         try {
//             const payload = { ...data, currency: data.currency ?? 'INR' };
//             const newInvoice = await createInvoice(payload);
//             setInvoices([...invoices, newInvoice.invoice]);
//             setShowCreateModal(false);
//             reset();
//         } catch (error: any) {
//             console.error('Error creating invoice:', error);
//             setProductsError(error.response?.data?.message || 'Failed to create invoice.');
//         }
//     };

//     const handleDownloadPDF = async (id: string) => {
//         try {
//             const pdfBlob = await downloadInvoicePDF(id);
//             const url = window.URL.createObjectURL(new Blob([pdfBlob]));
//             const link = document.createElement('a');
//             link.href = url;
//             link.setAttribute('download', `invoice-${id}.pdf`);
//             document.body.appendChild(link);
//             link.click();
//             document.body.removeChild(link);
//         } catch (error) {
//             console.error('Error downloading PDF:', error);
//             alert('Failed to download invoice PDF.');
//         }
//     };

//     const handleSendWhatsApp = async (id: string) => {
//         try {
//             await sendInvoiceWhatsApp(id);
//             alert('Invoice sent via WhatsApp successfully!');
//         } catch (error) {
//             console.error('Error sending WhatsApp:', error);
//             alert('Failed to send invoice via WhatsApp.');
//         }
//     };

//     const totalStats = {
//         total: invoices.length,
//         paid: invoices.filter(inv => inv.status === 'paid').length,
//         pending: invoices.filter(inv => inv.status === 'pending').length,
//         overdue: invoices.filter(inv => inv.status === 'overdue').length,
//         totalAmount: invoices.reduce((sum, inv) => sum + inv.totalAmount, 0),
//     };

//     return (
//         <div className="min-h-screen bg-gray-100 p-6 space-y-6">
//             <div className="flex items-center justify-between">
//                 <div>
//                     <h1 className="text-2xl font-bold text-gray-900">Invoices</h1>
//                     <p className="text-gray-600">Manage your invoices and billing</p>
//                 </div>
//                 <Button
//                     onClick={() => setShowCreateModal(true)}
//                     className="flex items-center space-x-2"
//                     disabled={products.length === 0}
//                 >
//                     <Plus className="w-4 h-4" />
//                     <span>Create Invoice</span>
//                 </Button>
//             </div>

//             {/* Stats Cards */}
//             <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
//                 {['Total Invoices', 'Paid', 'Pending', 'Overdue', 'Total Amount'].map((title, index) => (
//                     <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
//                         <div className="flex items-center justify-between">
//                             <div>
//                                 <p className="text-sm text-gray-600">{title}</p>
//                                 <p className={`text-2xl font-bold ${index === 1 ? 'text-green-600' : index === 2 ? 'text-yellow-600' : index === 3 ? 'text-red-600' : 'text-gray-900'}`}>
//                                     {index === 0 ? totalStats.total :
//                                         index === 1 ? totalStats.paid :
//                                             index === 2 ? totalStats.pending :
//                                                 index === 3 ? totalStats.overdue :
//                                                     `₹${totalStats.totalAmount.toLocaleString('en-IN')}`}
//                                 </p>
//                             </div>
//                             {index === 0 ? <FileText className="w-8 h-8 text-blue-600" /> :
//                                 index === 1 ? <DollarSign className="w-8 h-8 text-green-600" /> :
//                                     index === 2 ? <Clock className="w-8 h-8 text-yellow-600" /> :
//                                         index === 3 ? <Calendar className="w-8 h-8 text-red-600" /> :
//                                             <DollarSign className="w-8 h-8 text-blue-600" />}
//                         </div>
//                     </div>
//                 ))}
//             </div>

//             {/* Search and Filters */}
//             <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
//                 <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
//                     <div className="flex-1">
//                         <div className="relative">
//                             <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
//                             <Input
//                                 placeholder="Search invoices..."
//                                 value={searchTerm}
//                                 onChange={(e) => setSearchTerm(e.target.value)}
//                                 className="pl-10"
//                             />
//                         </div>
//                     </div>
//                     <div className="flex space-x-3">
//                         <Select value={statusFilter} onValueChange={setStatusFilter}>
//                             <SelectTrigger className="w-[180px]">
//                                 <SelectValue placeholder="All Status" />
//                             </SelectTrigger>
//                             <SelectContent>
//                                 <SelectItem value="">All Status</SelectItem>
//                                 <SelectItem value="paid">Paid</SelectItem>
//                                 <SelectItem value="pending">Pending</SelectItem>
//                                 <SelectItem value="overdue">Overdue</SelectItem>
//                                 <SelectItem value="draft">Draft</SelectItem>
//                             </SelectContent>
//                         </Select>
//                         <Button variant="outline" className="flex items-center space-x-2">
//                             <Filter className="w-4 h-4" />
//                             <span>More Filters</span>
//                         </Button>
//                     </div>
//                 </div>
//             </div>

//             {/* Invoices Table */}
//             <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
//                 <Table>
//                     <TableHeader>
//                         <TableRow>
//                             <TableHead>Invoice</TableHead>
//                             <TableHead>Customer</TableHead>
//                             <TableHead>Amount</TableHead>
//                             <TableHead>Status</TableHead>
//                             <TableHead>Created At</TableHead>
//                             <TableHead>Actions</TableHead>
//                         </TableRow>
//                     </TableHeader>
//                     <TableBody>
//                         {loading ? (
//                             <TableRow>
//                                 <TableCell colSpan={6}>Loading invoices...</TableCell>
//                             </TableRow>
//                         ) : filteredInvoices.length === 0 ? (
//                             <TableRow>
//                                 <TableCell colSpan={6} className="text-center py-12">
//                                     <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
//                                     <h3 className="text-lg font-medium text-gray-900 mb-2">No invoices found</h3>
//                                     <p className="text-gray-600">Try adjusting your search or filter criteria</p>
//                                 </TableCell>
//                             </TableRow>
//                         ) : (
//                             filteredInvoices.map((invoice) => (
//                                 <TableRow key={invoice._id} className="hover:bg-gray-50">
//                                     <TableCell>
//                                         <div className="flex items-center">
//                                             <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
//                                                 <FileText className="w-5 h-5 text-blue-600" />
//                                             </div>
//                                             <div>
//                                                 <div className="text-sm font-medium text-gray-900">{invoice.invoiceNumber}</div>
//                                                 <div className="text-sm text-gray-500">
//                                                     {new Date(invoice.createdAt).toLocaleDateString('en-IN')}
//                                                 </div>
//                                             </div>
//                                         </div>
//                                     </TableCell>
//                                     <TableCell>
//                                         <div className="flex items-center">
//                                             <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center mr-3">
//                                                 <FileText className="w-4 h-4 text-gray-600" />
//                                             </div>
//                                             <div>
//                                                 <div className="text-sm font-medium text-gray-900">{invoice.customerName}</div>
//                                                 <div className="text-sm text-gray-500">{invoice.phoneNumber}</div>
//                                             </div>
//                                         </div>
//                                     </TableCell>
//                                     <TableCell>
//                                         <div className="text-sm font-medium text-gray-900">₹{invoice.totalAmount.toLocaleString('en-IN')}</div>
//                                         <div className="text-sm text-gray-500">Tax: ₹{invoice.gstAmount.toLocaleString('en-IN')}</div>
//                                     </TableCell>
//                                     <TableCell>
//                                         <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(invoice.status)}`}>
//                                             {getStatusIcon(invoice.status)}
//                                             <span className="ml-1 capitalize">{invoice.status}</span>
//                                         </span>
//                                     </TableCell>
//                                     <TableCell>
//                                         {new Date(invoice.createdAt).toLocaleDateString('en-IN')}
//                                     </TableCell>
//                                     <TableCell>
//                                         <div className="flex space-x-2">
//                                             <Link to={`/invoices/${invoice._id}`}>
//                                                 <Button variant="ghost" size="icon" title="View">
//                                                     <Eye className="w-4 h-4 text-blue-600" />
//                                                 </Button>
//                                             </Link>
//                                             <Button variant="ghost" size="icon" title="Download" onClick={() => handleDownloadPDF(invoice._id)}>
//                                                 <Download className="w-4 h-4 text-green-600" />
//                                             </Button>
//                                             <Button variant="ghost" size="icon" title="Send WhatsApp" onClick={() => handleSendWhatsApp(invoice._id)}>
//                                                 <Send className="w-4 h-4 text-purple-600" />
//                                             </Button>
//                                             <Button variant="ghost" size="icon" title="Edit" disabled>
//                                                 <Edit className="w-4 h-4 text-gray-600" />
//                                             </Button>
//                                             <Button variant="ghost" size="icon" title="Delete" disabled>
//                                                 <Trash2 className="w-4 h-4 text-red-600" />
//                                             </Button>
//                                         </div>
//                                     </TableCell>
//                                 </TableRow>
//                             ))
//                         )}
//                     </TableBody>
//                 </Table>
//             </div>

//             {/* Create Invoice Modal */}
//             <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
//                 <DialogContent className="max-w-2xl">
//                     <DialogHeader>
//                         <DialogTitle>Create New Invoice</DialogTitle>
//                     </DialogHeader>
//                     {productsLoading ? (
//                         <p>Loading products...</p>
//                     ) : productsError ? (
//                         <p className="text-red-600">{productsError}</p>
//                     ) : products.length === 0 ? (
//                         <p>No products available. Please add products first.</p>
//                     ) : (
//                         <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
//                             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                                 <div>
//                                     <label className="block text-sm font-medium text-gray-700 mb-2">Customer Name *</label>
//                                     <Input {...register('customerName')} />
//                                     <FormError message={errors.customerName?.message} />
//                                 </div>
//                                 <div>
//                                     <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number *</label>
//                                     <Input {...register('phoneNumber')} />
//                                     <FormError message={errors.phoneNumber?.message} />
//                                 </div>
//                                 <div>
//                                     <label className="block text-sm font-medium text-gray-700 mb-2">Payment Method *</label>
//                                     <Select
//                                         onValueChange={(value) => setValue('paymentMethod', value as any)}
//                                         defaultValue="Cash"
//                                     >
//                                         <SelectTrigger>
//                                             <SelectValue placeholder="Select payment method" />
//                                         </SelectTrigger>
//                                         <SelectContent>
//                                             <SelectItem value="Cash">Cash</SelectItem>
//                                             <SelectItem value="UPI">UPI</SelectItem>
//                                             <SelectItem value="Card">Card</SelectItem>
//                                             <SelectItem value="Other">Other</SelectItem>
//                                         </SelectContent>
//                                     </Select>
//                                     <FormError message={errors.paymentMethod?.message} />
//                                 </div>
//                                 <div>
//                                     <label className="block text-sm font-medium text-gray-700 mb-2">Currency *</label>
//                                     <Select
//                                         onValueChange={(value) => setValue('currency', value as any)}
//                                         defaultValue="INR"
//                                     >
//                                         <SelectTrigger>
//                                             <SelectValue placeholder="Select currency" />
//                                         </SelectTrigger>
//                                         <SelectContent>
//                                             <SelectItem value="INR">INR</SelectItem>
//                                             <SelectItem value="USD">USD</SelectItem>
//                                             <SelectItem value="AED">AED</SelectItem>
//                                         </SelectContent>
//                                     </Select>
//                                     <FormError message={errors.currency?.message} />
//                                 </div>
//                             </div>

//                             <div>
//                                 <div className="flex items-center justify-between mb-4">
//                                     <h3 className="text-lg font-semibold text-gray-900">Products</h3>
//                                     <Button type="button" onClick={handleAddProduct} className="flex items-center text-sm" disabled={products.length === 0}>
//                                         <Plus className="w-4 h-4 mr-2" />
//                                         Add Product
//                                     </Button>
//                                 </div>
//                                 <div className="space-y-4">
//                                     {selectedProducts.map((product, index) => (
//                                         <div key={index} className="flex items-center space-x-3">
//                                             <div className="flex-1">
//                                                 <Select
//                                                     onValueChange={(value) => handleProductChange(index, 'product', value)}
//                                                     value={product.product}
//                                                 >
//                                                     <SelectTrigger>
//                                                         <SelectValue placeholder="Select product" />
//                                                     </SelectTrigger>
//                                                     <SelectContent>
//                                                         {products.map((p) => (
//                                                             <SelectItem key={p._id} value={p._id}>{p.name}</SelectItem>
//                                                         ))}
//                                                     </SelectContent>
//                                                 </Select>
//                                                 <FormError message={errors.products?.[index]?.product?.message} />
//                                             </div>
//                                             <div className="w-24">
//                                                 <Input
//                                                     type="number"
//                                                     value={product.quantity}
//                                                     onChange={(e) => handleProductChange(index, 'quantity', parseInt(e.target.value) || 1)}
//                                                     min="1"
//                                                 />
//                                                 <FormError message={errors.products?.[index]?.quantity?.message} />
//                                             </div>
//                                             <div className="w-24">
//                                                 <Input
//                                                     type="number"
//                                                     value={product.price}
//                                                     readOnly
//                                                 />
//                                             </div>
//                                             <div className="w-24">
//                                                 <Input
//                                                     type="number"
//                                                     value={product.gstRate}
//                                                     readOnly
//                                                 />
//                                             </div>
//                                             <Button
//                                                 type="button"
//                                                 variant="ghost"
//                                                 onClick={() => handleRemoveProduct(index)}
//                                                 className="text-red-600 hover:text-red-800"
//                                             >
//                                                 <Trash2 className="w-4 h-4" />
//                                             </Button>
//                                         </div>
//                                     ))}
//                                 </div>
//                             </div>

//                             <FormError message={errors.products?.message || (productsError ?? undefined)} />
//                             <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
//                                 <Button type="button" variant="outline" onClick={() => setShowCreateModal(false)}>
//                                     Cancel
//                                 </Button>
//                                 <Button type="submit" disabled={isSubmitting || products.length === 0}>
//                                     {isSubmitting ? 'Creating...' : 'Create Invoice'}
//                                 </Button>
//                             </div>
//                         </form>
//                     )}
//                 </DialogContent>
//             </Dialog>
//         </div>
//     );
// };

// export default Invoices;



import React, { useState, useEffect } from 'react';
import {
  Plus, Search, Filter, Eye, Download, Send, Edit, Trash2, FileText, DollarSign, Clock, Calendar
} from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { getInvoices, createInvoice, downloadInvoicePDF, sendInvoiceWhatsApp } from '@/services/invoiceService';
import { getProducts } from '@/services/productService';
import type { Invoice, Product as ProductType } from '@/types/index';
import { FormError } from '@/components/FormError';
import { Link } from 'react-router-dom';

const invoiceSchema = z.object({
  customerName: z.string().min(1, 'Customer name is required'),
  phoneNumber: z.string().min(10, 'Phone number must be at least 10 digits'),
  paymentMethod: z.enum(['Cash', 'UPI', 'Card', 'Other']),
  currency: z.enum(['INR', 'USD', 'AED']),
  products: z.array(
    z.object({
      product: z.string().min(1, 'Product is required'),
      quantity: z.number().min(1, 'Quantity must be at least 1'),
      price: z.number().min(0, 'Price must be non-negative'),
      gstRate: z.number().min(0, 'GST rate must be non-negative'),
    })
  ).min(1, 'At least one product is required'),
});

type InvoiceFormData = z.infer<typeof invoiceSchema>;

const Invoices: React.FC = () => {
  const { user, token } = useAuthStore();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [products, setProducts] = useState<ProductType[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [productsLoading, setProductsLoading] = useState(true);
  const [productsError, setProductsError] = useState<string | null>(null);

  const { register, handleSubmit, formState: { errors, isSubmitting }, reset, setValue, watch } = useForm<InvoiceFormData>({
    resolver: zodResolver(invoiceSchema),
    defaultValues: {
      customerName: '',
      phoneNumber: '',
      paymentMethod: 'Cash',
      currency: 'INR',
      products: [], // Initialize empty to avoid invalid default
    },
  });

  const selectedProducts = watch('products');

  useEffect(() => {
    const fetchData = async () => {
      if (!token || !user) return;
      setLoading(true);
      setProductsLoading(true);
      try {
        const invoicesData = await getInvoices();
        setInvoices(invoicesData);
        const productsData = await getProducts();
        // Filter out invalid products
        const validProducts = productsData.filter(p => 
          p._id && typeof p._id === 'string' && p._id.trim() !== '' && 
          p.name && typeof p.name === 'string' && p.name.trim() !== '' && 
          p.price >= 0 && p.gstRate >= 0
        );
        console.log('Fetched products:', validProducts); // Debug log
        setProducts(validProducts);
        if (validProducts.length === 0) {
          setProductsError('No valid products available. Please add products first.');
        } else {
          // Initialize form with first valid product
          setValue('products', [{
            product: validProducts[0]._id,
            quantity: 1,
            price: validProducts[0].price,
            gstRate: validProducts[0].gstRate
          }]);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setProductsError('Failed to load products. Please try again.');
      } finally {
        setLoading(false);
        setProductsLoading(false);
      }
    };
    fetchData();
  }, [user, token, setValue]);

  const filteredInvoices = invoices.filter(invoice => {
    const matchesSearch =
      invoice.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (invoice.customerName && invoice.customerName.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = !statusFilter || invoice.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'overdue': return 'bg-red-100 text-red-800';
      case 'draft': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid': return <DollarSign className="w-4 h-4" />;
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'overdue': return <Calendar className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  const handleAddProduct = () => {
    if (products.length > 0) {
      setValue('products', [...selectedProducts, {
        product: products[0]._id,
        quantity: 1,
        price: products[0].price,
        gstRate: products[0].gstRate
      }]);
    }
  };

  const handleRemoveProduct = (index: number) => {
    setValue('products', selectedProducts.filter((_, i) => i !== index));
  };

  const handleProductChange = (index: number, field: keyof InvoiceFormData['products'][0], value: any) => {
    const updatedProducts = [...selectedProducts];
    updatedProducts[index] = { ...updatedProducts[index], [field]: value };
    if (field === 'product') {
      const selectedProduct = products.find(p => p._id === value);
      if (selectedProduct) {
        updatedProducts[index].price = selectedProduct.price;
        updatedProducts[index].gstRate = selectedProduct.gstRate;
      }
    }
    setValue('products', updatedProducts);
  };

  const onSubmit = async (data: InvoiceFormData) => {
    try {
      const payload = { ...data, currency: data.currency ?? 'INR' };
      const newInvoice = await createInvoice(payload);
      setInvoices([...invoices, newInvoice.invoice]);
      setShowCreateModal(false);
      reset({
        customerName: '',
        phoneNumber: '',
        paymentMethod: 'Cash',
        currency: 'INR',
        products: products.length > 0 ? [{
          product: products[0]._id,
          quantity: 1,
          price: products[0].price,
          gstRate: products[0].gstRate
        }] : [],
      });
    } catch (error: any) {
      console.error('Error creating invoice:', error);
      setProductsError(error.response?.data?.message || 'Failed to create invoice.');
    }
  };

  const handleDownloadPDF = async (id: string) => {
    try {
      const pdfBlob = await downloadInvoicePDF(id);
      const url = window.URL.createObjectURL(new Blob([pdfBlob]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `invoice-${id}.pdf`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error downloading PDF:', error);
      alert('Failed to download invoice PDF.');
    }
  };

  const handleSendWhatsApp = async (id: string) => {
    try {
      await sendInvoiceWhatsApp(id);
      alert('Invoice sent via WhatsApp successfully!');
    } catch (error) {
      console.error('Error sending WhatsApp:', error);
      alert('Failed to send invoice via WhatsApp.');
    }
  };

  const totalStats = {
    total: invoices.length,
    paid: invoices.filter(inv => inv.status === 'paid').length,
    pending: invoices.filter(inv => inv.status === 'pending').length,
    overdue: invoices.filter(inv => inv.status === 'overdue').length,
    totalAmount: invoices.reduce((sum, inv) => sum + (inv.totalAmount || 0), 0),
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Invoices</h1>
          <p className="text-gray-600">Manage your invoices and billing</p>
        </div>
        <Button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center space-x-2"
          disabled={products.length === 0}
        >
          <Plus className="w-4 h-4" />
          <span>Create Invoice</span>
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {['Total Invoices', 'Paid', 'Pending', 'Overdue', 'Total Amount'].map((title, index) => (
          <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{title}</p>
                <p className={`text-2xl font-bold ${index === 1 ? 'text-green-600' : index === 2 ? 'text-yellow-600' : index === 3 ? 'text-red-600' : 'text-gray-900'}`}>
                  {index === 0 ? totalStats.total :
                    index === 1 ? totalStats.paid :
                      index === 2 ? totalStats.pending :
                        index === 3 ? totalStats.overdue :
                          `₹${totalStats.totalAmount.toLocaleString('en-IN')}`}
                </p>
              </div>
              {index === 0 ? <FileText className="w-8 h-8 text-blue-600" /> :
                index === 1 ? <DollarSign className="w-8 h-8 text-green-600" /> :
                  index === 2 ? <Clock className="w-8 h-8 text-yellow-600" /> :
                    index === 3 ? <Calendar className="w-8 h-8 text-red-600" /> :
                      <DollarSign className="w-8 h-8 text-blue-600" />}
            </div>
          </div>
        ))}
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search invoices..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <div className="flex space-x-3">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Status</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="overdue">Overdue</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" className="flex items-center space-x-2">
              <Filter className="w-4 h-4" />
              <span>More Filters</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Invoices Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Invoice</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6}>Loading invoices...</TableCell>
              </TableRow>
            ) : filteredInvoices.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-12">
                  <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No invoices found</h3>
                  <p className="text-gray-600">Try adjusting your search or filter criteria</p>
                </TableCell>
              </TableRow>
            ) : (
              filteredInvoices.map((invoice) => (
                <TableRow key={invoice._id} className="hover:bg-gray-50">
                  <TableCell>
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                        <FileText className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">{invoice.invoiceNumber}</div>
                        <div className="text-sm text-gray-500">
                          {new Date(invoice.createdAt).toLocaleDateString('en-IN')}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center mr-3">
                        <FileText className="w-4 h-4 text-gray-600" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">{invoice.customerName || 'N/A'}</div>
                        <div className="text-sm text-gray-500">{invoice.phoneNumber || 'N/A'}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm font-medium text-gray-900">₹{invoice.totalAmount.toLocaleString('en-IN')}</div>
                    <div className="text-sm text-gray-500">Tax: ₹{(invoice.gstAmount || 0).toLocaleString('en-IN')}</div>
                  </TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(invoice.status)}`}>
                      {getStatusIcon(invoice.status)}
                      <span className="ml-1 capitalize">{invoice.status || 'draft'}</span>
                    </span>
                  </TableCell>
                  <TableCell>
                    {new Date(invoice.createdAt).toLocaleDateString('en-IN')}
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Link to={`/invoices/${invoice._id}`}>
                        <Button variant="ghost" size="icon" title="View">
                          <Eye className="w-4 h-4 text-blue-600" />
                        </Button>
                      </Link>
                      <Button variant="ghost" size="icon" title="Download" onClick={() => handleDownloadPDF(invoice._id)}>
                        <Download className="w-4 h-4 text-green-600" />
                      </Button>
                      <Button variant="ghost" size="icon" title="Send WhatsApp" onClick={() => handleSendWhatsApp(invoice._id)}>
                        <Send className="w-4 h-4 text-purple-600" />
                      </Button>
                      <Button variant="ghost" size="icon" title="Edit" disabled>
                        <Edit className="w-4 h-4 text-gray-600" />
                      </Button>
                      <Button variant="ghost" size="icon" title="Delete" disabled>
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Create Invoice Modal */}
      <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create New Invoice</DialogTitle>
          </DialogHeader>
          {productsLoading ? (
            <p>Loading products...</p>
          ) : productsError ? (
            <p className="text-red-600">{productsError}</p>
          ) : products.length === 0 ? (
            <p>No valid products available. Please add products first.</p>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Customer Name *</label>
                  <Input {...register('customerName')} />
                  <FormError message={errors.customerName?.message} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number *</label>
                  <Input {...register('phoneNumber')} />
                  <FormError message={errors.phoneNumber?.message} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Payment Method *</label>
                  <Select
                    onValueChange={(value) => setValue('paymentMethod', value as any)}
                    defaultValue="Cash"
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select payment method" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Cash">Cash</SelectItem>
                      <SelectItem value="UPI">UPI</SelectItem>
                      <SelectItem value="Card">Card</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormError message={errors.paymentMethod?.message} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Currency *</label>
                  <Select
                    onValueChange={(value) => setValue('currency', value as any)}
                    defaultValue="INR"
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select currency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="INR">INR</SelectItem>
                      <SelectItem value="USD">USD</SelectItem>
                      <SelectItem value="AED">AED</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormError message={errors.currency?.message} />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Products</h3>
                  <Button type="button" onClick={handleAddProduct} className="flex items-center text-sm" disabled={products.length === 0}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Product
                  </Button>
                </div>
                <div className="space-y-4">
                  {selectedProducts.map((product, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <div className="flex-1">
                        <Select
                          onValueChange={(value) => handleProductChange(index, 'product', value)}
                          value={product.product || products[0]._id}
                          disabled={products.length === 0}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select product" />
                          </SelectTrigger>
                          <SelectContent>
                            {products.map((p) => (
                              <SelectItem key={p._id} value={p._id}>{p.name}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormError message={errors.products?.[index]?.product?.message} />
                      </div>
                      <div className="w-24">
                        <Input
                          type="number"
                          value={product.quantity}
                          onChange={(e) => handleProductChange(index, 'quantity', parseInt(e.target.value) || 1)}
                          min="1"
                        />
                        <FormError message={errors.products?.[index]?.quantity?.message} />
                      </div>
                      <div className="w-24">
                        <Input
                          type="number"
                          value={product.price}
                          readOnly
                        />
                      </div>
                      <div className="w-24">
                        <Input
                          type="number"
                          value={product.gstRate}
                          readOnly
                        />
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={() => handleRemoveProduct(index)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              <FormError message={errors.products?.message || (productsError ?? undefined)} />
              <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
                <Button type="button" variant="outline" onClick={() => setShowCreateModal(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting || products.length === 0}>
                  {isSubmitting ? 'Creating...' : 'Create Invoice'}
                </Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Invoices;
