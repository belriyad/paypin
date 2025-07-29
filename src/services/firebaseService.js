import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  setDoc,
  query,
  where,
  orderBy,
  onSnapshot,
  writeBatch,
  serverTimestamp,
  Timestamp
} from 'firebase/firestore';
import { db, auth } from '../firebase.js';

/**
 * Firebase Database Service for PayPing
 * Handles all Firestore operations for customers, templates, payments, and settings
 */

// Collection names
const COLLECTIONS = {
  CUSTOMERS: 'customers',
  TEMPLATES: 'templates', 
  PAYMENTS: 'payments',
  SETTINGS: 'settings',
  USER_DATA: 'userData'
};

// Get user-specific collection path
const getUserCollection = (collectionName) => {
  const userId = auth.currentUser?.uid;
  if (!userId) throw new Error('You are not signed in. Please sign in to your account to access this feature.');
  return `users/${userId}/${collectionName}`;
};

// Generic CRUD operations
class FirebaseService {
  
  // ===============================
  // CUSTOMER OPERATIONS
  // ===============================
  
  async getCustomers() {
    try {
      const customersRef = collection(db, getUserCollection(COLLECTIONS.CUSTOMERS));
      const q = query(customersRef, orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate?.()?.toISOString() || doc.data().createdAt,
        updatedAt: doc.data().updatedAt?.toDate?.()?.toISOString() || doc.data().updatedAt
      }));
    } catch (error) {
      console.error('Error getting customers:', error);
      throw error;
    }
  }

  async addCustomer(customerData) {
    try {
      const customersRef = collection(db, getUserCollection(COLLECTIONS.CUSTOMERS));
      const docRef = await addDoc(customersRef, {
        ...customerData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      
      // Return the created customer with ID
      const doc = await getDoc(docRef);
      return {
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate?.()?.toISOString(),
        updatedAt: doc.data().updatedAt?.toDate?.()?.toISOString()
      };
    } catch (error) {
      console.error('Error adding customer:', error);
      throw error;
    }
  }

  async updateCustomer(id, updates) {
    try {
      const customerRef = doc(db, getUserCollection(COLLECTIONS.CUSTOMERS), id);
      await updateDoc(customerRef, {
        ...updates,
        updatedAt: serverTimestamp()
      });
      
      // Return updated customer
      const updatedDoc = await getDoc(customerRef);
      return {
        id: updatedDoc.id,
        ...updatedDoc.data(),
        createdAt: updatedDoc.data().createdAt?.toDate?.()?.toISOString(),
        updatedAt: updatedDoc.data().updatedAt?.toDate?.()?.toISOString()
      };
    } catch (error) {
      console.error('Error updating customer:', error);
      throw error;
    }
  }

  async deleteCustomer(id) {
    try {
      const customerRef = doc(db, getUserCollection(COLLECTIONS.CUSTOMERS), id);
      await deleteDoc(customerRef);
      return { success: true };
    } catch (error) {
      console.error('Error deleting customer:', error);
      throw error;
    }
  }

  // ===============================
  // TEMPLATE OPERATIONS
  // ===============================
  
  async getTemplates() {
    try {
      const templatesRef = collection(db, getUserCollection(COLLECTIONS.TEMPLATES));
      const q = query(templatesRef, orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate?.()?.toISOString() || doc.data().createdAt,
        updatedAt: doc.data().updatedAt?.toDate?.()?.toISOString() || doc.data().updatedAt,
        lastUsed: doc.data().lastUsed?.toDate?.()?.toISOString() || doc.data().lastUsed
      }));
    } catch (error) {
      console.error('Error getting templates:', error);
      throw error;
    }
  }

  async addTemplate(templateData) {
    try {
      const templatesRef = collection(db, getUserCollection(COLLECTIONS.TEMPLATES));
      const docRef = await addDoc(templatesRef, {
        ...templateData,
        usage: 0,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        lastUsed: serverTimestamp()
      });
      
      const doc = await getDoc(docRef);
      return {
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate?.()?.toISOString(),
        updatedAt: doc.data().updatedAt?.toDate?.()?.toISOString(),
        lastUsed: doc.data().lastUsed?.toDate?.()?.toISOString()
      };
    } catch (error) {
      console.error('Error adding template:', error);
      throw error;
    }
  }

  async updateTemplate(id, updates) {
    try {
      const templateRef = doc(db, getUserCollection(COLLECTIONS.TEMPLATES), id);
      await updateDoc(templateRef, {
        ...updates,
        updatedAt: serverTimestamp()
      });
      
      const updatedDoc = await getDoc(templateRef);
      return {
        id: updatedDoc.id,
        ...updatedDoc.data(),
        createdAt: updatedDoc.data().createdAt?.toDate?.()?.toISOString(),
        updatedAt: updatedDoc.data().updatedAt?.toDate?.()?.toISOString(),
        lastUsed: updatedDoc.data().lastUsed?.toDate?.()?.toISOString()
      };
    } catch (error) {
      console.error('Error updating template:', error);
      throw error;
    }
  }

  async deleteTemplate(id) {
    try {
      const templateRef = doc(db, getUserCollection(COLLECTIONS.TEMPLATES), id);
      await deleteDoc(templateRef);
      return { success: true };
    } catch (error) {
      console.error('Error deleting template:', error);
      throw error;
    }
  }

  async duplicateTemplate(id) {
    try {
      const templateRef = doc(db, getUserCollection(COLLECTIONS.TEMPLATES), id);
      const templateDoc = await getDoc(templateRef);
      
      if (!templateDoc.exists()) {
        throw new Error('Template not found');
      }
      
      const templateData = templateDoc.data();
      const templatesRef = collection(db, getUserCollection(COLLECTIONS.TEMPLATES));
      
      const duplicatedTemplate = {
        ...templateData,
        name: `${templateData.name} (Copy)`,
        usage: 0,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        lastUsed: serverTimestamp()
      };
      
      const docRef = await addDoc(templatesRef, duplicatedTemplate);
      const newDoc = await getDoc(docRef);
      
      return {
        id: newDoc.id,
        ...newDoc.data(),
        createdAt: newDoc.data().createdAt?.toDate?.()?.toISOString(),
        updatedAt: newDoc.data().updatedAt?.toDate?.()?.toISOString(),
        lastUsed: newDoc.data().lastUsed?.toDate?.()?.toISOString()
      };
    } catch (error) {
      console.error('Error duplicating template:', error);
      throw error;
    }
  }

  // ===============================
  // PAYMENT OPERATIONS
  // ===============================
  
  async getPayments() {
    try {
      const paymentsRef = collection(db, getUserCollection(COLLECTIONS.PAYMENTS));
      const q = query(paymentsRef, orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate?.()?.toISOString() || doc.data().createdAt,
        updatedAt: doc.data().updatedAt?.toDate?.()?.toISOString() || doc.data().updatedAt
      }));
    } catch (error) {
      console.error('Error getting payments:', error);
      throw error;
    }
  }

  async addPayment(paymentData) {
    try {
      const paymentsRef = collection(db, getUserCollection(COLLECTIONS.PAYMENTS));
      const docRef = await addDoc(paymentsRef, {
        ...paymentData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      
      const doc = await getDoc(docRef);
      return {
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate?.()?.toISOString(),
        updatedAt: doc.data().updatedAt?.toDate?.()?.toISOString()
      };
    } catch (error) {
      console.error('Error adding payment:', error);
      throw error;
    }
  }

  async updatePayment(id, updates) {
    try {
      const paymentRef = doc(db, getUserCollection(COLLECTIONS.PAYMENTS), id);
      await updateDoc(paymentRef, {
        ...updates,
        updatedAt: serverTimestamp()
      });
      
      const updatedDoc = await getDoc(paymentRef);
      return {
        id: updatedDoc.id,
        ...updatedDoc.data(),
        createdAt: updatedDoc.data().createdAt?.toDate?.()?.toISOString(),
        updatedAt: updatedDoc.data().updatedAt?.toDate?.()?.toISOString()
      };
    } catch (error) {
      console.error('Error updating payment:', error);
      throw error;
    }
  }

  async deletePayment(id) {
    try {
      const paymentRef = doc(db, getUserCollection(COLLECTIONS.PAYMENTS), id);
      await deleteDoc(paymentRef);
      return { success: true };
    } catch (error) {
      console.error('Error deleting payment:', error);
      throw error;
    }
  }

  // ===============================
  // SETTINGS OPERATIONS
  // ===============================
  
  async getSettings() {
    try {
      const settingsRef = doc(db, getUserCollection(COLLECTIONS.SETTINGS), 'userSettings');
      const settingsDoc = await getDoc(settingsRef);
      
      if (settingsDoc.exists()) {
        return settingsDoc.data();
      } else {
        // Return default settings if none exist
        const defaultSettings = {
          company: {
            name: 'PayPing Solutions',
            email: 'admin@payping.com',
            phone: '+1 (555) 123-4567',
            address: '123 Business St, Suite 100',
            city: 'San Francisco',
            state: 'CA',
            zipCode: '94102',
            website: 'https://payping.com'
          },
          notifications: {
            emailReminders: true,
            smsReminders: false,
            daysBefore: 3,
            escalationDays: 7,
            sendReceipts: true,
            weeklyReports: true
          }
        };
        
        // Save default settings
        await this.updateSettings('company', defaultSettings.company);
        await this.updateSettings('notifications', defaultSettings.notifications);
        
        return defaultSettings;
      }
    } catch (error) {
      console.error('Error getting settings:', error);
      throw error;
    }
  }

  async updateSettings(section, data) {
    try {
      const settingsRef = doc(db, getUserCollection(COLLECTIONS.SETTINGS), 'userSettings');
      const settingsDoc = await getDoc(settingsRef);
      
      let currentSettings = {};
      if (settingsDoc.exists()) {
        currentSettings = settingsDoc.data();
      }
      
      const updatedSettings = {
        ...currentSettings,
        [section]: {
          ...currentSettings[section],
          ...data
        },
        updatedAt: serverTimestamp()
      };
      
      // Use setDoc with merge to create document if it doesn't exist
      await setDoc(settingsRef, updatedSettings, { merge: true });
      return updatedSettings;
    } catch (error) {
      console.error('Error updating settings:', error);
      throw error;
    }
  }

  // ===============================
  // SUBSCRIPTION OPERATIONS
  // ===============================
  
  async getUserSubscription() {
    try {
      const settingsRef = doc(db, getUserCollection(COLLECTIONS.SETTINGS), 'userSettings');
      const settingsDoc = await getDoc(settingsRef);
      
      if (settingsDoc.exists() && settingsDoc.data().subscription) {
        return settingsDoc.data().subscription;
      } else {
        // Return default free plan
        return {
          plan: 'free',
          status: 'active',
          startDate: new Date().toISOString(),
          features: {
            maxCustomers: 10,
            maxReminders: 25,
            templates: 3,
            users: 1
          }
        };
      }
    } catch (error) {
      console.error('Error getting subscription:', error);
      throw error;
    }
  }

  async updateSubscription(subscriptionData) {
    try {
      return await this.updateSettings('subscription', {
        ...subscriptionData,
        updatedAt: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error updating subscription:', error);
      throw error;
    }
  }

  // ===============================
  // REAL-TIME LISTENERS
  // ===============================
  
  onCustomersSnapshot(callback) {
    try {
      const customersRef = collection(db, getUserCollection(COLLECTIONS.CUSTOMERS));
      const q = query(customersRef, orderBy('createdAt', 'desc'));
      
      return onSnapshot(q, (snapshot) => {
        const customers = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate?.()?.toISOString() || doc.data().createdAt,
          updatedAt: doc.data().updatedAt?.toDate?.()?.toISOString() || doc.data().updatedAt
        }));
        callback(customers);
      }, (error) => {
        console.error('Error in customers snapshot:', error);
      });
    } catch (error) {
      console.error('Error setting up customers listener:', error);
      return () => {}; // Return empty unsubscribe function
    }
  }

  onTemplatesSnapshot(callback) {
    try {
      const templatesRef = collection(db, getUserCollection(COLLECTIONS.TEMPLATES));
      const q = query(templatesRef, orderBy('createdAt', 'desc'));
      
      return onSnapshot(q, (snapshot) => {
        const templates = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate?.()?.toISOString() || doc.data().createdAt,
          updatedAt: doc.data().updatedAt?.toDate?.()?.toISOString() || doc.data().updatedAt,
          lastUsed: doc.data().lastUsed?.toDate?.()?.toISOString() || doc.data().lastUsed
        }));
        callback(templates);
      }, (error) => {
        console.error('Error in templates snapshot:', error);
      });
    } catch (error) {
      console.error('Error setting up templates listener:', error);
      return () => {};
    }
  }

  onPaymentsSnapshot(callback) {
    try {
      const paymentsRef = collection(db, getUserCollection(COLLECTIONS.PAYMENTS));
      const q = query(paymentsRef, orderBy('createdAt', 'desc'));
      
      return onSnapshot(q, (snapshot) => {
        const payments = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate?.()?.toISOString() || doc.data().createdAt,
          updatedAt: doc.data().updatedAt?.toDate?.()?.toISOString() || doc.data().updatedAt
        }));
        callback(payments);
      }, (error) => {
        console.error('Error in payments snapshot:', error);
      });
    } catch (error) {
      console.error('Error setting up payments listener:', error);
      return () => {};
    }
  }

  // ===============================
  // BULK OPERATIONS
  // ===============================
  
  async bulkImportCustomers(customers) {
    try {
      const batch = writeBatch(db);
      const customersRef = collection(db, getUserCollection(COLLECTIONS.CUSTOMERS));
      
      customers.forEach((customer) => {
        const docRef = doc(customersRef);
        batch.set(docRef, {
          ...customer,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });
      });
      
      await batch.commit();
      return { success: true, imported: customers.length };
    } catch (error) {
      console.error('Error bulk importing customers:', error);
      throw error;
    }
  }

  async exportAllData() {
    try {
      const [customers, templates, payments, settings] = await Promise.all([
        this.getCustomers(),
        this.getTemplates(),
        this.getPayments(),
        this.getSettings()
      ]);
      
      return {
        customers,
        templates,
        payments,
        settings,
        exportedAt: new Date().toISOString(),
        version: '1.0'
      };
    } catch (error) {
      console.error('Error exporting data:', error);
      throw error;
    }
  }
}

// Create and export a singleton instance
const firebaseService = new FirebaseService();
export default firebaseService;
