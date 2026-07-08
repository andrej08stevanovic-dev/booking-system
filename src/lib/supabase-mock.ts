// Mock Supabase klijent za offline/static demo rad aplikacije.
// Emulira kompletan Supabase query builder i čuva podatke u memoriji servera/klijenta.

import { SupabaseClient } from "@supabase/supabase-js";

export const mockStaff = [
  {
    "id": "6409fa87-0b6f-45e3-aa10-7b1a0fca0bd1",
    "full_name": "Ana Petrović",
    "phone": "+381641111111",
    "email": "ana@optima.rs",
    "is_active": true,
    "created_at": "2026-07-02T15:29:52.149343+00:00"
  },
  {
    "id": "45b82477-56f4-47da-82f8-455c22fd3863",
    "full_name": "Marija Jovanović",
    "phone": "+381642222222",
    "email": "marija@optima.rs",
    "is_active": true,
    "created_at": "2026-07-02T15:29:52.149343+00:00"
  },
  {
    "id": "c2c904ba-c855-410a-9868-ed1b549bbb9e",
    "full_name": "Stefan Nikolić",
    "phone": "+381643333333",
    "email": "stefan@optima.rs",
    "is_active": true,
    "created_at": "2026-07-02T15:29:52.149343+00:00"
  }
];

export const mockServices = [
  {
    "id": "4a71c0bb-9d88-4045-9991-55c4e9b9bdb0",
    "name": "Žensko šišanje",
    "category": "kosa",
    "duration_minutes": 45,
    "price": 1500,
    "is_active": true
  },
  {
    "id": "8a7f5f94-d005-40db-b2af-e01d78ebc17d",
    "name": "Muško šišanje",
    "category": "kosa",
    "duration_minutes": 30,
    "price": 1000,
    "is_active": true
  },
  {
    "id": "3ac4cd62-8c0e-4932-89c3-51449c751852",
    "name": "Feniranje",
    "category": "kosa",
    "duration_minutes": 30,
    "price": 1200,
    "is_active": true
  },
  {
    "id": "62e3a616-4d99-4189-b619-7e4b37f2d87f",
    "name": "Farbanje",
    "category": "kosa",
    "duration_minutes": 90,
    "price": 3500,
    "is_active": true
  },
  {
    "id": "2681a46d-892d-4faa-b10d-aaeda6163fe3",
    "name": "Pramenovi",
    "category": "kosa",
    "duration_minutes": 120,
    "price": 4500,
    "is_active": true
  },
  {
    "id": "7f8aff48-7718-47e4-87f3-aac624f87a7e",
    "name": "Manikir",
    "category": "nokti",
    "duration_minutes": 45,
    "price": 1200,
    "is_active": true
  },
  {
    "id": "beb31911-aaae-435f-a987-8ed76a952cad",
    "name": "Gel lak",
    "category": "nokti",
    "duration_minutes": 60,
    "price": 1800,
    "is_active": true
  },
  {
    "id": "1451817c-6267-4299-a357-da117ffcd278",
    "name": "Nadogradnja noktiju",
    "category": "nokti",
    "duration_minutes": 90,
    "price": 3000,
    "is_active": true
  },
  {
    "id": "62b2b47f-8ce6-4866-bda4-8c918c58c0f7",
    "name": "Pedikir",
    "category": "nokti",
    "duration_minutes": 60,
    "price": 2000,
    "is_active": true
  }
];

