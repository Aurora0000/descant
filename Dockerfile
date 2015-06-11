FROM ubuntu:14.04
MAINTAINER Aurora01 (descant)
RUN apt-get update
RUN apt-get install -y git nano python3 python3-pip
ADD / /descant
WORKDIR /descant
EXPOSE 8000
RUN pip3 install -r requirements.txt
RUN yes | pip3 install gunicorn
RUN python3 manage.py migrate
CMD gunicorn --bind 0.0.0.0:8001 descant.wsgi
