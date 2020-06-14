FROM nginx

RUN rm /etc/nginx/conf.d/default.conf
COPY ./conf.d /etc/nginx/conf.d

# RUN nginx -t

CMD ["nginx", "-g", "daemon off;"]