export const mockWorkingHours = [
  { "id": "wh1", "staff_id": "6409fa87-0b6f-45e3-aa10-7b1a0fca0bd1", "day_of_week": 1, "start_time": "09:00:00", "end_time": "17:00:00" },
  { "id": "wh2", "staff_id": "45b82477-56f4-47da-82f8-455c22fd3863", "day_of_week": 1, "start_time": "09:00:00", "end_time": "17:00:00" },
  { "id": "wh3", "staff_id": "c2c904ba-c855-410a-9868-ed1b549bbb9e", "day_of_week": 1, "start_time": "09:00:00", "end_time": "17:00:00" },
  { "id": "wh4", "staff_id": "6409fa87-0b6f-45e3-aa10-7b1a0fca0bd1", "day_of_week": 2, "start_time": "09:00:00", "end_time": "17:00:00" },
  { "id": "wh5", "staff_id": "45b82477-56f4-47da-82f8-455c22fd3863", "day_of_week": 2, "start_time": "09:00:00", "end_time": "17:00:00" },
  { "id": "wh6", "staff_id": "c2c904ba-c855-410a-9868-ed1b549bbb9e", "day_of_week": 2, "start_time": "09:00:00", "end_time": "17:00:00" },
  { "id": "wh7", "staff_id": "6409fa87-0b6f-45e3-aa10-7b1a0fca0bd1", "day_of_week": 3, "start_time": "09:00:00", "end_time": "17:00:00" },
  { "id": "wh8", "staff_id": "45b82477-56f4-47da-82f8-455c22fd3863", "day_of_week": 3, "start_time": "09:00:00", "end_time": "17:00:00" },
  { "id": "wh9", "staff_id": "c2c904ba-c855-410a-9868-ed1b549bbb9e", "day_of_week": 3, "start_time": "09:00:00", "end_time": "17:00:00" },
  { "id": "wh10", "staff_id": "6409fa87-0b6f-45e3-aa10-7b1a0fca0bd1", "day_of_week": 4, "start_time": "09:00:00", "end_time": "17:00:00" },
  { "id": "wh11", "staff_id": "45b82477-56f4-47da-82f8-455c22fd3863", "day_of_week": 4, "start_time": "09:00:00", "end_time": "17:00:00" },
  { "id": "wh12", "staff_id": "c2c904ba-c855-410a-9868-ed1b549bbb9e", "day_of_week": 4, "start_time": "09:00:00", "end_time": "17:00:00" },
  { "id": "wh13", "staff_id": "6409fa87-0b6f-45e3-aa10-7b1a0fca0bd1", "day_of_week": 5, "start_time": "09:00:00", "end_time": "17:00:00" },
  { "id": "wh14", "staff_id": "45b82477-56f4-47da-82f8-455c22fd3863", "day_of_week": 5, "start_time": "09:00:00", "end_time": "17:00:00" },
  { "id": "wh15", "staff_id": "c2c904ba-c855-410a-9868-ed1b549bbb9e", "day_of_week": 5, "start_time": "09:00:00", "end_time": "17:00:00" },
  { "id": "wh16", "staff_id": "6409fa87-0b6f-45e3-aa10-7b1a0fca0bd1", "day_of_week": 6, "start_time": "09:00:00", "end_time": "14:00:00" },
  { "id": "wh17", "staff_id": "45b82477-56f4-47da-82f8-455c22fd3863", "day_of_week": 6, "start_time": "09:00:00", "end_time": "14:00:00" }
];

export const mockStaffServices = [
  { "staff_id": "6409fa87-0b6f-45e3-aa10-7b1a0fca0bd1", "service_id": "4a71c0bb-9d88-4045-9991-55c4e9b9bdb0" },
  { "staff_id": "c2c904ba-c855-410a-9868-ed1b549bbb9e", "service_id": "4a71c0bb-9d88-4045-9991-55c4e9b9bdb0" },
  { "staff_id": "c2c904ba-c855-410a-9868-ed1b549bbb9e", "service_id": "8a7f5f94-d005-40db-b2af-e01d78ebc17d" },
  { "staff_id": "6409fa87-0b6f-45e3-aa10-7b1a0fca0bd1", "service_id": "3ac4cd62-8c0e-4932-89c3-51449c751852" },
  { "staff_id": "c2c904ba-c855-410a-9868-ed1b549bbb9e", "service_id": "3ac4cd62-8c0e-4932-89c3-51449c751852" },
  { "staff_id": "6409fa87-0b6f-45e3-aa10-7b1a0fca0bd1", "service_id": "62e3a616-4d99-4189-b619-7e4b37f2d87f" },
  { "staff_id": "6409fa87-0b6f-45e3-aa10-7b1a0fca0bd1", "service_id": "2681a46d-892d-4faa-b10d-aaeda6163fe3" },
  { "staff_id": "6409fa87-0b6f-45e3-aa10-7b1a0fca0bd1", "service_id": "7f8aff48-7718-47e4-87f3-aac624f87a7e" },
  { "staff_id": "45b82477-56f4-47da-82f8-455c22fd3863", "service_id": "7f8aff48-7718-47e4-87f3-aac624f87a7e" },
  { "staff_id": "6409fa87-0b6f-45e3-aa10-7b1a0fca0bd1", "service_id": "beb31911-aaae-435f-a987-8ed76a952cad" },
  { "staff_id": "45b82477-56f4-47da-82f8-455c22fd3863", "service_id": "beb31911-aaae-435f-a987-8ed76a952cad" },
  { "staff_id": "45b82477-56f4-47da-82f8-455c22fd3863", "service_id": "1451817c-6267-4299-a357-da117ffcd278" },
  { "staff_id": "45b82477-56f4-47da-82f8-455c22fd3863", "service_id": "62b2b47f-8ce6-4866-bda4-8c918c58c0f7" }
];

