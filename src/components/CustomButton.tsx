import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { colors } from '../constants/theme';

interface CustomButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary';
  icon?: React.ReactNode;
  disabled?: boolean;
}

export const CustomButton: React.FC<CustomButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  icon,
  disabled = false,
}) => {
  return (
    <View style={[
      styles.buttonContainer,
      variant === 'secondary' && styles.secondaryContainer,
      disabled && styles.disabledContainer,
    ]}>
      <Pressable
        style={[styles.button, disabled && styles.disabledButton]}
        onPress={onPress}
        disabled={disabled}
        android_ripple={{ color: 'rgba(255, 255, 255, 0.1)' }}
      >
        {icon && <View style={styles.iconContainer}>{icon}</View>}
        <Text style={[
          styles.buttonText,
          variant === 'secondary' && styles.secondaryText,
          disabled && styles.disabledText,
        ]}>
          {title}
        </Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 12,
    overflow: 'hidden',
  },
  secondaryContainer: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  disabledContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  disabledButton: {
    opacity: 0.5,
  },
  iconContainer: {
    marginRight: 8,
  },
  buttonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryText: {
    color: colors.white,
  },
  disabledText: {
    opacity: 0.5,
  },
});