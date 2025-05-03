import { View, Text, Image } from 'react-native';

interface TabIconProps {
  icon: any;
  color: string;
  name: string;
  focused: boolean;
}

export default function TabIcon({ icon, color, name, focused }: TabIconProps) {
  return (
    <View style={{ alignItems: 'center', justifyContent: 'flex-start', height: '100%' }}>
      <Image
        source={icon}
        resizeMode="contain"
        style={{
          width: 28,
          height: 28,
        }}
      />
      <Text
        numberOfLines={1}
        style={{
          fontSize: 9,
          color: focused ? '#2874F0' : '#828282',
          textAlign: 'center',
          fontWeight: focused ? 'bold' : 'normal',
        }}
      >
        {name}
      </Text>
    </View>
  );
} 