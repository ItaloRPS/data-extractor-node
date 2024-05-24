import { Invoice } from '@prisma/client';

export class InvoiceEntity implements Invoice {
  id: number;
  client: string;
  expiredData: string;
  reference: string;
  total: string;
  accessKey: string;
  createdAt: Date;
  updateAt: Date;

}
