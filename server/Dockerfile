FROM golang:1.21.0

WORKDIR /app

COPY . ./

RUN go mod download

RUN CGO_ENABLED=0 GOOS=linux go build -o /chatterbox

EXPOSE 8080

CMD ["/chatterbox"]