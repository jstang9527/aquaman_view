FROM node:14.7.0

MAINTAINER jstang <389634070@qq.com>

ADD . /opt

WORKDIR /opt

EXPOSE 9527 

CMD ["npm", "run", "dev"]
