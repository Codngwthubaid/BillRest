import { useEffect, useState, useMemo } from "react";
import {
  Plus, Search, Edit, Trash2, Package, Loader2
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { useAuthStore } from "@/store/auth.store";
import { useServiceStore } from "@/store/service.store";
import type { Service } from "@/types/service.types";
import CreateServiceDialog from "@/components/services/createServices";
import UpdateServiceDialog from "@/components/services/updateServices";
import DeleteServiceDialog from "@/components/services/deleteServices";

export default function Services() {
  const { user } = useAuthStore();
  const {
    services, fetchServices, updateService, deleteService,
    allServices, fetchAllServices
  } = useServiceStore();

  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedEmail, setSelectedEmail] = useState("");
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showUpdateDialog, setShowUpdateDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);

  // 🔁 Fetch correct service list based on role
  useEffect(() => {
    if (user?.role === "clinic") {
      fetchServices();
    } else if (user?.role === "support" || user?.role === "master") {
      fetchAllServices();
    }
  }, [user?.role]);

  // 🧠 Select proper service list based on role
  const serviceList = useMemo(() => {
    if (user?.role === "clinic") return services || [];
    if (user?.role === "support" || user?.role === "master") return allServices?.services || [];
    return [];
  }, [user?.role, services, allServices]);

  const categories = [...new Set(serviceList.map((svc: Service) => svc.category).filter(Boolean))];
  const uniqueEmails = Array.from(
    new Set(serviceList.map((svc) => svc.clinic?.email).filter(Boolean))
  );

  const filtered = serviceList.filter((service: Service) => {
    const matchesSearch = service.name.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = !selectedCategory || service.category === selectedCategory;
    const matchesEmail = !selectedEmail || service.clinic?.email === selectedEmail;
    return matchesSearch && matchesCategory && matchesEmail;
  });


  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="animate-spin size-12 text-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Services</h1>
          <p>Manage your clinic services</p>
        </div>
        {user?.role === "clinic" && (
          <>
            <Button
              onClick={() => setShowCreateDialog(true)}
              className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="w-4 h-4" />
              <span>Add Service</span>
            </Button>
            <CreateServiceDialog open={showCreateDialog} onOpenChange={setShowCreateDialog} />
          </>
        )}
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" />
          <Input
            placeholder="Search services..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        {user?.role !== "clinic" && (
          <div>
            <select
              value={selectedEmail}
              onChange={(e) => setSelectedEmail(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Users</option>
              {uniqueEmails.map((email) => (
                <option key={email} value={email}>{email}</option>
              ))}
            </select>
          </div>
        )}
        <div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">All Categories</option>
            {categories.map((category) => {
              const catStr = String(category);
              return (
                <option key={catStr} value={catStr}>{catStr}</option>
              );
            })}
          </select>
        </div>
      </div>

      {/* Service Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((service: Service) => (
          <Card key={service._id} className="overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Package className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{service.name}</h3>
                  </div>
                </div>
                {user?.role === "clinic" && (
                  <div className="flex space-x-1">
                    <Button variant="ghost" size="sm"
                      onClick={() => { setSelectedService(service); setShowUpdateDialog(true); }}
                      className="hover:text-blue-600">
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm"
                      onClick={() => { setSelectedService(service); setShowDeleteDialog(true); }}
                      className="hover:text-red-600">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                )}
              </div>

              <p className="text-sm mb-4">{service.description}</p>

              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm">Price:</span>
                  <span className="font-semibold">₹{service.price.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Category:</span>
                  <span className="text-sm font-medium">{service.category ?? "-"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Unit:</span>
                  <span className="text-sm font-medium">{service.unit}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Tax Rate:</span>
                  <span className="text-sm font-medium">{service.gstRate}%</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12">
          <Package className="w-12 h-12 mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">No services found</h3>
          <p>Try adjusting your search or filter criteria</p>
        </div>
      )}

      {/* Dialogs */}
      <UpdateServiceDialog
        open={showUpdateDialog}
        service={selectedService}
        onClose={() => setShowUpdateDialog(false)}
        onUpdate={async (id, payload) => {
          await updateService(id, payload);
          setShowUpdateDialog(false);
        }}
      />

      <DeleteServiceDialog
        open={showDeleteDialog}
        serviceName={selectedService?.name ?? ""}
        onClose={() => setShowDeleteDialog(false)}
        onConfirmDelete={async () => {
          if (!selectedService?._id) return;
          await deleteService(selectedService._id);
          setShowDeleteDialog(false);
        }}
      />
    </div>
  );
}
