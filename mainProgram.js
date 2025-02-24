const zmq = require("zeromq");

async function sendRequest() {
    const requester = new zmq.Request();
    await requester.connect("tcp://127.0.0.1:5555");
    console.log("Connected to microservice");

    const jsonData = { type: "grocery_list", text: " ", delimiter: "\n" };

    console.log("Sending JSON...");
    await requester.send(JSON.stringify(jsonData));

    const [reply] = await requester.receive();
    console.log("formatted list:\n", reply.toString());
}

sendRequest();