// Screenshot: positions.png — one trigger per screen edge, each with a fixed
// `position` chosen so the tooltip has room to open. The Modal only shows one
// tooltip at a time, so positions.png is a composite of 4 separate captures:
// open one trigger, screenshot, close, repeat for the next.
import { StyleSheet, Text, View } from 'react-native'
import { Tooltip } from '@anb98/rn-tooltip'

export default function Positions() {
  return (
    <View style={styles.screen}>
      <View style={styles.row}>
        <Tooltip content={<Text style={styles.tooltipText}>Opens below</Text>} position="bottom">
          <Text style={styles.trigger}>Top-center</Text>
        </Tooltip>
      </View>
      <View style={[styles.row, styles.middleRow]}>
        <Tooltip content={<Text style={styles.tooltipText}>Opens to the right</Text>} position="right">
          <Text style={styles.trigger}>Left-center</Text>
        </Tooltip>
        <Tooltip content={<Text style={styles.tooltipText}>Opens to the left</Text>} position="left">
          <Text style={styles.trigger}>Right-center</Text>
        </Tooltip>
      </View>
      <View style={styles.row}>
        <Tooltip content={<Text style={styles.tooltipText}>Opens above</Text>} position="top">
          <Text style={styles.trigger}>Bottom-center</Text>
        </Tooltip>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: 'space-between',
    paddingVertical: 60
  },
  row: {
    alignItems: 'center'
  },
  middleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 24
  },
  trigger: {
    fontSize: 16,
    color: '#111827'
  },
  tooltipText: {
    color: 'white'
  }
})
