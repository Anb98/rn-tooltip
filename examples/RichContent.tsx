// Screenshot: rich-content.png — coachmark pattern: arbitrary ReactNode
// content (title + body) plus a "Got it" button that closes the tooltip
// through the imperative ref API from inside its own content.
import { useRef } from 'react'
import { Pressable, StyleSheet, Text, View } from 'react-native'
import { Tooltip, TooltipRef } from '@anb98/rn-tooltip'

export default function RichContent() {
  const tooltipRef = useRef<TooltipRef>(null)

  return (
    <View style={styles.screen}>
      <Tooltip
        ref={tooltipRef}
        content={
          <View style={styles.content}>
            <Text style={styles.title}>New feature</Text>
            <Text style={styles.body}>Tap here to filter your results.</Text>
            <Pressable style={styles.dismiss} onPress={() => tooltipRef.current?.close()}>
              <Text style={styles.dismissText}>Got it</Text>
            </Pressable>
          </View>
        }
      >
        <Text style={styles.trigger}>Filter</Text>
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
  content: {
    padding: 4
  },
  title: {
    color: 'white',
    fontWeight: '700',
    marginBottom: 4
  },
  body: {
    color: 'white',
    marginBottom: 8
  },
  dismiss: {
    alignSelf: 'flex-end',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 6,
    backgroundColor: 'rgba(255,255,255,0.2)'
  },
  dismissText: {
    color: 'white',
    fontWeight: '600'
  }
})
