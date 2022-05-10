FROM nginx:1.13.12-alpine

ADD dist /usr/share/nginx/html

WORKDIR /app

EXPOSE 80

CMD ["nginx","-g","daemon off;"]
