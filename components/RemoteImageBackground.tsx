import { ImageBackground, ImageBackgroundProps, StyleSheet, View } from 'react-native';
import { useState } from 'react';
import { colors } from '@/constants/theme';

interface RemoteImageBackgroundProps extends ImageBackgroundProps {
  fallbackColor?: string;
}

export function RemoteImageBackground({
  children,
  fallbackColor = colors.cardElevated,
  onError,
  style,
  ...props
}: RemoteImageBackgroundProps) {
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return <View style={[styles.fallback, { backgroundColor: fallbackColor }, style]}>{children}</View>;
  }

  return (
    <ImageBackground
      {...props}
      style={style}
      onError={(event) => {
        setHasError(true);
        onError?.(event);
      }}>
      {children}
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  fallback: {
    overflow: 'hidden',
  },
});
