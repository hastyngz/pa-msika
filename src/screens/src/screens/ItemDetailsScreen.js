import React, { useEffect, useState } from 'react';
import { View, Text, Button, ScrollView } from 'react-native';
import { collection, query, where, getDocs, addDoc } from 'firebase/firestore';
import { db } from '../services/firebase';
import { useAuth } from '../context/AuthContext';

export default function ItemDetailsScreen({ route, navigation }) {
  const { item } = route.params;
  const { user } = useAuth();
  const [images, setImages] = useState([]);

  useEffect(() => {
    const loadImages = async () => {
      const q = query(collection(db, 'postImages'), where('postId', '==', item.id));
      const snap = await getDocs(q);
      if (!snap.empty) setImages(snap.docs[0].data().images || []);
    };
    loadImages();
  }, []);

  const placeOrder = async () => {
    // Create an order doc
    await addDoc(collection(db, 'orders'), {
      postId: item.id,
      buyerId: user.uid,
      ownerId: item.ownerId,
      status: 'pending',
      createdAt: new Date()
    });
    alert('Order placed. Seller will contact you.');
    navigation.navigate('Orders');
  };

  return (
    <ScrollView contentContainerStyle={{ padding: 16 }}>
      <Text style={{ fontSize: 20, fontWeight: 'bold' }}>{item.title}</Text>
      <Text>Category: {item.category}</Text>
      <Text>Price: MK {item.price}</Text>
      <Text style={{ marginTop: 16 }}>{item.description}</Text>
      <View style={{ height: 20 }} />
      <Button title="Place Order / Contact" onPress={placeOrder} />
    </ScrollView>
  );
}

