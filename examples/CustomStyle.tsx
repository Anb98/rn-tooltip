// Screenshot: custom-style.png — a brand background color and a
// percentage-based width instead of the pixel default.
import { StyleSheet, Text, View } from 'react-native'
import { Tooltip } from '@anb98/rn-tooltip'

export default function CustomStyle() {
  return (
    <View style={styles.screen}>
      <Tooltip
        backgroundColor="#4F46E5"
        width="80%"
        content={
          <View style={styles.content}>
            <Text style={styles.title}>Custom style</Text>
            <Text style={styles.body}>Brand color and a wide box.</Text>
          </View>
        }
      >
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
    backgroundColor: '#4F46E5'
  },
  buttonText: {
    color: 'white',
    fontWeight: '600'
  },
  content: {
    padding: 4
  },
  title: {
    color: 'white',
    fontWeight: '700',
    marginBottom: 4
  },
  body: {
    color: 'white'
  }
})
