const sinon = require('sinon');
const path = require('path');
const {invoiceService}  = require('../../invoice/service/invoice.service');
const invoiceRepo = require('../../invoice/repositories/invoice.repository');

describe('Invoice Service', () => {
  afterEach(() => {
    sinon.restore();
  });

  describe('create', () => {
    it('should throw an error if invoice already exists', async () => {
      const mockInvoiceData = { client: 'client1', expiredData: '2024-12-01', reference: 'ref123' };
      sinon.stub(invoiceRepo, 'findByAccessKey').resolves([{}]);
      await expect(invoiceService.create(mockInvoiceData)).rejects.toEqual('Fatura ja inserida!')


    });

    it('should create an invoice if it does not already exist', async () => {
      const mockInvoiceData = { client: 'client1', expiredData: '2024-12-01', reference: 'ref123' };
      sinon.stub(invoiceRepo, 'findByAccessKey').resolves([]);
      sinon.stub(invoiceRepo, 'create').resolves({ id: 1, ...mockInvoiceData });

      const result = await invoiceService.create(mockInvoiceData);
      expect(result).toEqual({ id: 1, ...mockInvoiceData });
    });
  });

  describe('findOne', () => {
    it('should return an invoice by id', async () => {
      const mockInvoice = { id: 1, client: 'client1' };
      sinon.stub(invoiceRepo, 'findOne').resolves(mockInvoice);

      const result = await invoiceService.findOne(1);
      expect(result).toEqual(mockInvoice);
    });
  });

  describe('findAll', () => {
    it('should return all invoices', async () => {
      const mockInvoices = [{ id: 1, client: 'client1' }, { id: 2, client: 'client2' }];
      sinon.stub(invoiceRepo, 'findAll').resolves(mockInvoices);

      const result = await invoiceService.findAll();
      expect(result).toEqual(mockInvoices);
    });
  });

  describe('findClient', () => {
    it('should return invoices for a specific client', async () => {
      const mockInvoices = [{ id: 1, client: 'client1' }];
      sinon.stub(invoiceRepo, 'findClient').resolves(mockInvoices);

      const result = await invoiceService.findClient('client1');
      expect(result).toEqual(mockInvoices);
    });
  });

  describe('findClientHitory', () => {
    it('should return the invoice history for a specific client', async () => {
      const mockInvoices = [{ id: 1, client: 'client1' }];
      sinon.stub(invoiceRepo, 'findClientHitory').resolves(mockInvoices);

      const result = await invoiceService.findClientHitory('client1');
      expect(result).toEqual(mockInvoices);
    });
  });
});