// components/CustomHeader.js
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';


const CustomHeader = ({ title, subtitle, icons = [], onIconPress = {} }) => {
  return (
    <View style={styles.container}>
      <View style={styles.titleSection}>
        <Text style={styles.title}>{title}</Text>
        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      </View>
      <View style={styles.iconSection}>
        {icons.map((iconName, index) => (
          <TouchableOpacity key={index} onPress={onIconPress[iconName] || (() => {})}>
            <Ionicons name={iconName} size={24} color="#fff" style={styles.icon} />
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

export default CustomHeader;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#001A1A',
    padding: 16,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  titleSection: {
    flexDirection: 'column',
  },
  title: {
    fontSize: 32,
    color: '#fff',
    fontWeight: '900',
  },
  subtitle: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.5,
  },
  iconSection: {
    flexDirection: 'row',
    gap: 16,
    color: '#fff',
    opacity: 0.7,
  },
  icon: {
    marginLeft: 16,
  },
});
