// Screenshot: edge-clamping.png — the trigger is pinned at the viewport's
// far right edge. The box clamps inside the visible screen instead of
// overflowing, while the arrow shifts to keep pointing at the trigger
// (viewport clamping without a side flip).
import { StyleSheet, Text, View } from 'react-native'
import { Tooltip } from '@anb98/rn-tooltip'

export default function EdgeClamping() {
  return (
    <View style={styles.screen}>
      <Tooltip content={<Text style={styles.tooltipText}>Clamped into the viewport</Text>} position="bottom">
        <Text style={styles.trigger}>Edge</Text>
      </Tooltip>
    </View>
  )
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    alignItems: 'flex-end',
    paddingTop: 40,
    paddingRight: 12
  },
  trigger: {
    fontSize: 16,
    color: '#111827'
  },
  tooltipText: {
    color: 'white'
  }
})
