import { StyleSheet, Text, View } from "react-native";
import { Tooltip } from "@anb98/rn-tooltip";

export default function CenterByScreen() {
  return (
    <View style={styles.screen}>
      <Tooltip
        width="90%"
        centerBy="screen"
        position="bottom"
        backgroundColor="#1F2937"
        content={
          <View style={styles.content}>
            <Text style={styles.title}>Screen-centered</Text>
            <Text style={styles.body}>
              The banner centers on the screen while the arrow keeps tracking
              the trigger.
            </Text>
          </View>
        }
      >
        <View style={styles.icon}>
          <Text style={styles.iconText}>i</Text>
        </View>
      </Tooltip>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    alignItems: "flex-start",
    paddingTop: 24,
    paddingLeft: 24,
    backgroundColor: "#F9FAFB",
  },
  icon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#4F46E5",
  },
  iconText: {
    color: "white",
    fontSize: 15,
    fontWeight: "700",
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
    color: "#E5E7EB",
    fontSize: 14,
    lineHeight: 20,
  },
});
