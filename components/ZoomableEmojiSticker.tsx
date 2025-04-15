import { Gesture, GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  withSpring,
  clamp,
} from 'react-native-reanimated';
import { type ImageSource } from 'expo-image';
import { Dimensions } from 'react-native';

type Props = {
  imageSize: number;
  stickerSource: ImageSource;
};

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export default function EmojiSticker({ imageSize, stickerSource }: Props) {
  const scale = useSharedValue(1);
  const offsetScale = useSharedValue(1);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const savedTranslateX = useSharedValue(0);
  const savedTranslateY = useSharedValue(0);

  const MIN_SCALE = 1;
  const MAX_SCALE = 4;

  const pinch = Gesture.Pinch()
    .onUpdate((e) => {
      scale.value = clamp(offsetScale.value * e.scale, MIN_SCALE, MAX_SCALE);
    })
    .onEnd(() => {
      offsetScale.value = scale.value;
    });

  const pan = Gesture.Pan()
    .onStart(() => {
      savedTranslateX.value = translateX.value;
      savedTranslateY.value = translateY.value;
    })
    .onUpdate((e) => {
      translateX.value = savedTranslateX.value + e.translationX;
      translateY.value = savedTranslateY.value + e.translationY;
    });

  const doubleTap = Gesture.Tap()
    .numberOfTaps(2)
    .onStart(() => {
      if (scale.value > 1) {
        scale.value = withTiming(1);
        offsetScale.value = 1;
        translateX.value = withTiming(0);
        translateY.value = withTiming(0);
      } else {
        scale.value = withTiming(2);
        offsetScale.value = 2;
      }
    });

  const composed = Gesture.Simultaneous(pan, pinch, doubleTap);

  const animatedImageStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { scale: scale.value },
    ],
  }));

  return (
    <GestureHandlerRootView>
      <GestureDetector gesture={composed}>
        <Animated.Image
          source={stickerSource}
          resizeMode="contain"
          style={[
            {
              width: imageSize,
              height: imageSize,
              top: -350,
              alignSelf: 'center',
            },
            animatedImageStyle,
          ]}
        />
      </GestureDetector>
    </GestureHandlerRootView>
  );
}
