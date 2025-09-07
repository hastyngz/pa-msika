import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';

export default function ItemCard({ item, onPress }) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      {item.images && item.images[0] ? (
        <Image source={{ uri: item.images[0] }} style={styles.image} />
      ) : null}
      <View style={styles.content}>
        <Text style={styles.title}>{item.title}</Text>
        <Text>{item.category}</Text>
        <Text style={styles.price}>MK {item.price}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: { flexDirection: 'row', padding: 10, borderBottomWidth: 1, alignItems: 'center' },
  image: { width: 80, height: 80, borderRadius: 6, marginRight: 10 },
  content: { flex: 1 },
  title: { fontWeight: 'bold' },
  price: { marginTop: 6 }
});

