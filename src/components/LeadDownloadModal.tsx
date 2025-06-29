import { useState } from 'react';
import { X, Download, Calendar, Filter, FileSpreadsheet, Building } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface LeadDownloadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Lead {
  id: string;
  name: string;
  phone: string;
  email: string;
  propertyTitle: string;
  propertyId: string;
  inquiryDate: string;
  status: 'new' | 'contacted' | 'visited' | 'closed';
  source: 'website' | 'whatsapp' | 'call';
}

const mockLeads: Lead[] = [
  {
    id: '1',
    name: 'Rahul Sharma',
    phone: '+91 98765 43210',
    email: 'rahul.sharma@email.com',
    propertyTitle: '3BHK Apartment in Nerul',
    propertyId: 'PROP001',
    inquiryDate: '2024-01-15',
    status: 'new',
    source: 'website'
  },
  {
    id: '2',
    name: 'Priya Patel',
    phone: '+91 87654 32109',
    email: 'priya.patel@email.com',
    propertyTitle: 'Villa in Kharghar',
    propertyId: 'PROP002',
    inquiryDate: '2024-01-14',
    status: 'contacted',
    source: 'whatsapp'
  },
  {
    id: '3',
    name: 'Amit Kumar',
    phone: '+91 76543 21098',
    email: 'amit.kumar@email.com',
    propertyTitle: 'Penthouse in Vashi',
    propertyId: 'PROP003',
    inquiryDate: '2024-01-13',
    status: 'visited',
    source: 'call'
  },
  {
    id: '4',
    name: 'Sneha Reddy',
    phone: '+91 65432 10987',
    email: 'sneha.reddy@email.com',
    propertyTitle: '2BHK Flat in Airoli',
    propertyId: 'PROP004',
    inquiryDate: '2024-01-12',
    status: 'closed',
    source: 'website'
  },
  {
    id: '5',
    name: 'Vikram Singh',
    phone: '+91 54321 09876',
    email: 'vikram.singh@email.com',
    propertyTitle: 'Studio Apartment in Seawoods',
    propertyId: 'PROP005',
    inquiryDate: '2024-01-11',
    status: 'new',
    source: 'whatsapp'
  }
];

const mockProperties = [
  { id: 'PROP001', title: '3BHK Apartment in Nerul' },
  { id: 'PROP002', title: 'Villa in Kharghar' },
  { id: 'PROP003', title: 'Penthouse in Vashi' },
  { id: 'PROP004', title: '2BHK Flat in Airoli' },
  { id: 'PROP005', title: 'Studio Apartment in Seawoods' },
];

const LeadDownloadModal = ({ isOpen, onClose }: LeadDownloadModalProps) => {
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
    propertyId: '',
    status: '',
    source: ''
  });

  if (!isOpen) return null;

  const filteredLeads = mockLeads.filter(lead => {
    if (filters.startDate && lead.inquiryDate < filters.startDate) return false;
    if (filters.endDate && lead.inquiryDate > filters.endDate) return false;
    if (filters.propertyId && lead.propertyId !== filters.propertyId) return false;
    if (filters.status && lead.status !== filters.status) return false;
    if (filters.source && lead.source !== filters.source) return false;
    return true;
  });

  const downloadExcel = () => {
    // Create CSV content
    const headers = ['Name', 'Phone', 'Email', 'Property', 'Inquiry Date', 'Status', 'Source'];
    const csvContent = [
      headers.join(','),
      ...filteredLeads.map(lead => [
        lead.name,
        lead.phone,
        lead.email,
        lead.propertyTitle,
        lead.inquiryDate,
        lead.status,
        lead.source
      ].join(','))
    ].join('\n');

    // Create and download file
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `leads_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);

    // Show success message
    alert(`Downloaded ${filteredLeads.length} leads successfully!`);
  };

  const clearFilters = () => {
    setFilters({
      startDate: '',
      endDate: '',
      propertyId: '',
      status: '',
      source: ''
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-card rounded-2xl w-full max-w-2xl max-h-[80vh] overflow-hidden animate-scale-in">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div>
            <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
              <Download className="w-6 h-6" />
              Download Leads
            </h3>
            <p className="text-sm text-muted-foreground">Export your property leads to Excel</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-muted/20 rounded-full transition-colors tap-scale"
          >
            <X className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>

        {/* Filters */}
        <div className="p-6 space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="w-5 h-5 text-primary" />
            <h4 className="text-lg font-semibold">Filter Options</h4>
          </div>

          {/* Date Range */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Start Date</label>
              <Input
                type="date"
                value={filters.startDate}
                onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">End Date</label>
              <Input
                type="date"
                value={filters.endDate}
                onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
              />
            </div>
          </div>

          {/* Property Filter */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Property</label>
            <Select value={filters.propertyId} onValueChange={(value) => setFilters({ ...filters, propertyId: value })}>
              <SelectTrigger>
                <SelectValue placeholder="All Properties" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Properties</SelectItem>
                {mockProperties.map((property) => (
                  <SelectItem key={property.id} value={property.id}>
                    {property.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Status and Source Filters */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Status</label>
              <Select value={filters.status} onValueChange={(value) => setFilters({ ...filters, status: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Status</SelectItem>
                  <SelectItem value="new">New</SelectItem>
                  <SelectItem value="contacted">Contacted</SelectItem>
                  <SelectItem value="visited">Visited</SelectItem>
                  <SelectItem value="closed">Closed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Source</label>
              <Select value={filters.source} onValueChange={(value) => setFilters({ ...filters, source: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="All Sources" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Sources</SelectItem>
                  <SelectItem value="website">Website</SelectItem>
                  <SelectItem value="whatsapp">WhatsApp</SelectItem>
                  <SelectItem value="call">Call</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Clear Filters */}
          <Button
            onClick={clearFilters}
            variant="outline"
            size="sm"
            className="w-full"
          >
            Clear All Filters
          </Button>
        </div>

        {/* Preview */}
        <div className="px-6 pb-4">
          <div className="bg-muted/20 rounded-lg p-4">
            <h5 className="font-semibold text-foreground mb-2 flex items-center gap-2">
              <FileSpreadsheet className="w-4 h-4" />
              Preview
            </h5>
            <div className="text-sm text-muted-foreground space-y-1">
              <p><strong>Total Leads:</strong> {filteredLeads.length}</p>
              <p><strong>Date Range:</strong> {filters.startDate || 'All'} to {filters.endDate || 'All'}</p>
              <p><strong>Property:</strong> {filters.propertyId ? mockProperties.find(p => p.id === filters.propertyId)?.title : 'All Properties'}</p>
              <p><strong>Status:</strong> {filters.status || 'All'}</p>
              <p><strong>Source:</strong> {filters.source || 'All'}</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-border">
          <Button
            onClick={onClose}
            variant="outline"
          >
            Cancel
          </Button>

          <Button
            onClick={downloadExcel}
            className="bg-zameen-gradient text-white flex items-center gap-2"
            disabled={filteredLeads.length === 0}
          >
            <Download className="w-4 h-4" />
            Download Excel ({filteredLeads.length} leads)
          </Button>
        </div>
      </div>
    </div>
  );
};

export default LeadDownloadModal;