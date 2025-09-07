import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Button, ActivityIndicator } from 'react-native';
import { collection, query, where, onSnapshot, orderBy } from 'firebase/firestore';
import { db } from '../services/firebase';
import ItemCard from '../components/ItemCard';

export default function HomeScreen({ navigation }) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'posts'), orderBy('createdAt', 'desc'));
    const unsub = onSnapshot(q, (snapshot) => {
      const arr = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
      setPosts(arr);
      setLoading(false);
    });
    return unsub;
  }, []);

  if (loading) return <ActivityIndicator style={{ flex: 1 }} />;

  return (
    <View style={{ flex: 1 }}>
      <Button title="Post Item" onPress={() => navigation.navigate('PostItem')} />
      <FlatList
        data={posts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ItemCard item={item} onPress={() => navigation.navigate('ItemDetails', { item })} />
        )}
      />
    </View>
  );
}
