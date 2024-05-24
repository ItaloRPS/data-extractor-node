const fs = require('fs');
const path = require('path')
const invoice = require('../../invoice/repositories/invoice.repository')

module.exports = {
    invoiceService :{

        async create(invoiceData){
            try {
                const data = await invoice.findByAccessKey(invoiceData.client,invoiceData.expiredData,invoiceData.reference)
                if (data.length > 0) {
                    throw "Fatura ja inserida!"
                }
                const result = await invoice.create(invoiceData)
              return result
            } catch (error) {
                throw error
            }
        },
        async findOne(idInvoice){
            try {
                const data = await invoice.findOne(idInvoice)
              return data
            } catch (error) {
                throw error
            }
        },
        async findAll(){
            try {
                const data = await invoice.findAll()
              return data
            } catch (error) {
                throw error
            }
        },
        async findClient(idClient){
            try {
                const data = await invoice.findClient(idClient)
              return data
            } catch (error) {
                throw error
            }
        },
        async findClientHitory(idClient){
            try {
                const data = await invoice.findClientHitory(idClient)
              return data
            } catch (error) {
                throw error
            }
        },
        getDocument(filename) {
            try {
                const dataBuffer = fs.readFileSync(path.resolve(__dirname,'..','..','..','tmp','uploads',filename));
                return dataBuffer.toString('base64')
            } catch (error) {
                throw `Ops! Parece que o documento não está disponível`             
            }
        }
    }
}