import { ScrollView, SafeAreaView, View } from 'react-native'
import Header from '@/components/Header/Header'
import Footer from '@/components/Footer'
import { Slot } from 'expo-router'

const _layout = () => {
  return (
    <SafeAreaView className="mt-12 flex-1 bg-white">
      <Header />
      <ScrollView 
        contentContainerStyle={{ flexGrow: 1 }}
        className="flex-1"
        showsVerticalScrollIndicator={false}
      >
        <View className="flex-1">
          <Slot />
        </View>
        <Footer />
      </ScrollView>
    </SafeAreaView>
  )
}

export default _layout