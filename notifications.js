import amqplib from 'amqplib';

const sleep = ms => new Promise(r => setTimeout(r, ms));

console.log('📧 Notifications Service\n');

try {
  const conn = await amqplib.connect('amqp://localhost');
  const ch = await conn.createChannel();
  await ch.assertQueue('notifications');

  await ch.consume('notifications', async msg => {
    let data = {}
    if(msg !== null) {
      data = JSON.parse(msg.content.toString());
      console.log(`🔵 Recibido: ${ data.txId } (${ data.email })`);
      await sleep(1000);
      console.log(`🟢 Procesado: ${ data.txId }`);
      ch.ack(msg);
    }
  });

}
catch(err) {
  console.log(err);
}
