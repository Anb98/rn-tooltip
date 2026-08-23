// Screenshot: default.png — zero-config tooltip: only `content` and
// `children` are passed, showing the default dark background, arrow, and
// border radius.
import { StyleSheet, Text, View } from 'react-native'
import { Tooltip } from '@anb98/rn-tooltip'

export default function Default() {
  return (
    <View style={styles.screen}>
      <Tooltip content={<Text style={styles.tooltipText}>Default dark background, arrow, and radius</Text>}>
        <Text style={styles.trigger}>Press me</Text>
      </Tooltip>
    </View>
  )
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  trigger: {
    fontSize: 16,
    color: '#111827'
  },
  tooltipText: {
    color: 'white'
  }
})
