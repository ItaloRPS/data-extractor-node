const {invoiceService} = require('../src/invoice/service/invoice.service')
const express = require('express')
const routes = express.Router()
const multer  = require('multer')
const { extractInvoiceData } = require('../src/util/readPdf/config');

routes.get('/invoice', async(req, res) => {
    try {
         const data = await invoiceService.findAll()
         res.status(200).json(data)
    } catch (error) {
     res.status(500).send(error)         
    }
 })

routes.get('/invoice/:id', async (req, res) => {
     try {
          const id = req.params.id
          const data = await invoiceService.findOne(parseInt(id))
          res.status(200).json(data)
     } catch (error) {
          res.status(500).send(error)    
     }
 })

routes.get('/invoice/client/:nclient', async (req, res) => {
     try {
          const nclient = req.params.nclient
          const data = await invoiceService.findClient(nclient)
          res.status(200).json(data)
     } catch (error) {
          res.status(500).send(error)    
     }
 })
 
routes.get('/invoice/hitory/:nclient', async (req, res) => {
     try {
          const nclient = req.params.nclient
          const data = await invoiceService.findClientHitory(nclient)
          res.status(200).json(data)
     } catch (error) {
          res.status(500).send(error)    
     }
 })

routes.get('/invoice/downloadDoc/:docname', (req, res) => {
     const doc = req.params.docname
     const data = invoiceService.getDocument(doc)
     res.status(200).send(data)
})

 
routes.post('/invoice',multer(require('../src/util/multer-config/config')).fields([{ name: 'file', maxCount: 1 }]), async(req, res) => {
     const data = await extractInvoiceData(req.files.file[0].filename)
     const invoiceData = {...data,document:req.files.file[0].filename}
     try {
          const data = await invoiceService.create(invoiceData)
          res.status(200).json(data)
     } catch (error) {
          res.status(500).json({error})
     }
})


module.exports = routes