const multer = require('multer')
const path = require('path')
const crypto =  require('crypto')

module.exports={
    dest:path.resolve(__dirname,'..','..','..','tmp','uploads'),
    storage:multer.diskStorage({
        destination:(req,file,cb)=>{
            cb(null,path.resolve(__dirname,'..','..','..','tmp','uploads'))
        },
        filename:(req,file,cb)=>{
            crypto.randomBytes(16,(error,Hash)=>{
                if(error){cb(error)}

                const fileName = `${Hash.toString('hex')}-${file.originalname}`
                cb(null,fileName)
            })
        }
    })
}