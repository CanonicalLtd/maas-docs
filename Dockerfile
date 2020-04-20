FROM ubuntu:focal

# Set up environment
ENV LANG C.UTF-8
WORKDIR /srv

# System dependencies
RUN apt-get update && apt-get install --yes nginx net-tools

# Set git commit ID
ARG BUILD_ID
RUN test -n "${BUILD_ID}"

# Copy over files
ADD build .
ADD nginx.conf /etc/nginx/sites-enabled/default
ADD redirects.map /etc/nginx/redirects.map
RUN sed -i "s/~BUILD_ID~/${BUILD_ID}/" /etc/nginx/sites-enabled/default
RUN sed -i "s/8203/80/" /etc/nginx/sites-enabled/default

STOPSIGNAL SIGTERM

CMD ["nginx", "-g", "daemon off;"]

