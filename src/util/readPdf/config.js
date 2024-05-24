const fs = require('fs');
const path = require('path');
const pdf = require('pdf-parse');

const extractItensVales = (text) => {
    let lines = text.split('\n');
    let values = [];
    const regexItens = /([-]?[\d,.]+)\s+([-]?[\d,.]+)\s+([-]?[\d,.]+)/;
    const regexContribIlum = /([A-Za-z\s]+)\s+([-]?[\d,.]+)/;

    for (let i = 0; i < lines.length; i++) {
        if (lines[i].includes('Valores Faturados')) {
            let lineItem = (i + 3)
            let indice = 0
            while(indice < 8 || lines[lineItem].includes('TOTAL')){
                
                if (lines[lineItem].trim().includes('Energia Elétrica')) {
                    let match = regexItens.exec(lines[lineItem])
                    values.push({
                        descricao: 'Energia Elétrica',
                        quantidade: parseFloat((match[1]?.trim() || '0,0').replace('.','').replace(',','.')),
                        precoUnitario: parseFloat((match[2]?.trim() || '0,0').replace('.','').replace(',','.')),
                        valor: parseFloat((match[3]?.trim() || match[5]?.trim()).replace('.','').replace(',','.')),
                    })
                
                 }
            
                if (lines[lineItem].trim().includes('Energia SCEE')) {
                    let match = regexItens.exec(lines[lineItem])
                    values.push({
                        descricao: 'Energia SCEE',
                        quantidade: parseFloat((match[1]?.trim() || '0,0').replace('.','').replace(',','.')),
                        precoUnitario: parseFloat((match[2]?.trim() || '0,0').replace('.','').replace(',','.')),
                        valor: parseFloat((match[3]?.trim() || match[5]?.trim()).replace('.','').replace(',','.')),
                    })
                }
                
                if (lines[lineItem].trim().includes('Energia compensada')) {
                    let match = regexItens.exec(lines[lineItem])
                    values.push({
                        descricao: 'Energia compensada',
                        quantidade: parseFloat((match[1]?.trim() || '0,0').replace('.','').replace(',','.')),
                        precoUnitario: parseFloat((match[2]?.trim() || '0,0').replace('.','').replace(',','.')),
                        valor: parseFloat((match[3]?.trim() || match[5]?.trim()).replace('.','').replace(',','.')),
                    })
                }
                if (lines[lineItem].trim().includes('Contrib Ilum')) {
                    let match = regexContribIlum.exec(lines[lineItem])
                    values.push({
                        descricao: 'Contrib Ilum',
                        quantidade: 0,
                        precoUnitario: 0,
                        valor: parseFloat((match[2]?.trim() || '0,0').replace('.','').replace(',','.')),
                    })
                }
                indice++
                lineItem++
          }
        }
    }
    return { items: values };
};

const extractInvoiceVales = (text) => {
    let data = {}
    let lines = text.split('\n');
    
    for (let i = 0; i < lines.length; i++) {
        if (lines[i].includes('Referente a')) {
            let match;
            const regexItens = /[A-Z]{3}\/\d{4}/;
            match =  regexItens.exec(lines[i+1]) 
            data.reference = match[0]
        }
        if(lines[i].includes('Valor a pagar (R$)')){
            let match;
            const regexItens = /[-]?\d+,\d+/;
            match =  regexItens.exec(lines[i+1]) 
            data.total = match[0]
        }
        if(lines[i].includes('Vencimento')){
            let match;
            const regexItens = /\d{2}\/\d{2}\/\d{4}/;
            match =  regexItens.exec(lines[i+1]) 
            data.expiredData = match[0]
        }
        if(lines[i].includes('chave de acesso:')){
            let match;
            const regexItens = /\d+/;
            match =  regexItens.exec(lines[i+1]) 
            data.accessKey = match[0]

        }if(lines[i].includes('Nº DO CLIENTE')){
            let match;
            const regexItens =/\d+/;
            match =  regexItens.exec(lines[i+1]) 
            data.client  =match[0]
        }
    }
    return data?data:null;
};

async function extractInvoiceData(filename) {
    const dataBuffer = fs.readFileSync(path.resolve(__dirname,'..','..','..','tmp','uploads',filename));
    try {
        const data = await pdf(dataBuffer);
        const invoice =  extractInvoiceVales(data.text);
        const itens = extractItensVales(data.text);
        const dataInvoice = {...invoice,...itens}
        if (dataInvoice) {
            return dataInvoice; 
        } else {
            return null;
        }
    } catch (error) {
        console.error('Erro ao processar o PDF:', error);
        throw error; 
    }
}

module.exports = {extractInvoiceData };