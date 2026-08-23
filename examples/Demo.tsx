import { StyleSheet, Text, View } from "react-native";
import { Tooltip } from "@anb98/rn-tooltip";

export default function Demo() {
  return (
    <View style={styles.screen}>
      <Tooltip
        backgroundColor="#1F2937"
        content={
          <View style={styles.content}>
            <Text style={styles.tooltipTitle}>Helpful hint</Text>
            <Text style={styles.tooltipBody}>
              Positioned automatically where there is room.
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
    backgroundColor: "#4F46E5",
  },
  buttonText: {
    color: "white",
    fontSize: 15,
    fontWeight: "600",
  },
  content: {
    paddingVertical: 10,
    paddingHorizontal: 14,
  },
  tooltipTitle: {
    color: "white",
    fontSize: 15,
    fontWeight: "700",
    marginBottom: 4,
  },
  tooltipBody: {
    color: "#E5E7EB",
    fontSize: 14,
    lineHeight: 20,
  },
});
