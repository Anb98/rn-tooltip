// Screenshot: arrow-alignments.png — three triggers, same `position="bottom"`,
// each with a different `arrowAlignment`. Capture one open tooltip at a time
// (Modal only shows one).
import { StyleSheet, Text, View } from 'react-native'
import { Tooltip } from '@anb98/rn-tooltip'

export default function ArrowAlignments() {
  return (
    <View style={styles.screen}>
      <Tooltip content={<Text style={styles.tooltipText}>Arrow at the start</Text>} position="bottom" arrowAlignment="start">
        <Text style={styles.trigger}>Start</Text>
      </Tooltip>
      <Tooltip content={<Text style={styles.tooltipText}>Arrow centered</Text>} position="bottom" arrowAlignment="center">
        <Text style={styles.trigger}>Center</Text>
      </Tooltip>
      <Tooltip content={<Text style={styles.tooltipText}>Arrow at the end</Text>} position="bottom" arrowAlignment="end">
        <Text style={styles.trigger}>End</Text>
      </Tooltip>
    </View>
  )
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-start',
    paddingTop: 80
  },
  trigger: {
    fontSize: 16,
    color: '#111827'
  },
  tooltipText: {
    color: 'white'
  }
})
