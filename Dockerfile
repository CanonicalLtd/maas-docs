# syntax=docker/dockerfile:experimental

# Build stage: Build docs
# ===
FROM ubuntu:focal AS build-docs

WORKDIR /srv
ADD . .

RUN apt-get update && apt-get install --no-install-recommends --yes python3-pip python3-setuptools git
RUN pip3 install --requirement requirements.txt
RUN /srv/build.sh

# Build the production image
# ===
FROM ubuntu:focal

# Set up environment
ENV LANG C.UTF-8
WORKDIR /srv

# Install nginx
RUN apt-get update && apt-get install --no-install-recommends --yes nginx

# Import code, build assets and mirror list
ADD redirects.map /etc/nginx/redirects.map
COPY --from=build-docs srv/build .

ARG BUILD_ID
ADD nginx.conf /etc/nginx/sites-enabled/default
RUN sed -i "s/~BUILD_ID~/${BUILD_ID}/" /etc/nginx/sites-enabled/default
RUN sed -i "s/8203/80/" /etc/nginx/sites-enabled/default

STOPSIGNAL SIGTERM

CMD ["nginx", "-g", "daemon off;"]
