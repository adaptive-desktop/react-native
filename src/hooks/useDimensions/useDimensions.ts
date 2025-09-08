import { useState, useEffect } from 'react';
import { Dimensions, ScaledSize } from 'react-native';

export interface DimensionsHook {
  window: ScaledSize;
  screen: ScaledSize;
}

export const useDimensions = (): DimensionsHook => {
  const [dimensions, setDimensions] = useState(() => ({
    window: Dimensions.get('window'),
    screen: Dimensions.get('screen'),
  }));

  useEffect(() => {
    const subscription = Dimensions.addEventListener(
      'change',
      ({ window, screen }) => {
        setDimensions({ window, screen });
      }
    );

    return () => subscription?.remove();
  }, []);

  return dimensions;
};
