import { StyleSheet, Text, View } from "react-native";
import { Tooltip } from "@anb98/rn-tooltip";

export default function EdgeClamping() {
  return (
    <View style={styles.screen}>
      <Tooltip
        position="bottom"
        backgroundColor="#1F2937"
        content={
          <View style={styles.content}>
            <Text style={styles.tooltipBody}>
              Clamped inside the viewport — the arrow keeps pointing at the
              trigger.
            </Text>
          </View>
        }
      >
        <View style={styles.chip}>
          <Text style={styles.chipText}>Edge</Text>
        </View>
      </Tooltip>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    alignItems: "flex-end",
    paddingTop: 40,
    paddingRight: 12,
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
    color: "#111827",
    fontSize: 15,
    fontWeight: "600",
  },
  content: {
    paddingVertical: 10,
    paddingHorizontal: 14,
  },
  tooltipBody: {
    color: "#E5E7EB",
    fontSize: 14,
    lineHeight: 20,
  },
});
