import React, { useState } from 'react';
import { View, TextInput, Button, Picker, Text, StyleSheet, ScrollView } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db, storage } from '../services/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { CATEGORIES } from '../constants/CATEGORIES';
import { useAuth } from '../context/AuthContext';

export default function PostItemScreen({ navigation }) {
  const { user } = useAuth();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0].key);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);

  const pickImage = async () => {
    const res = await ImagePicker.launchImageLibraryAsync({ quality: 0.6 });
    if (!res.cancelled) setImages((p) => [...p, res.uri]);
  };

  const uploadImages = async (uris, postId) => {
    const urls = [];
    for (let i = 0; i < uris.length; i++) {
      const uri = uris[i];
      const resp = await fetch(uri);
      const blob = await resp.blob();
      const imageRef = ref(storage, `posts/${postId}/${Date.now()}_${i}.jpg`);
      await uploadBytes(imageRef, blob);
      const url = await getDownloadURL(imageRef);
      urls.push(url);
    }
    return urls;
  };

  const submit = async () => {
    setLoading(true);
    try {
      const docRef = await addDoc(collection(db, 'posts'), {
        title,
        description,
        price: Number(price),
        category,
        ownerId: user.uid,
        status: 'available',
        createdAt: serverTimestamp()
      });

      if (images.length) {
        const urls = await uploadImages(images, docRef.id);
        // update the post with images
        await addDoc(collection(db, 'postImages'), { postId: docRef.id, images: urls });
        // NOTE: For simplicity we store images in a separate collection; you can instead update the post doc
      }

      setLoading(false);
      navigation.goBack();
    } catch (e) {
      console.log(e);
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={{ padding: 16 }}>
      <Text style={styles.label}>Title</Text>
      <TextInput value={title} onChangeText={setTitle} style={styles.input} />
      <Text style={styles.label}>Description</Text>
      <TextInput value={description} onChangeText={setDescription} style={[styles.input, { height: 100 }]} multiline />
      <Text style={styles.label}>Price (MK)</Text>
      <TextInput value={price} onChangeText={setPrice} keyboardType="numeric" style={styles.input} />

      <Text style={styles.label}>Category</Text>
      <Picker selectedValue={category} onValueChange={(v) => setCategory(v)}>
        {CATEGORIES.map((c) => (
          <Picker.Item key={c.key} label={c.label} value={c.key} />
        ))}
      </Picker>

      <Button title="Pick images" onPress={pickImage} />
      <View style={{ height: 12 }} />
      <Button title={loading ? 'Posting...' : 'Post Item'} onPress={submit} disabled={loading} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  input: { borderWidth: 1, borderRadius: 6, padding: 8, marginBottom: 12 },
  label: { fontWeight: 'bold', marginBottom: 6 }
});

