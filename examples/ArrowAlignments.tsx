import { ReactNode } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Tooltip } from "@anb98/rn-tooltip";

const body = (text: string): ReactNode => (
  <View style={styles.content}>
    <Text style={styles.tooltipBody}>{text}</Text>
  </View>
);

export default function ArrowAlignments() {
  return (
    <View style={styles.screen}>
      <Tooltip
        content={body("Arrow at the start")}
        position="bottom"
        arrowAlignment="start"
        backgroundColor="#1F2937"
      >
        <View style={styles.chip}>
          <Text style={styles.chipText}>start</Text>
        </View>
      </Tooltip>
      <Tooltip
        content={body("Arrow centered")}
        position="bottom"
        arrowAlignment="center"
        backgroundColor="#1F2937"
      >
        <View style={styles.chip}>
          <Text style={styles.chipText}>center</Text>
        </View>
      </Tooltip>
      <Tooltip
        content={body("Arrow at the end")}
        position="bottom"
        arrowAlignment="end"
        backgroundColor="#1F2937"
      >
        <View style={styles.chip}>
          <Text style={styles.chipText}>end</Text>
        </View>
      </Tooltip>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "flex-start",
    paddingTop: 80,
    backgroundColor: "#F9FAFB",
  },
  chip: {
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    backgroundColor: "white",
  },
  chipText: {
    color: "#4F46E5",
    fontSize: 15,
    fontWeight: "600",
  },
  content: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  tooltipBody: {
    color: "#E5E7EB",
    fontSize: 14,
    lineHeight: 20,
    textAlign: "center",
  },
});
