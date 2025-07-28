import { useAppData } from '../contexts/AppDataContext';

export default class DataExportService {
  static formatDateForExport(date) {
    if (!date) return '';
    const dateObj = date.toDate ? date.toDate() : new Date(date);
    return dateObj.toISOString().split('T')[0]; // YYYY-MM-DD format
  }

  static formatCurrencyForExport(amount) {
    return amount ? amount.toString() : '0';
  }

  static convertToCSV(data, headers) {
    const csvRows = [];
    
    // Add headers
    csvRows.push(headers.join(','));
    
    // Add data rows
    data.forEach(row => {
      const values = headers.map(header => {
        const value = row[header] || '';
        // Escape quotes and wrap in quotes if contains comma
        if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
          return `"${value.replace(/"/g, '""')}"`;
        }
        return value;
      });
      csvRows.push(values.join(','));
    });
    
    return csvRows.join('\n');
  }

  static downloadCSV(csvContent, filename) {
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    
    if (navigator.msSaveBlob) {
      // IE 10+
      navigator.msSaveBlob(blob, filename);
    } else {
      const url = URL.createObjectURL(blob);
      link.href = url;
      link.download = filename;
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }
  }

  static exportCustomers(customers) {
    const headers = ['name', 'email', 'phone', 'company', 'address', 'createdAt'];
    
    const exportData = customers.map(customer => ({
      name: customer.name || '',
      email: customer.email || '',
      phone: customer.phone || '',
      company: customer.company || '',
      address: customer.address || '',
      createdAt: this.formatDateForExport(customer.createdAt)
    }));

    const csvContent = this.convertToCSV(exportData, headers);
    const filename = `customers_export_${new Date().toISOString().split('T')[0]}.csv`;
    
    this.downloadCSV(csvContent, filename);
    return { success: true, filename, recordCount: customers.length };
  }

  static exportPayments(payments, customers) {
    const headers = ['customerName', 'customerEmail', 'amount', 'status', 'dueDate', 'paidDate', 'description', 'createdAt'];
    
    const exportData = payments.map(payment => {
      const customer = customers.find(c => c.id === payment.customerId);
      return {
        customerName: customer?.name || 'Unknown',
        customerEmail: customer?.email || '',
        amount: this.formatCurrencyForExport(payment.amount),
        status: payment.status || '',
        dueDate: this.formatDateForExport(payment.dueDate),
        paidDate: payment.paidDate ? this.formatDateForExport(payment.paidDate) : '',
        description: payment.description || '',
        createdAt: this.formatDateForExport(payment.createdAt)
      };
    });

    const csvContent = this.convertToCSV(exportData, headers);
    const filename = `payments_export_${new Date().toISOString().split('T')[0]}.csv`;
    
    this.downloadCSV(csvContent, filename);
    return { success: true, filename, recordCount: payments.length };
  }

  static exportTemplates(templates) {
    const headers = ['name', 'type', 'subject', 'content', 'createdAt'];
    
    const exportData = templates.map(template => ({
      name: template.name || '',
      type: template.type || '',
      subject: template.subject || '',
      content: template.content || '',
      createdAt: this.formatDateForExport(template.createdAt)
    }));

    const csvContent = this.convertToCSV(exportData, headers);
    const filename = `templates_export_${new Date().toISOString().split('T')[0]}.csv`;
    
    this.downloadCSV(csvContent, filename);
    return { success: true, filename, recordCount: templates.length };
  }

  static generateFinancialReport(payments, customers, dateRange = null) {
    let filteredPayments = payments;
    
    if (dateRange) {
      const startDate = new Date(dateRange.start);
      const endDate = new Date(dateRange.end);
      
      filteredPayments = payments.filter(payment => {
        const paymentDate = payment.createdAt?.toDate ? payment.createdAt.toDate() : new Date(payment.createdAt);
        return paymentDate >= startDate && paymentDate <= endDate;
      });
    }

    const reportData = {
      summary: {
        totalPayments: filteredPayments.length,
        totalAmount: filteredPayments.reduce((sum, p) => sum + (p.amount || 0), 0),
        paidAmount: filteredPayments.filter(p => p.status === 'paid').reduce((sum, p) => sum + (p.amount || 0), 0),
        pendingAmount: filteredPayments.filter(p => p.status === 'pending').reduce((sum, p) => sum + (p.amount || 0), 0),
        overdueAmount: filteredPayments.filter(p => p.status === 'overdue').reduce((sum, p) => sum + (p.amount || 0), 0),
      },
      paymentsByStatus: {
        paid: filteredPayments.filter(p => p.status === 'paid').length,
        pending: filteredPayments.filter(p => p.status === 'pending').length,
        overdue: filteredPayments.filter(p => p.status === 'overdue').length,
      },
      topCustomers: this.getTopCustomersByRevenue(filteredPayments, customers, 10),
      monthlyBreakdown: this.getMonthlyBreakdown(filteredPayments)
    };

    // Export detailed financial report
    const headers = ['metric', 'value'];
    const exportRows = [];
    
    // Summary section
    exportRows.push({ metric: 'FINANCIAL SUMMARY', value: '' });
    exportRows.push({ metric: 'Total Payments', value: reportData.summary.totalPayments });
    exportRows.push({ metric: 'Total Amount', value: this.formatCurrencyForExport(reportData.summary.totalAmount) });
    exportRows.push({ metric: 'Paid Amount', value: this.formatCurrencyForExport(reportData.summary.paidAmount) });
    exportRows.push({ metric: 'Pending Amount', value: this.formatCurrencyForExport(reportData.summary.pendingAmount) });
    exportRows.push({ metric: 'Overdue Amount', value: this.formatCurrencyForExport(reportData.summary.overdueAmount) });
    exportRows.push({ metric: '', value: '' });
    
    // Status breakdown
    exportRows.push({ metric: 'PAYMENT STATUS BREAKDOWN', value: '' });
    exportRows.push({ metric: 'Paid Payments', value: reportData.paymentsByStatus.paid });
    exportRows.push({ metric: 'Pending Payments', value: reportData.paymentsByStatus.pending });
    exportRows.push({ metric: 'Overdue Payments', value: reportData.paymentsByStatus.overdue });
    exportRows.push({ metric: '', value: '' });
    
    // Top customers
    exportRows.push({ metric: 'TOP CUSTOMERS BY REVENUE', value: '' });
    reportData.topCustomers.forEach((customer, index) => {
      exportRows.push({ 
        metric: `${index + 1}. ${customer.name}`, 
        value: this.formatCurrencyForExport(customer.totalRevenue) 
      });
    });

    const csvContent = this.convertToCSV(exportRows, headers);
    const dateString = dateRange 
      ? `${dateRange.start}_to_${dateRange.end}` 
      : new Date().toISOString().split('T')[0];
    const filename = `financial_report_${dateString}.csv`;
    
    this.downloadCSV(csvContent, filename);
    return { success: true, filename, data: reportData };
  }

  static getTopCustomersByRevenue(payments, customers, limit = 10) {
    const customerRevenue = {};
    
    payments
      .filter(p => p.status === 'paid')
      .forEach(payment => {
        if (!customerRevenue[payment.customerId]) {
          customerRevenue[payment.customerId] = 0;
        }
        customerRevenue[payment.customerId] += payment.amount || 0;
      });

    return Object.entries(customerRevenue)
      .map(([customerId, totalRevenue]) => {
        const customer = customers.find(c => c.id === customerId);
        return {
          id: customerId,
          name: customer?.name || 'Unknown Customer',
          email: customer?.email || '',
          totalRevenue,
          paymentCount: payments.filter(p => p.customerId === customerId && p.status === 'paid').length
        };
      })
      .sort((a, b) => b.totalRevenue - a.totalRevenue)
      .slice(0, limit);
  }

  static getMonthlyBreakdown(payments) {
    const monthlyData = {};
    
    payments.forEach(payment => {
      const date = payment.createdAt?.toDate ? payment.createdAt.toDate() : new Date(payment.createdAt);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      
      if (!monthlyData[monthKey]) {
        monthlyData[monthKey] = {
          totalPayments: 0,
          totalAmount: 0,
          paidAmount: 0,
          pendingAmount: 0,
          overdueAmount: 0
        };
      }
      
      monthlyData[monthKey].totalPayments++;
      monthlyData[monthKey].totalAmount += payment.amount || 0;
      
      if (payment.status === 'paid') {
        monthlyData[monthKey].paidAmount += payment.amount || 0;
      } else if (payment.status === 'pending') {
        monthlyData[monthKey].pendingAmount += payment.amount || 0;
      } else if (payment.status === 'overdue') {
        monthlyData[monthKey].overdueAmount += payment.amount || 0;
      }
    });
    
    return Object.entries(monthlyData)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([month, data]) => ({ month, ...data }));
  }

  static parseCSVFile(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          const csv = e.target.result;
          const lines = csv.split('\n').filter(line => line.trim());
          
          if (lines.length < 2) {
            reject(new Error('CSV file must contain at least a header row and one data row'));
            return;
          }
          
          const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
          const rows = [];
          
          for (let i = 1; i < lines.length; i++) {
            const values = this.parseCSVRow(lines[i]);
            if (values.length === headers.length) {
              const row = {};
              headers.forEach((header, index) => {
                row[header] = values[index];
              });
              rows.push(row);
            }
          }
          
          resolve({ headers, rows });
        } catch (error) {
          reject(new Error(`Error parsing CSV: ${error.message}`));
        }
      };
      
      reader.onerror = () => reject(new Error('Error reading file'));
      reader.readAsText(file);
    });
  }

  static parseCSVRow(row) {
    const values = [];
    let current = '';
    let inQuotes = false;
    
    for (let i = 0; i < row.length; i++) {
      const char = row[i];
      
      if (char === '"') {
        if (inQuotes && row[i + 1] === '"') {
          current += '"';
          i++; // Skip next quote
        } else {
          inQuotes = !inQuotes;
        }
      } else if (char === ',' && !inQuotes) {
        values.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    
    values.push(current.trim());
    return values;
  }
}
