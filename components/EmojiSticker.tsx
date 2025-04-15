import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { type ImageSource } from 'expo-image';

type Props = {
  imageSize: number;
  stickerSource: ImageSource;
};

export default function EmojiSticker({ imageSize, stickerSource }: Props) {
  const baseScale = useSharedValue(1);
  const pinchScale = useSharedValue(1);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);

  const doubleTap = Gesture.Tap()
    .numberOfTaps(2)
    .onStart(() => {
      baseScale.value = baseScale.value === 1 ? 2 : 1;
    });

  const drag = Gesture.Pan().onChange((event) => {
    translateX.value += event.changeX;
    translateY.value += event.changeY;
  });

  const pinch = Gesture.Pinch()
    .onUpdate((event) => {
      pinchScale.value = event.scale;
    })
    .onEnd(() => {
      baseScale.value *= pinchScale.value;
      pinchScale.value = 1;
    });

  const imageStyle = useAnimatedStyle(() => {
    return {
      width: imageSize,
      height: imageSize,
      transform: [{ scale: withSpring(baseScale.value * pinchScale.value) }],
    };
  });

  const containerStyle = useAnimatedStyle(() => {
    return {
      position: 'absolute', // ✅ kilit nokta!
      top: 150,
      left: 150,
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value },
      ],
    };
  });

  const composedGesture = Gesture.Simultaneous(drag, pinch, doubleTap);

  return (
    <GestureDetector gesture={composedGesture}>
      <Animated.View style={containerStyle}>
        <Animated.Image
          source={stickerSource}
          resizeMode="contain"
          style={imageStyle}
        />
      </Animated.View>
    </GestureDetector>
  );
}
