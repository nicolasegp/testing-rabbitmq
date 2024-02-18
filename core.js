import Fastify from 'fastify';
import FastifyAmqp from 'fastify-amqp'; // https://github.com/RafaelGSS/fastify-amqp
import { randomUUID as uuid } from 'crypto';
import getData from './db.js';

const fastify = Fastify();
fastify.register(FastifyAmqp, { url: 'amqp://localhost' });

fastify.get('/:id', async function send(req, _rep) {
  const data = {
    ...getData(+req.params?.id ?? 1),
    txId: uuid(),
  };

  const ch = this.amqp.channel;

  await ch.assertQueue('payments');
  await ch.assertQueue('notifications');

  const resPayments = ch.sendToQueue('payments', Buffer.from(JSON.stringify(data)));
  const resNotifications = ch.sendToQueue('notifications', Buffer.from(JSON.stringify(data)));

  console.log(`🟢 Enviando TX: ${ data.txId }\n`);

  return {
    txId: data.txId,
    payments: resPayments ? 'ok' : 'fail',
    notifications: resNotifications ? 'ok' : 'fail',
  };
});

try {
  await fastify.listen({ port: 3000 });
  const { address, port } = fastify.server.address();
  console.log(`🚀 Core iniciado: http://${ address === '::1' ? 'localhost' : address }:${ port }/\n`);
}
catch(err) {
  console.error('Error Fastify:', err);
  process.exit(1);
}
