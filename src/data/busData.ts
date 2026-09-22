export interface BusCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
}

export interface BusService {
  id: string;
  categoryId: string;
  serviceName: string;
  busNumber?: string;
  availability: string;
  tags: string[];
}

export interface Route {
  id: string;
  from: string;
  to: string;
}

// Sample records keep the UI usable until verified backend data is available.
export const BUS_CATEGORIES: BusCategory[] = [
  {
    id: "ordinary",
    name: "Ordinary",
    description: "Regular local service",
    icon: "bus-outline",
  },
  {
    id: "mini",
    name: "Mini Bus",
    description: "Smaller service vehicles",
    icon: "van-passenger",
  },
  {
    id: "special",
    name: "Special Service",
    description: "Service tags supplied by the operator",
    icon: "star-outline",
  },
];

export const SAMPLE_BUS_SERVICES: BusService[] = [
  {
    id: "ordinary-sample",
    categoryId: "ordinary",
    serviceName: "Sample ordinary service",
    availability: "Availability to be confirmed",
    tags: ["Sample data"],
  },
  {
    id: "mini-sample",
    categoryId: "mini",
    serviceName: "Sample mini bus service",
    availability: "Availability to be confirmed",
    tags: ["Sample data"],
  },
  {
    id: "special-sample",
    categoryId: "special",
    serviceName: "Sample special service",
    availability: "Availability to be confirmed",
    tags: ["Sample data", "Operator information pending"],
  },
];

export const POPULAR_ROUTES: Route[] = [
  { id: "nagercoil-kanyakumari", from: "Nagercoil", to: "Kanyakumari" },
  { id: "kanyakumari-nagercoil", from: "Kanyakumari", to: "Nagercoil" },
  { id: "nagercoil-suchindram", from: "Nagercoil", to: "Suchindram" },
];
