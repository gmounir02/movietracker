import React, { useRef } from "react";
import {
  Animated,
  Text,
  StyleSheet,
  ActivityIndicator,
  Pressable,
} from "react-native";
import { useTheme } from "../context/ThemeContext";

// Bouton stylisé réutilisable avec feedback scale
export default function PrimaryButton({
  title,
  onPress,
  loading,
  style,
  disabled,
}) {
  const { theme } = useTheme();
  const scale = useRef(new Animated.Value(1)).current;

  const onPressIn = () =>
    Animated.spring(scale, { toValue: 0.96, useNativeDriver: true }).start();
  const onPressOut = () =>
    Animated.spring(scale, { toValue: 1, useNativeDriver: true }).start();

  return (
    <Pressable
      onPress={onPress}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      disabled={loading || disabled}
    >
      <Animated.View
        style={[
          styles.button,
          { backgroundColor: theme.primary, transform: [{ scale }] },
          style,
        ]}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.text}>{title}</Text>
        )}
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  text: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
});
