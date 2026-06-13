export interface User {
  id: number;
  email: string;
  name: string;
  role: 'ADMIN' | 'BARBER' | 'CUSTOMER';
  phone?: string;
}

export interface Barber {
  id: number;
  userId: number;
  specialty: string;
  experience: number;
  bio: string;
  isActive: boolean;
  compensationType?: 'COMMISSION' | 'FIXED' | 'HYBRID';
  baseSalary?: number;
  commissionRate?: number;
  user?: {
    id: number;
    name: string;
    email: string;
  };
  schedule?: Schedule[];
  portfolio?: Portfolio[];
}

export interface Service {
  id: number;
  name: string;
  description?: string;
  price: number;
  duration: number;
}

export interface BookingPayment {
  id?: number;
  status: 'UNPAID' | 'PARTIAL' | 'PAID' | 'REFUNDED';
  amount: number;
  discountAmount?: number;
  promoCode?: string;
  finalAmount?: number;
  paidAmount?: number;
  method?: string | null;
  paidAt?: string | null;
}

export interface Booking {
  id: number;
  customerId: number;
  barberId: number;
  serviceId: number;
  resourceId?: number;
  bookingDate: string;
  startTime: string;
  endTime: string;
  status: 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED' | 'NO_SHOW';
  totalAmount: number;
  notes?: string;
  customer?: User;
  barber?: Barber;
  service?: Service;
  resource?: Resource;
  payment?: BookingPayment;
  review?: Review;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  name: string;
  phone?: string;
}

export interface Payment {
  id: number;
  bookingId: number;
  amount: number;
  paidAmount?: number;
  method?: string | null;
  status: 'UNPAID' | 'PARTIAL' | 'PAID' | 'REFUNDED';
  paidAt?: string | null;
  createdAt: string;
  booking?: Booking;
}

export interface Inventory {
  id: number;
  name: string;
  description?: string;
  quantity: number;
  minStock: number;
  unitCost: number;
  unit: string;
}

export interface Resource {
  id: number;
  name: string;
  type: string;
  capacity?: number;
  isActive: boolean;
}

export interface ReportDashboard {
  totalRevenue: number;
  totalBookings: number;
  averageBookingValue: number;
  activeBarbers: number;
}

export interface RevenueReport {
  date: string;
  revenue: number;
}

export interface BookingReport {
  date: string;
  count: number;
}

export interface PayrollPreview {
  barberId: number;
  barberName: string;
  compensationType: 'COMMISSION' | 'FIXED' | 'HYBRID';
  commissionRate: number;
  periodStart: string;
  periodEnd: string;
  bookingCount: number;
  totalRevenue: number;
  baseSalaryPortion: number;
  commission: number;
  bonus: number;
  deductions: number;
  total: number;
}

export interface Payroll {
  id: number;
  barberId: number;
  barber?: { user?: { name?: string } };
  baseSalary?: number;
  commission?: number;
  bonus?: number;
  deductions?: number;
  total: number;
  type?: 'COMMISSION' | 'FIXED' | 'HYBRID';
  isPaid: boolean;
  paidAt?: string;
  periodStart: string;
  periodEnd: string;
  createdAt: string;
}

export interface Customer {
  id: number;
  name: string;
  email: string;
  phone?: string;
  createdAt?: string;
  customerData?: {
    totalVisits?: number;
    totalSpent?: number;
    lastVisit?: string;
  } | null;
}

export interface CustomerData {
  name: string;
  email: string;
  phone?: string;
}

export interface Promo {
  id: number;
  code: string;
  name?: string;
  description?: string;
  discountType: 'PERCENTAGE' | 'FIXED';
  discountValue: number;
  minSpend?: number;
  maxUses?: number;
  usedCount?: number;
  startDate?: string;
  endDate: string;
  isActive: boolean;
}

export interface Notification {
  id: number;
  userId: number;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export interface BusinessSettings {
  id: number;
  businessName: string;
  operatingHours: {
    open: string;
    close: string;
  };
  address: string;
  phone: string;
  email: string;
  bookingSettings: {
    minAdvanceHours: number;
    maxAdvanceDays: number;
    barberSelectionFee: number;
  };
}

export interface Review {
  id: number;
  bookingId: number;
  customerId: number;
  barberId: number;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface Schedule {
  id: number;
  barberId: number;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
}

export interface Portfolio {
  id: number;
  barberId: number;
  imageUrl: string;
  description?: string;
}
