const zmq = require("zeromq");

async function runMicroservice() {
    const responder = new zmq.Reply();
    await responder.bind("tcp://127.0.0.1:5555");
    console.log("Microservice listening on port 5555...");

    for await (const [msg] of responder) {
        const request = JSON.parse(msg.toString());

        let response;
        // Detect delimiter
        const delimiter = request.delimiter;
        const items = request.text.split(delimiter);

        if (request.type.toLowerCase() === "grocery_list") {
            let line = "\n" + "-".repeat(30) + "\n";

            // Join the items with dashed lines between them
            response = items.length ? items.map(item => ` • ${item}`).join(line) : "Error: No items provided!";

        } else if (request.type.toLowerCase() === "check_list") {
            response = items.length ? "[ ] " + items.join("\n [ ] ") : "Error: No items provided!";

        } else if (request.type.toLowerCase() === "number_list") {
            // Numbers entries
            response = items.length ? items.map((item, index) => `${index + 1}. ${item}`).join("\n ") : "Error: No items provided!";

        } else {
            response = "Error: Invalid type provided!";
        }

        await responder.send(response);
    }
}

runMicroservice();