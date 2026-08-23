// Screenshot: demo.gif — hero interaction recording. No `position` prop, so
// the tooltip picks the side with the most room automatically.
import { StyleSheet, Text, View } from 'react-native'
import { Tooltip } from '@anb98/rn-tooltip'

export default function Demo() {
  return (
    <View style={styles.screen}>
      <Tooltip content={<Text style={styles.tooltipText}>Helpful hint</Text>}>
        <View style={styles.button}>
          <Text style={styles.buttonText}>Press me</Text>
        </View>
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
  button: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    backgroundColor: '#1F2937'
  },
  buttonText: {
    color: 'white',
    fontWeight: '600'
  },
  tooltipText: {
    color: 'white'
  }
})
