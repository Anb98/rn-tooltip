// Screenshot: center-screen.png — a wide banner-style tooltip that centers on
// the screen (`centerBy="screen"`) while its arrow still tracks the small
// corner trigger.
import { StyleSheet, Text, View } from 'react-native'
import { Tooltip } from '@anb98/rn-tooltip'

export default function CenterByScreen() {
  return (
    <View style={styles.screen}>
      <Tooltip
        content={<Text style={styles.tooltipText}>Centered on the screen, not the trigger</Text>}
        width="90%"
        centerBy="screen"
        position="bottom"
      >
        <View style={styles.icon}>
          <Text style={styles.iconText}>i</Text>
        </View>
      </Tooltip>
    </View>
  )
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    alignItems: 'flex-start',
    paddingTop: 24,
    paddingLeft: 24
  },
  icon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1F2937'
  },
  iconText: {
    color: 'white',
    fontWeight: '700'
  },
  tooltipText: {
    color: 'white'
  }
})
