# Como fazer dump restore (seed do banco, baseado em um dump)

1. Cole a pasta do dump na raiz do projeto
2. Substitua o conteúdo do `docker-compose` pelo conteúdo do `dump.yml`
3. Rode `docker-compose up -d`
4. Entre no bash da instância de mongodb rodando no docker
5. Garanta que seu `.env` aponte para o DATABASE_URI correto
6. Aplique o comando `mongorestore --host localhost --drop /dump`
7. Pare os containers `docker-compose stop` !NÃO É DOCKER-COMPOSE DOWN, SENÃO VAI DELETAR O BANCO!
8. Volte o conteúdo do `docker-compose.yml` para o conteúdo inicial
9. Inicie os containers `docker-compose up -d`
