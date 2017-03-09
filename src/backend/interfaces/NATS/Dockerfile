FROM golang

RUN go get -u github.com/kardianos/govendor
RUN go install github.com/kardianos/govendor

RUN go get github.com/nats-io/gnatsd

EXPOSE 4222

CMD ["gnatsd"]
