#VERSAO DO NODE(CASO < 16 ESPECIFICAR):
FROM node:18-alpine
#DIRETORIO QUE SERÁ CRIADO:
WORKDIR /data-extractor-node
# . . == COPIAR DESDE A ORIGEM:
COPY . .
#DEVE RODAR OS COMANDOS:
#Comando para deletar o node_modules.
RUN rm -rf node_modules
#Comando para instalar os arquivos
RUN npm install

#COMANDO A SER EXECUTADO
CMD ["npm", "start"]
#PORTA
EXPOSE 3010