import mqtt from "mqtt";

const client = mqtt.connect(process.env.MQTT_URL!);
const API_URL = process.env.API_URL || "http://localhost:3001";

client.on("connect", () => {
  client.subscribe("rfid/return");
  console.log("MQTT connecté, écoute sur rfid/return");
});

client.on("message", async (topic, message) => {
  if (topic === "rfid/return") {
    const rfidUid = message.toString();
    console.log("RFID détecté:", rfidUid);

    try {
      const response = await fetch(
        `${API_URL}/api/key/rfid/${rfidUid}/return`,
        {
          method: "PATCH",
        },
      );

      if (!response.ok) {
        console.error("Erreur API:", await response.text());
      } else {
        console.log("Clé mise en Indisponible:", rfidUid);
      }
    } catch (error) {
      console.error("Erreur MQTT handler:", error);
    }
  }
});

export { client };
