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
  const baseScale = useSharedValue(1);       // Kalıcı zoom değeri
  const pinchScale = useSharedValue(1);      // Anlık pinch hareketi
  const translateX = useSharedValue(0);      // X ekseni sürükleme
  const translateY = useSharedValue(0);      // Y ekseni sürükleme

  // Çift dokunuşla büyüt/küçült
  const doubleTap = Gesture.Tap()
    .numberOfTaps(2)
    .onStart(() => {
      baseScale.value = baseScale.value === 1 ? 2 : 1;
    });

  // Sürükleme
  const drag = Gesture.Pan().onChange((event) => {
    translateX.value += event.changeX;
    translateY.value += event.changeY;
  });

  // İki parmakla yakınlaştırma
  const pinch = Gesture.Pinch()
    .onUpdate((event) => {
      pinchScale.value = event.scale;
    })
    .onEnd(() => {
      baseScale.value *= pinchScale.value;
      pinchScale.value = 1;
    });

  // Görselin büyüklük stili
  const imageStyle = useAnimatedStyle(() => {
    return {
      width: imageSize,
      height: imageSize,
      transform: [
        { scale: withSpring(baseScale.value * pinchScale.value) },
      ],
    };
  });

  // Görselin konum stili
  const containerStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value },
      ],
    };
  });

  // Tüm jestleri birleştiriyoruz
  const composedGesture = Gesture.Simultaneous(drag, pinch, doubleTap);

  return (
    <GestureDetector gesture={composedGesture}>
      <Animated.View style={[containerStyle, { top: -350 }]}>
        <Animated.Image
          source={stickerSource}
          resizeMode="contain"
          style={imageStyle}
        />
      </Animated.View>
    </GestureDetector>
  );
}
