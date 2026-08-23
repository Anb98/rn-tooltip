import { StyleSheet, Text, View } from "react-native";
import { Tooltip } from "@anb98/rn-tooltip";

export default function CustomStyle() {
  return (
    <View style={styles.screen}>
      <Tooltip
        backgroundColor="#4F46E5"
        width="80%"
        content={
          <View style={styles.content}>
            <Text style={styles.title}>Custom style</Text>
            <Text style={styles.body}>
              Brand background color and an 80% width box.
            </Text>
          </View>
        }
      >
        <View style={styles.button}>
          <Text style={styles.buttonText}>Press me</Text>
        </View>
      </Tooltip>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F9FAFB",
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 22,
    borderRadius: 10,
    backgroundColor: "#1F2937",
  },
  buttonText: {
    color: "white",
    fontSize: 15,
    fontWeight: "600",
  },
  content: {
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  title: {
    color: "white",
    fontSize: 15,
    fontWeight: "700",
    marginBottom: 4,
  },
  body: {
    color: "#E0E7FF",
    fontSize: 14,
    lineHeight: 20,
  },
});
