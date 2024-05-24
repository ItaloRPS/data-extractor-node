const { Prisma } = require('@prisma/client');
const { prisma } = require('../../database/prisma-client');

const InvoiceRepository = {
    async create(createInvoice) {
        const items = createInvoice.items
        delete createInvoice.items 
        const invoice = createInvoice
        invoice.accessKey = invoice.accessKey?invoice.accessKey:''
        const data = {
            ...invoice,
            items:{
                createMany: {
                    data:items
                 }
            }
          }
        try {
            const result = await prisma.invoice.create({ data });
            return result;
        } catch (error) {
            throw (`Erro ao criar invoice: ${error.message}`);
        }
    },
    async findOne(idInvoice) {
        try {
            const result = await prisma.invoice.findUnique({
                where:{
                    id:idInvoice
                },
                select:{
                    id:true,
                    client:true,
                    reference:true,
                    expiredData:true,
                    total:true,
                    accessKey:true,
                    document:true,
                    items:true
                }
             });
            return result;
        } catch (error) {
            throw (`Erro ao criar invoice: ${error.message}`);
        }
    },
    async findAll() {
              try {
            const result = await prisma.invoice.findMany({
                select:{
                    id:true,
                    client:true,
                    reference:true,
                    expiredData:true,
                    total:true,
                    accessKey:true,
                    document:true,
                    items:true
                }
             });
            return result;
        } catch (error) {
            throw (`Erro ao criar invoice: ${error.message}`);
        }
    },
    async findClient(idClient) {
        try {
            const result = await prisma.invoice.findMany({
                where:{
                    client:idClient
                },
                select:{
                    id:true,
                    client:true,
                    reference:true,
                    expiredData:true,
                    total:true,
                    accessKey:true,
                    document:true,
                    items:true
                }
             });
            return result;
        } catch (error) {
            throw (`Erro ao criar invoice: ${error.message}`);
        }
    },
    async findByAccessKey(client,expiredData,reference) {
        try {
            const result = await prisma.invoice.findMany({
                where:{
                    client,
                    AND:{
                        expiredData,
                        reference
                    },
                },
                select:{
                    id:true,
                    client:true,
                    reference:true,
                    expiredData:true,
                    total:true,
                    accessKey:true,
                    document:true,
                    items:true
                }
             });
            return result;
        } catch (error) {
            throw (`Erro ao criar invoice: ${error.message}`);
        }
    },
    async findClientHitory(client) {
        try {
            const result = await prisma.$queryRaw(Prisma.sql`
            SELECT 
            i.*,
            (ee.quantidade + COALESCE(es.quantidade,0)) as consumo,
            COALESCE(ec.quantidade,0) compensada,
            (ee.valor + COALESCE(es.valor,0) +COALESCE(ci.valor,0)) as vlr_total,
            COALESCE(ec.valor,0) economia
            FROM invoice i
                inner join (SELECT idinvoice, descricao, quantidade, valor FROM Items WHERE descricao = 'Energia Elétrica') ee
                    on i.id  = ee.idinvoice
                left join (SELECT idinvoice, descricao, quantidade,  valor FROM Items WHERE descricao = 'Energia SCEE') es
                    on i.id  = es.idinvoice
                left join (SELECT idinvoice, descricao, quantidade,  valor FROM Items WHERE descricao = 'Energia compensada') ec
                    on i.id  = ec.idinvoice
                left join (SELECT idinvoice, descricao, quantidade,  valor FROM Items WHERE descricao = 'Contrib Ilum') ci
                    on i.id  = ci.idinvoice
            where i.client = ${client}
            `)
            return result;
        } catch (error) {
            throw (`Erro ao criar invoice: ${error.message}`);
        }
    }
};

module.exports = InvoiceRepository;
