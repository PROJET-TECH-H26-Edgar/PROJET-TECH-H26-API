import mqtt from "mqtt";

const client = mqtt.connect(process.env.MQTT_URL!, {
  rejectUnauthorized: false,
});

const API_URL = process.env.API_URL || "https://distributeurcle.edwrdledgar.me";

client.on("connect", () => {
  console.log("MQTT connecté !");
  client.subscribe("rfid/return");
});

client.on("message", async (topic, message) => {
  if (topic === "rfid/return") {
    const rfidUid = message.toString();
    console.log("RFID reçu:", rfidUid);

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

client.on("error", (err) => {
  console.error("MQTT erreur:", err);
});

export { client };