export const mockSettings = [
  {
    "id": 1,
    "slot_interval_minutes": 15,
    "min_lead_minutes": 30,
    "max_horizon_days": 60,
    "timezone": "Europe/Belgrade"
  }
];

export const mockTimeOff: any[] = [];

// Pre-popuni sa par rezervacija kako bi recepcija dashboard imao šta da prikaže na demo-u
const nextWeekDate = () => {
  const d = new Date();
  d.setDate(d.getDate() + 1); // sutra
  d.setHours(10, 0, 0, 0);
  return d.toISOString();
};

export const mockBookings: any[] = [
  {
    "id": "mock-b1",
    "customer_id": "mock-c1",
    "staff_id": "6409fa87-0b6f-45e3-aa10-7b1a0fca0bd1", // Ana Petrović
    "service_id": "4a71c0bb-9d88-4045-9991-55c4e9b9bdb0", // Žensko šišanje
    "starts_at": nextWeekDate(),
    "ends_at": new Date(new Date(nextWeekDate()).getTime() + 45 * 60 * 1000).toISOString(),
    "status": "booked",
    "source": "online",
    "note": "Molim vas sa feniranjem"
  }
];

export const mockCustomers: any[] = [
  {
    "id": "mock-c1",
    "full_name": "Milica Pavlović",
    "phone": "064111222",
    "email": "milica@gmail.com"
  }
];

class MockQueryBuilder {
  private tableName: string;
  private filters: Array<(item: any) => boolean> = [];
  private orderFields: string[] = [];

  constructor(tableName: string) {
    this.tableName = tableName;
  }

  select(columns?: string) {
    return this;
  }

  eq(column: string, value: any) {
    if (column === "is_active") {
      this.filters.push(item => item.is_active === value);
    } else if (column === "staff_id") {
      this.filters.push(item => item.staff_id === value);
    } else if (column === "service_id") {
      this.filters.push(item => item.service_id === value);
    } else if (column === "day_of_week") {
      this.filters.push(item => item.day_of_week === Number(value));
    } else if (column === "phone") {
      this.filters.push(item => item.phone === value);
    } else if (column === "email") {
      this.filters.push(item => item.email?.toLowerCase() === value?.toLowerCase());
    } else if (column === "id") {
      this.filters.push(item => item.id === value);
    } else if (column === "staff.is_active") {
      // filters working hours by active staff
      this.filters.push(item => {
        const staffMember = mockStaff.find(s => s.id === item.staff_id);
        return staffMember ? staffMember.is_active === value : false;
      });
    }
    return this;
  }

  neq(column: string, value: any) {
    if (column === "status") {
      this.filters.push(item => item.status !== value);
    }
    return this;
  }

  lt(column: string, value: any) {
    if (column === "starts_at") {
      this.filters.push(item => item.starts_at < value);
    } else if (column === "ends_at") {
      this.filters.push(item => item.ends_at < value);
    }
    return this;
  }

  gt(column: string, value: any) {
    if (column === "starts_at") {
      this.filters.push(item => item.starts_at > value);
    } else if (column === "ends_at") {
      this.filters.push(item => item.ends_at > value);
    }
    return this;
  }

  gte(column: string, value: any) {
    if (column === "starts_at") {
      this.filters.push(item => item.starts_at >= value);
    }
    return this;
  }

  lte(column: string, value: any) {
    if (column === "starts_at") {
      this.filters.push(item => item.starts_at <= value);
    }
    return this;
  }

  in(column: string, values: any[]) {
    this.filters.push(item => values.includes(item[column]));
    return this;
  }

  ilike(column: string, pattern: string) {
    // case-insensitive exact matching after cleaning up escape chars
    const cleanPattern = pattern.replace(/\\_/g, '_').replace(/\\%/g, '%').replace(/\\\\/g, '\\');
    this.filters.push(item => {
      const val = item[column];
      return typeof val === 'string' && val.toLowerCase() === cleanPattern.toLowerCase();
    });
    return this;
  }

