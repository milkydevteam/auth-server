FROM node:12
WORKDIR /app
COPY ["package.json", "package-lock.json", "./"]

RUN npm install

COPY . .
COPY .env.docker .env

RUN unzip /app/oracle/instantclient.zip -d /app/oracle/
RUn rm -rf /app/oracle/instantclient.zip
RUN apt-get update && apt-get -y upgrade && apt-get -y dist-upgrade && apt-get install -y alien libaio1
RUN wget http://yum.oracle.com/repo/OracleLinux/OL7/oracle/instantclient/x86_64/getPackage/oracle-instantclient19.3-basiclite-19.3.0.0.0-1.x86_64.rpm
RUN alien -i --scripts oracle-instantclient*.rpm
RUN rm -f oracle-instantclient19.3*.rpm && apt-get -y autoremove && apt-get -y clean


CMD [ "node", "index.js" ]