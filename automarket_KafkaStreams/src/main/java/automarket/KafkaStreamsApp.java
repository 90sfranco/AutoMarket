package automarket;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import org.apache.kafka.common.serialization.Serdes;
import org.apache.kafka.streams.KafkaStreams;
import org.apache.kafka.streams.StreamsBuilder;
import org.apache.kafka.streams.StreamsConfig;
import org.apache.kafka.streams.kstream.KStream;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import java.util.Properties;

@SpringBootApplication
public class KafkaStreamsApp {

    public static void main(String[] args) {
        SpringApplication.run(KafkaStreamsApp.class, args);

        Properties props = new Properties();
        props.put(StreamsConfig.APPLICATION_ID_CONFIG, "vehiculo-stream");
        props.put(StreamsConfig.BOOTSTRAP_SERVERS_CONFIG, "kafka:29092");
        props.put(StreamsConfig.DEFAULT_KEY_SERDE_CLASS_CONFIG, Serdes.String().getClass());
        props.put(StreamsConfig.DEFAULT_VALUE_SERDE_CLASS_CONFIG, Serdes.String().getClass());

        StreamsBuilder builder = new StreamsBuilder();
        // El tópico donde Debezium publica cambios de la tabla "vehiculo"
        KStream<String, String> stream = builder.stream("vehiculosprefix.vehiculosdbauto_write.vehiculo");

        ObjectMapper mapper = new ObjectMapper();

        stream.foreach((key, value) -> {
            try {
                // 1) Parseamos el JSON que viene de Debezium
                JsonNode root = mapper.readTree(value);
                JsonNode payload = root.path("payload");

                // 2) Obtenemos el tipo de operación: "c"=create, "u"=update, "d"=delete,
                // "r"=snapshot
                JsonNode opNode = payload.path("op");
                if (opNode.isMissingNode()) {
                    // Si por algún motivo no viene el campo "op", lo ignoramos
                    return;
                }
                String op = opNode.asText(); // ej. "c", "u", "d", "r"

                // 3) Para INSERT (c) y UPDATE (u), los datos útiles están en payload.after
                JsonNode after = payload.path("after");
                // Para DELETE (d), no habrá "after", sino que deberíamos leer payload.before
                JsonNode before = payload.path("before");

                // 4) Construimos un objeto JSON plano con { "op": <op>, "data": <campos> }
                ObjectNode outgoing = mapper.createObjectNode();
                outgoing.put("op", op);

                // Según Debezium:
                // - Si es insert (op=="c") o update (op=="u"), after tendrá el registro nuevo
                // - Si es delete (op=="d"), after estará ausente y before contendrá el registro
                // que se borró
                if ("c".equals(op) || "u".equals(op) || "r".equals(op)) {
                    // Insert o update (o snapshot inicial)
                    if (!after.isMissingNode() && !after.isNull()) {
                        outgoing.set("data", after);
                    } else {
                        return; // no hay after válido, no enviamos nada
                    }
                } else if ("d".equals(op)) {
                    // Delete: enviamos el "before" para saber qué ID se eliminó
                    if (!before.isMissingNode() && !before.isNull()) {
                        outgoing.set("data", before);
                    } else {
                        return; // no hay before válido, no enviamos nada
                    }
                } else {
                    // Si viene cualquier otro op (nil, etc.), lo ignoramos
                    return;
                }

                // 5) Mandamos al WebSocket un JSON serializado como: {"op":"c","data":{...}}
                WebSocketManager.broadcast(outgoing.toString());

            } catch (Exception e) {
                e.printStackTrace();
            }
        });

        KafkaStreams streams = new KafkaStreams(builder.build(), props);
        streams.start();
        Runtime.getRuntime().addShutdownHook(new Thread(streams::close));
    }
}