  order(column: string, options?: any) {
    this.orderFields.push(column);
    return this;
  }

  limit(num: number) {
    return this;
  }

  single() {
    return this.then(res => {
      if (res.error) return res;
      return { data: res.data[0] || null, error: null };
    });
  }

  maybeSingle() {
    return this.single();
  }

  async insert(record: any) {
    const records = Array.isArray(record) ? record : [record];
    const inserted: any[] = [];
    for (const r of records) {
      const newRecord = { 
        id: Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15),
        created_at: new Date().toISOString(),
        ...r 
      };
      if (this.tableName === 'bookings') {
        mockBookings.push(newRecord);
      } else if (this.tableName === 'customers') {
        mockCustomers.push(newRecord);
      } else if (this.tableName === 'time_off') {
        mockTimeOff.push(newRecord);
      }
      inserted.push(newRecord);
    }
    return { data: Array.isArray(record) ? inserted : inserted[0], error: null };
  }

  async update(record: any) {
    const items = this.getTargetArray();
    for (const item of items) {
      let match = true;
      for (const filter of this.filters) {
        if (!filter(item)) {
          match = false;
          break;
        }
      }
      if (match) {
        Object.assign(item, record);
      }
    }
    return { data: null, error: null };
  }

  private getTargetArray(): any[] {
    switch (this.tableName) {
      case 'staff': return mockStaff;
      case 'services': return mockServices;
      case 'working_hours': return mockWorkingHours;
      case 'staff_services': return mockStaffServices;
      case 'settings': return mockSettings;
      case 'bookings': return mockBookings;
      case 'time_off': return mockTimeOff;
      case 'customers': return mockCustomers;
      default: return [];
    }
  }

  async then(onfulfilled?: (value: any) => any) {
    let data: any[] = [];
    
    if (this.tableName === 'staff') {
      data = mockStaff.map(s => {
        const sServices = mockStaffServices
          .filter(link => link.staff_id === s.id)
          .map(link => {
            const svc = mockServices.find(service => service.id === link.service_id);
            return { services: svc ? { id: svc.id, name: svc.name, category: svc.category } : null };
          });
        return {
          ...s,
          staff_services: sServices
        };
      });
    } else if (this.tableName === 'bookings') {
      data = mockBookings.map(b => {
        const cust = mockCustomers.find(c => c.id === b.customer_id) || null;
        const svc = mockServices.find(s => s.id === b.service_id) || null;
        const stf = mockStaff.find(s => s.id === b.staff_id) || null;
        return {
          ...b,
          customers: cust ? { full_name: cust.full_name, phone: cust.phone } : null,
          services: svc ? { name: svc.name } : null,
          staff: stf ? { full_name: stf.full_name } : null
        };
      });
    } else if (this.tableName === 'working_hours') {
      // Joins staff status check
      data = mockWorkingHours.map(wh => {
        const stf = mockStaff.find(s => s.id === wh.staff_id);
        return {
          ...wh,
          staff: stf ? { is_active: stf.is_active } : null
        };
      });
    } else {
      data = JSON.parse(JSON.stringify(this.getTargetArray()));
    }

    // Apply filters
    for (const filter of this.filters) {
      data = data.filter(filter);
    }

    // Apply ordering
    if (this.orderFields.includes('full_name')) {
      data.sort((a, b) => (a.full_name || '').localeCompare(b.full_name || ''));
    } else if (this.orderFields.includes('category')) {
      data.sort((a, b) => (a.category || '').localeCompare(b.category || ''));
    }

    const result = { data, error: null };
    return onfulfilled ? onfulfilled(result) : result;
  }
}

export const mockSupabaseClient = {
  from(tableName: string) {
    return new MockQueryBuilder(tableName) as any;
  },
  channel(channelName: string) {
    return {
      on(type: string, filter: any, callback: () => void) {
        return this;
      },
      subscribe() {
        return this;
      },
      async httpSend(event: string, payload: any) {
        return { error: null };
      }
    } as any;
  },
  async removeChannel(channel: any) {
    return { error: null } as any;
  },
  auth: {
    async getUser() {
      return { data: { user: null }, error: null } as any;
    },
    async signInWithOtp(params: any) {
      return { data: null, error: null } as any;
    },
    async signOut() {
      return { data: null, error: null } as any;
    },
    async exchangeCodeForSession(code: string) {
      return { data: null, error: null } as any;
    }
  } as any
} as unknown as SupabaseClient<any>;
