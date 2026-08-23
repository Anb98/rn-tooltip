import { ReactNode } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Tooltip } from "@anb98/rn-tooltip";

const body = (text: string): ReactNode => (
  <View style={styles.content}>
    <Text style={styles.tooltipBody}>{text}</Text>
  </View>
);

export default function Positions() {
  return (
    <View style={styles.screen}>
      <View style={styles.row}>
        <Tooltip
          content={body("Opens below")}
          position="bottom"
          backgroundColor="#1F2937"
        >
          <View style={styles.chip}>
            <Text style={styles.chipText}>Top</Text>
          </View>
        </Tooltip>
      </View>
      <View style={[styles.row, styles.middleRow]}>
        <Tooltip
          content={body("Opens to the right")}
          position="right"
          backgroundColor="#1F2937"
        >
          <View style={styles.chip}>
            <Text style={styles.chipText}>Left</Text>
          </View>
        </Tooltip>
        <Tooltip
          content={body("Opens to the left")}
          position="left"
          backgroundColor="#1F2937"
        >
          <View style={styles.chip}>
            <Text style={styles.chipText}>Right</Text>
          </View>
        </Tooltip>
      </View>
      <View style={styles.row}>
        <Tooltip
          content={body("Opens above")}
          position="top"
          backgroundColor="#1F2937"
        >
          <View style={styles.chip}>
            <Text style={styles.chipText}>Bottom</Text>
          </View>
        </Tooltip>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: "space-between",
    paddingVertical: 60,
    backgroundColor: "#F9FAFB",
  },
  row: {
    alignItems: "center",
  },
  middleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 24,
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
    color: "#111827",
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
