import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, SafeAreaView, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NavigationProp } from '../types';
import tw from 'twrnc';

type BlogPost = {
  id: string;
  title: string;
  excerpt: string;
  date: string;
};

const Blog: React.FC = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const navigation = useNavigation<NavigationProp<'Blog'>>();

  useEffect(() => {
    setTimeout(() => {
      setPosts([
        { id: '1', title: 'First Blog Post', excerpt: 'This is a sample excerpt for the first blog post.', date: '2025-04-10' },
        { id: '2', title: 'Second Blog Post', excerpt: 'This is a sample excerpt for the second blog post.', date: '2025-04-05' },
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  if (loading) {
    return (
      <View style={tw`flex-1 justify-center items-center`}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  const renderItem = ({ item }: { item: BlogPost }) => (
    <TouchableOpacity
      style={tw`bg-gray-100 rounded-lg p-4 mb-4 shadow-md`}
      onPress={() => navigation.navigate('BlogPost', { id: item.id })}
    >
      <Text style={tw`text-lg font-semibold text-gray-800 mb-2`}>{item.title}</Text>
      <Text style={tw`text-sm text-gray-600 mb-2`}>{item.excerpt}</Text>
      <Text style={tw`text-xs text-gray-500`}>{item.date}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={tw`flex-1 bg-white`}>
      <View style={tw`p-4 border-b border-gray-200 items-center`}>
        <Text style={tw`text-2xl font-bold text-gray-800`}>Blog</Text>
      </View>

      <FlatList
        data={posts}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={tw`p-4`}
      />
    </SafeAreaView>
  );
};

export default Blog;
