import { Pressable, Text, View } from 'react-native';

export const NotificationFilterTabs = ({
  activeFilter,
  onChange,
}: {
  activeFilter: 'all' | 'unread';
  onChange: (filter: 'all' | 'unread') => void;
}) => (
  <View>
    <Pressable onPress={() => onChange('all')}>
      <Text>{activeFilter === 'all' ? 'All selected' : 'All'}</Text>
    </Pressable>
    <Pressable onPress={() => onChange('unread')}>
      <Text>{activeFilter === 'unread' ? 'Unread selected' : 'Unread'}</Text>
    </Pressable>
  </View>
);
