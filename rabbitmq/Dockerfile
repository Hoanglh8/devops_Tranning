FROM rabbitmq:3.10.5-management

RUN rabbitmq-plugins enable --offline rabbitmq_prometheus

COPY rabbitmq.conf /etc/rabbitmq/rabbitmq.conf
COPY definitions.json /etc/rabbitmq/definitions.json