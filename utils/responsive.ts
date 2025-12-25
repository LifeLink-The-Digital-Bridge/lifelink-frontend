import { Dimensions } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const guidelineBaseWidth = 375;
const guidelineBaseHeight = 812;

const scale = (size: number) => (SCREEN_WIDTH / guidelineBaseWidth) * size;
const verticalScale = (size: number) => (SCREEN_HEIGHT / guidelineBaseHeight) * size;
const moderateScale = (size: number, factor = 0.5) => size + (scale(size) - size) * factor;

const widthPercentageToDP = (percentage: number | string) => {
    const value = typeof percentage === "string" ? parseFloat(percentage) : percentage;
    return scale((guidelineBaseWidth * value) / 100);
};

const heightPercentageToDP = (percentage: number | string) => {
    const value = typeof percentage === "string" ? parseFloat(percentage) : percentage;
    return verticalScale((guidelineBaseHeight * value) / 100);
};

export { heightPercentageToDP, moderateScale, scale, verticalScale, widthPercentageToDP };

