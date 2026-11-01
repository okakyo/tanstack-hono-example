import type { ColumnDef } from "@tanstack/react-table";

export type TEMPLATE_DATA_TYPE = {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
};

export const TEMPLATE_DATA: TEMPLATE_DATA_TYPE[] = [
  {
    id: "1",
    name: "John Doe",
    email: "sample1@mail.com",
    phone: "1234567890",
    address: "1234 Main St, New York, NY 10001",
  },
  {
    id: "2",
    name: "Jane Doe",
    email: "sample2@mail.com",
    phone: "1234567890",
    address: "1234 Main St, New York, NY 10001",
  },
  {
    id: "3",
    name: "John Smith",
    email: "sample3@#mail.com",
    phone: "1234567890",
    address: "1234 Main St, New York, NY 10001",
  },
  {
    id: "4",
    name: "Jane Smith",
    email: "sample3@#mail.com",
    phone: "1234567890",
    address: "1234 Main St, New York, NY 10001",
  },
  {
    id: "5",
    name: "John Smith",
    email: "sample3@#mail.com",
    phone: "1234567890",
    address: "1234 Main St, New York, NY 10001",
  },
  {
    id: "6",
    name: "Jane Smith",
    email: "sample3@#mail.com",
    phone: "1234567890",
    address: "1234 Main St, New York, NY 10001",
  },
];

export const TEMPLATE_COLUMNS: ColumnDef<TEMPLATE_DATA_TYPE>[] = [
  {
    header: "ID",
    accessorKey: "id",
  },
  {
    header: "Name",
    accessorKey: "name",
  },
  {
    header: "Email",
    accessorKey: "email",
  },
  {
    header: "Phone",
    accessorKey: "phone",
    enableSorting: false,
  },
  {
    header: "Address",
    accessorKey: "address",
    enableSorting: false,
  },
];
