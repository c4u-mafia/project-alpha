import React, { memo, useState } from 'react';
import {
  Dimensions,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Animated, {
  type SharedValue,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

const { width } = Dimensions.get('window');

type StepTheme = 'dark' | 'light';

type Step = {
  id: number;
  title: string;
  description: string;
  tagline: string;
  type: StepTheme;
  subtext: string;
};

const STEPS: Step[] = [
  {
    id: 1,
    title: 'No Agents,\nNo Hassle.',
    description:
      "We've cut out the middleman. Chat directly with landlords and close deals in minutes, not days.",
    tagline: 'DIRECT TO LANDLORD',
    type: 'dark',
    subtext: 'YOUR URBAN SANCTUARY AWAITS',
  },
  {
    id: 2,
    title: 'Verified\nListings Only',
    description:
      'What you see is what you get. Every home is physically inspected for 100% authenticity.',
    tagline: 'VERIFIED',
    type: 'light',
    subtext: 'QUALITY ASSURED',
  },
];

const StepIndicator = ({
  index,
  progress,
  theme,
}: {
  index: number;
  progress: SharedValue<number>;
  theme: StepTheme;
}) => {
  const animatedStyle = useAnimatedStyle(() => {
    const isActive = Math.round(progress.value) === index;

    return {
      width: withSpring(isActive ? 32 : 12),
      opacity: isActive ? 1 : 0.3,
      backgroundColor: theme === 'dark' ? '#FFFFFF' : '#006970',
    };
  });

  return <Animated.View style={[styles.indicator, animatedStyle]} />;
};

export const Onboarding = memo(({ onFinish }: { onFinish: () => void }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const stepProgress = useSharedValue(0);

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
      const nextStep = currentStep + 1;
      setCurrentStep(nextStep);
      stepProgress.value = withSpring(nextStep);
      return;
    }

    onFinish();
  };

  const step = STEPS[currentStep];
  const isDark = step.type === 'dark';

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: isDark ? '#111827' : '#FFFFFF' },
      ]}
    >
      <View style={styles.heroSection}>
        {isDark ? (
          <View style={[styles.heroPanel, styles.heroDark]}>
            <View style={[styles.blob, styles.blobTop]} />
            <View style={[styles.blob, styles.blobBottom]} />
            <View style={styles.darkTag}>
              <Text style={styles.darkTagText}>{step.tagline}</Text>
            </View>
          </View>
        ) : (
          <View style={[styles.heroPanel, styles.heroLight]}>
            <View style={styles.propertyCard}>
              <View style={styles.propertyImage}>
                <View style={styles.verifiedBadge}>
                  <Text style={styles.verifiedBadgeText}>VERIFIED</Text>
                </View>
              </View>
              <View style={styles.propertyFooter}>
                <View>
                  <Text style={styles.propertyTitle}>Azure Bay Apartment</Text>
                  <Text style={styles.propertyLocation}>
                    Victoria Island, Lagos
                  </Text>
                </View>
                <Text style={styles.propertyPrice}>N4.5M</Text>
              </View>
            </View>
          </View>
        )}

        <View style={styles.headerOverlay}>
          <Text style={[styles.brand, isDark ? styles.brandDark : styles.brandLight]}>
            RentDirect
          </Text>
          <Pressable onPress={onFinish} style={styles.skipTouch}>
            <View
              style={[
                styles.skipChip,
                isDark ? styles.skipChipDark : styles.skipChipLight,
              ]}
            >
              <Text
                style={[
                  styles.skipText,
                  isDark ? styles.skipTextDark : styles.skipTextLight,
                ]}
              >
                Skip
              </Text>
            </View>
          </Pressable>
        </View>
      </View>

      <View style={styles.contentSection}>
        <View style={styles.indicatorRow}>
          {STEPS.map((_, index) => (
            <StepIndicator
              key={index}
              index={index}
              progress={stepProgress}
              theme={step.type}
            />
          ))}
        </View>

        <Text style={[styles.title, isDark ? styles.titleDark : styles.titleLight]}>
          {step.title}
        </Text>

        <Text
          style={[
            styles.description,
            isDark ? styles.descriptionDark : styles.descriptionLight,
          ]}
        >
          {step.description}
        </Text>

        <View style={styles.footer}>
          <Pressable
            onPress={handleNext}
            style={({ pressed }) => [
              styles.primaryButton,
              isDark ? styles.primaryButtonDark : styles.primaryButtonLight,
              pressed && styles.primaryButtonPressed,
            ]}
          >
            <Text
              style={[
                styles.primaryButtonText,
                isDark
                  ? styles.primaryButtonTextDark
                  : styles.primaryButtonTextLight,
              ]}
            >
              Next
            </Text>
            <Text
              style={[
                styles.primaryButtonArrow,
                isDark
                  ? styles.primaryButtonTextDark
                  : styles.primaryButtonTextLight,
              ]}
            >
              {'->'}
            </Text>
          </Pressable>

          <Text style={styles.subtext}>{step.subtext}</Text>
        </View>
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  heroSection: {
    height: '50%',
    position: 'relative',
    width: '100%',
  },
  heroPanel: {
    flex: 1,
  },
  heroDark: {
    alignItems: 'center',
    backgroundColor: '#004D53',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  heroLight: {
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    padding: 32,
  },
  blob: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 9999,
    position: 'absolute',
  },
  blobTop: {
    height: 192,
    right: -48,
    top: -48,
    width: 192,
  },
  blobBottom: {
    bottom: -96,
    height: 256,
    left: -48,
    width: 256,
  },
  darkTag: {
    backgroundColor: 'rgba(255,255,255,0.10)',
    borderColor: 'rgba(255,255,255,0.20)',
    borderRadius: 9999,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  darkTagText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1.8,
  },
  propertyCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    elevation: 4,
    padding: 16,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.08,
    shadowRadius: 20,
    width: '100%',
  },
  propertyImage: {
    backgroundColor: '#006970',
    borderRadius: 20,
    height: 192,
    marginBottom: 16,
    overflow: 'hidden',
    position: 'relative',
  },
  verifiedBadge: {
    backgroundColor: '#FFFFFF',
    borderRadius: 9999,
    paddingHorizontal: 12,
    paddingVertical: 4,
    position: 'absolute',
    right: 16,
    top: 16,
  },
  verifiedBadgeText: {
    color: '#006970',
    fontSize: 10,
    fontWeight: '700',
  },
  propertyFooter: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  propertyTitle: {
    color: '#111827',
    fontSize: 18,
    fontWeight: '700',
  },
  propertyLocation: {
    color: '#A3A3A3',
    fontSize: 14,
    marginTop: 2,
  },
  propertyPrice: {
    color: '#006970',
    fontSize: 18,
    fontWeight: '700',
  },
  headerOverlay: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    left: 0,
    paddingHorizontal: 32,
    position: 'absolute',
    right: 0,
    top: 48,
  },
  brand: {
    fontSize: 20,
    fontWeight: '700',
  },
  brandDark: {
    color: '#FFFFFF',
  },
  brandLight: {
    color: '#006970',
  },
  skipTouch: {
    borderRadius: 9999,
  },
  skipChip: {
    borderRadius: 9999,
    paddingHorizontal: 16,
    paddingVertical: 6,
  },
  skipChipDark: {
    backgroundColor: 'rgba(255,255,255,0.20)',
  },
  skipChipLight: {
    backgroundColor: 'rgba(0,105,112,0.10)',
  },
  skipText: {
    fontWeight: '600',
  },
  skipTextDark: {
    color: '#FFFFFF',
  },
  skipTextLight: {
    color: '#006970',
  },
  contentSection: {
    flex: 1,
    paddingHorizontal: 32,
    paddingTop: 40,
  },
  indicatorRow: {
    flexDirection: 'row',
    marginBottom: 40,
  },
  indicator: {
    borderRadius: 9999,
    height: 8,
    marginHorizontal: 4,
  },
  title: {
    fontSize: width > 380 ? 46 : 40,
    fontWeight: '700',
    letterSpacing: -1.5,
    lineHeight: width > 380 ? 52 : 46,
    marginBottom: 24,
  },
  titleDark: {
    color: '#FFFFFF',
  },
  titleLight: {
    color: '#111827',
  },
  description: {
    fontSize: 18,
    lineHeight: 30,
    marginBottom: 48,
  },
  descriptionDark: {
    color: 'rgba(255,255,255,0.60)',
  },
  descriptionLight: {
    color: '#737373',
  },
  footer: {
    alignItems: 'center',
    marginBottom: 64,
    marginTop: 'auto',
  },
  primaryButton: {
    alignItems: 'center',
    borderRadius: 24,
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: 20,
    width: '100%',
  },
  primaryButtonDark: {
    backgroundColor: '#FFFFFF',
  },
  primaryButtonLight: {
    backgroundColor: '#004D53',
  },
  primaryButtonPressed: {
    opacity: 0.9,
  },
  primaryButtonText: {
    fontSize: 20,
    fontWeight: '700',
    marginRight: 8,
  },
  primaryButtonTextDark: {
    color: '#004D53',
  },
  primaryButtonTextLight: {
    color: '#FFFFFF',
  },
  primaryButtonArrow: {
    fontSize: 20,
  },
  subtext: {
    color: '#A3A3A3',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 4,
    marginTop: 24,
    textTransform: 'uppercase',
  },
});
