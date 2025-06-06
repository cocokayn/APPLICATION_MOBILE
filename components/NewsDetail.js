// components/NewsDetail.js
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { WebView } from 'react-native-webview';

export default function NewsDetail({ route }) {
  const { article } = route.params;

  return (
    <View style={styles.container}>
      <WebView
        source={{ uri: article.url }}
        startInLoadingState={true}
        style={{ flex: 1 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
