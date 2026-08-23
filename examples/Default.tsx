import { StyleSheet, Text, View } from "react-native";
import { Tooltip } from "@anb98/rn-tooltip";

export default function Default() {
  return (
    <View style={styles.screen}>
      <Tooltip
        content={
          <View style={styles.content}>
            <Text style={styles.tooltipTitle}>Zero config</Text>
            <Text style={styles.tooltipBody}>
              Dark background, arrow, and radius out of the box.
            </Text>
          </View>
        }
      >
        <View style={styles.trigger}>
          <Text style={styles.triggerText}>Press me</Text>
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
  trigger: {
    paddingVertical: 12,
    paddingHorizontal: 22,
    borderRadius: 10,
    backgroundColor: "#4F46E5",
  },
  triggerText: {
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
