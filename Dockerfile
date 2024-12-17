FROM mysql

ENV MYSQL_ROOT_PASSWORD azerty

COPY bdd.sql /docker-entrypoint-initdb.d


EXPOSE 3306