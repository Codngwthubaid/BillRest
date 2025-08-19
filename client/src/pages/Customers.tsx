import { useState, useEffect } from "react";
import { useCustomerStore } from "@/store/customers.store";
import { exportToCSV } from "@/lib/exportCsv";
import CustomerCard from "@/components/customer/CustomerCard";
import CustomerDetailsDialog from "@/components/customer/CustomerDetailsDialog";
import type { Customer, Invoice } from "@/types/customers.types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import InvoiceDetailDialog from "@/components/customer/InvoiceDetailDialog";
import ProtectedPinDialog from "@/components/invoices/ProtectedPinDialog";
import ConfirmDeleteDialog from "@/components/customer/DeleteCustomerDialog";
import { parseISO, isSameMonth } from "date-fns";
import { useAuthStore } from "@/store/auth.store";

export default function CustomerPage() {
    const { customers, allCustomers, loading, fetchCustomers, fetchAllCustomers, deleteCustomer } = useCustomerStore();

    const { user } = useAuthStore();
    const [search, setSearch] = useState("");
    const [showPinDialog, setShowPinDialog] = useState(false);
    const [showConfirmDialog, setShowConfirmDialog] = useState(false);
    const [customerToDelete, setCustomerToDelete] = useState<Customer | null>(null);
    const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
    const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
    const [selectedEmail, setSelectedEmail] = useState("");
    const [selectedState, setSelectedState] = useState("");


    const customerList = user?.role === "customer" ? customers : allCustomers;
    const uniqueEmails = Array.from(new Set((customerList ?? []).map(c => c.user?.email).filter(Boolean)));
    const uniqueStates = Array.from(new Set((customerList ?? []).map(c => c.state).filter(Boolean)));

    // handle fetching by role
    useEffect(() => {
        if (user?.role === "customer") {
            fetchCustomers();
        } else if (user?.role === "support" || user?.role === "master") {
            fetchAllCustomers();
        }
    }, [user?.role]);

    const handleDeleteCustomer = (customer: Customer) => {
        setCustomerToDelete(customer);
        setShowPinDialog(true);
    };

    const pinCallback = () => {
        setShowPinDialog(false);
        setShowConfirmDialog(true);
    };

    const currentMonth = new Date();

    const newThisMonth = customers.filter(customer => {
        const invoices = customer.invoices || [];
        if (invoices.length === 0) return false;

        const firstInvoiceDate = invoices
            .map(inv => parseISO(inv.createdAt))
            .sort((a, b) => a.getTime() - b.getTime())[0];

        return isSameMonth(firstInvoiceDate, currentMonth);
    }).length;

    const activeThisMonth = customers.filter(customer =>
        customer.invoices?.some(inv =>
            isSameMonth(parseISO(inv.createdAt), currentMonth)
        )
    ).length;

    return (
        <div className="max-w-7xl mx-auto p-6">
            <h1 className="text-3xl font-bold mb-2">Customers</h1>
            <p className="mb-6">Manage your customer database</p>

            {user?.role === "customer" && (
                <div className="flex justify-between items-center flex-col sm:flex-row gap-4 mb-6">
                    <div className="rounded-xl p-4 border-2 w-full">
                        <p className="text-sm">Total Customers</p>
                        <p className="text-2xl font-semibold">{customers.length}</p>
                    </div>
                    <div className="rounded-xl p-4 border-2 w-full">
                        <p className="text-sm">Active This Month</p>
                        <p className="text-2xl font-semibold text-green-600">{activeThisMonth}</p>
                    </div>
                    <div className="rounded-xl p-4 border-2 w-full">
                        <p className="text-sm">New This Month</p>
                        <p className="text-2xl font-semibold text-purple-600">{newThisMonth}</p>
                    </div>
                </div>
            )}

            {/* Search & Export */}
            <div className="flex flex-col sm:flex-row flex-wrap gap-4 mb-6">
                <Input
                    placeholder="Search by name, phone, or state..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="flex-1 min-w-[220px]"
                />
                
                {user?.role !== "customer" && (
                    <select
                        value={selectedEmail}
                        onChange={(e) => setSelectedEmail(e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-lg min-w-[200px]"
                    >
                        <option value="">All Emails</option>
                        {uniqueEmails.map(email => (
                            <option key={email} value={email}>{email}</option>
                        ))}
                    </select>
                )}

                <select
                    value={selectedState}
                    onChange={(e) => setSelectedState(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg min-w-[200px]"
                >
                    <option value="">All States</option>
                    {uniqueStates.map(state => (
                        <option key={state} value={state}>{state}</option>
                    ))}
                </select>

                {user?.role === "customer" && (
                    <Button
                        onClick={() => exportToCSV(customers, "customers.csv")}
                        className="bg-green-600 text-white"
                    >
                        Export CSV
                    </Button>
                )}
            </div>


            {/* Customer cards */}
            {loading && <p>Loading...</p>}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {customerList
                    .filter(c => {
                        const matchesSearch =
                            c.phoneNumber.includes(search) ||
                            c.name.toLowerCase().includes(search.toLowerCase()) ||
                            c.state?.toLowerCase().includes(search.toLowerCase());

                        const matchesEmail = !selectedEmail || c.user?.email === selectedEmail;
                        const matchesState = !selectedState || c.state === selectedState;

                        return matchesSearch && matchesEmail && matchesState;
                    })
                    .map(customer => (
                        <CustomerCard
                            key={customer._id}
                            customer={customer}
                            onViewDetails={() => setSelectedCustomer(customer)}
                            onDelete={() => handleDeleteCustomer(customer)}
                        />
                    ))}
            </div>


            {/* Modals */}
            <CustomerDetailsDialog
                customer={selectedCustomer && selectedCustomer._id ? selectedCustomer : null}
                onClose={() => setSelectedCustomer(null)}
                onSelectInvoice={(invoice) => setSelectedInvoice(invoice)}
            />

            <InvoiceDetailDialog
                invoice={selectedInvoice && selectedInvoice._id ? selectedInvoice : null}
                onClose={() => setSelectedInvoice(null)}
            />

            <ProtectedPinDialog
                open={showPinDialog}
                onClose={() => setShowPinDialog(false)}
                onVerified={pinCallback}
            />

            <ConfirmDeleteDialog
                open={showConfirmDialog}
                onClose={() => setShowConfirmDialog(false)}
                onConfirm={async () => {
                    if (customerToDelete) {
                        await deleteCustomer(customerToDelete._id);
                    }
                    setShowConfirmDialog(false);
                    setCustomerToDelete(null);
                }}
                title="Delete Customer"
                message={`Are you sure you want to delete ${customerToDelete?.name}?`}
            />
        </div>
    );
}
