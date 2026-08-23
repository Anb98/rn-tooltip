import { useRef } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Tooltip, TooltipRef } from "@anb98/rn-tooltip";

export default function RichContent() {
  const tooltipRef = useRef<TooltipRef>(null);

  return (
    <View style={styles.screen}>
      <Tooltip
        ref={tooltipRef}
        backgroundColor="#1F2937"
        content={
          <View style={styles.content}>
            <Text style={styles.title}>New feature</Text>
            <Text style={styles.body}>Tap here to filter your results.</Text>
            <Pressable
              style={styles.dismiss}
              onPress={() => tooltipRef.current?.close()}
            >
              <Text style={styles.dismissText}>Got it</Text>
            </Pressable>
          </View>
        }
      >
        <View style={styles.chip}>
          <Text style={styles.chipText}>Filter</Text>
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
    paddingVertical: 12,
    paddingHorizontal: 14,
  },
  title: {
    color: "white",
    fontSize: 15,
    fontWeight: "700",
    marginBottom: 4,
  },
  body: {
    color: "#E5E7EB",
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
  },
  dismiss: {
    alignSelf: "flex-end",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: "#4F46E5",
  },
  dismissText: {
    color: "white",
    fontSize: 14,
    fontWeight: "600",
  },
});
