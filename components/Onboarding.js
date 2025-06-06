// components/Onboarding.js

import React from 'react';
import { View, Text, StyleSheet, Flatlist } from 'react-native';

import slides from '../slides'
import Onboardingitem from './Onboardingitem'
export default  Onboarding = () => {
  return (
    <View style={styles.container}>
      <Flatlist data={slides} renderItem={({ item}) => < Onboardingitem item={item} />} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  text: {
    fontSize: 20,
    color: '#333',
  },
});
