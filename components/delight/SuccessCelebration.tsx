import React, { useEffect, useMemo, useRef, useCallback } from 'react';
import { Animated, StyleSheet, Text, View, Easing } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import theme from '@/constants/DesignTokens';

/** `auto` → minimal unless `autoConfetti` is true (resolved before paint). */
export type SuccessCelebrationVariant = 'minimal' | 'confetti' | 'auto';
export type SuccessCelebrationTone = 'normal' | 'silly';

type Props = {
  visible: boolean;
  onFinished: () => void;
  variant: SuccessCelebrationVariant;
  /** Required when variant is `auto`. */
  autoConfetti?: boolean;
  tone: SuccessCelebrationTone;
  reduceMotion: boolean;
  message: string;
  /** Visible duration ~0.8–1.2s; global save spam is throttled separately (see CelebrationProvider). */
  durationMs: number;
};

const STICKER_NORMAL = '🌿';
const STICKER_SILLY = '🎉';
const CONFETTI_EMOJIS = ['✨', '⭐', '💚', '🌿', '🎊', '🍃'];

function ConfettiParticles({
  active,
  reduceMotion,
  durationMs,
}: {
  active: boolean;
  reduceMotion: boolean;
  durationMs: number;
}) {
  const count = 14;
  const spec = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        emoji: CONFETTI_EMOJIS[i % CONFETTI_EMOJIS.length],
        startX: (Math.random() - 0.5) * 220,
        drift: (Math.random() - 0.5) * 80,
        rotEnd: (Math.random() - 0.5) * 200,
        delay: Math.round(Math.random() * 80),
        scale: 0.65 + Math.random() * 0.5,
        fall: 150 + Math.random() * 50,
      })),
    [active]
  );

  const anims = useRef(
    Array.from({ length: count }, () => ({
      progress: new Animated.Value(0),
    }))
  ).current;

  useEffect(() => {
    if (!active || reduceMotion) return;
    anims.forEach((a) => a.progress.setValue(0));
    const animations = spec.map((s, i) =>
      Animated.timing(anims[i].progress, {
        toValue: 1,
        duration: Math.min(durationMs, 1100),
        delay: s.delay,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      })
    );
    Animated.parallel(animations).start();
  }, [active, reduceMotion, durationMs, spec, anims]);

  if (!active || reduceMotion) return null;

  return (
    <View style={styles.confettiHost} pointerEvents="none">
      {spec.map((s, i) => {
        const { progress } = anims[i];
        const translateY = progress.interpolate({
          inputRange: [0, 1],
          outputRange: [0, s.fall],
        });
        const translateX = progress.interpolate({
          inputRange: [0, 1],
          outputRange: [s.startX, s.startX + s.drift],
        });
        const rotate = progress.interpolate({
          inputRange: [0, 1],
          outputRange: ['0deg', `${s.rotEnd}deg`],
        });
        const opacity = progress.interpolate({
          inputRange: [0, 0.15, 0.85, 1],
          outputRange: [0, 1, 1, 0],
        });
        return (
          <Animated.Text
            key={`${i}-${s.emoji}`}
            style={[
              styles.confettiPiece,
              {
                opacity,
                transform: [{ translateX }, { translateY }, { rotate }, { scale: s.scale }],
              },
            ]}
          >
            {s.emoji}
          </Animated.Text>
        );
      })}
    </View>
  );
}

export default function SuccessCelebration({
  visible,
  onFinished,
  variant,
  autoConfetti = false,
  tone,
  reduceMotion,
  message,
  durationMs,
}: Props) {
  const resolvedVariant = variant === 'auto' ? (autoConfetti ? 'confetti' : 'minimal') : variant;
  const toastOp = useRef(new Animated.Value(0)).current;
  const stickerScale = useRef(new Animated.Value(reduceMotion ? 1 : 0.4)).current;
  const glowOp = useRef(new Animated.Value(0)).current;
  const endedRef = useRef(false);

  const safeFinish = useCallback(() => {
    if (endedRef.current) return;
    endedRef.current = true;
    onFinished();
  }, [onFinished]);

  useEffect(() => {
    if (!visible) return;
    endedRef.current = false;

    if (reduceMotion) {
      toastOp.setValue(0);
      const seq = Animated.sequence([
        Animated.timing(toastOp, {
          toValue: 1,
          duration: 160,
          useNativeDriver: true,
        }),
        Animated.delay(Math.max(400, durationMs - 320)),
        Animated.timing(toastOp, {
          toValue: 0,
          duration: 220,
          useNativeDriver: true,
        }),
      ]);
      seq.start(({ finished }) => {
        if (finished) safeFinish();
      });
      return () => seq.stop();
    }

    toastOp.setValue(0);
    stickerScale.setValue(0.4);
    glowOp.setValue(0);

    const anim = Animated.parallel([
      Animated.spring(stickerScale, {
        toValue: 1,
        friction: 6,
        tension: 120,
        useNativeDriver: true,
      }),
      Animated.sequence([
        Animated.timing(glowOp, { toValue: 0.55, duration: 140, useNativeDriver: true }),
        Animated.timing(glowOp, {
          toValue: 0,
          duration: Math.max(300, durationMs - 200),
          useNativeDriver: true,
        }),
      ]),
      Animated.sequence([
        Animated.timing(toastOp, { toValue: 1, duration: 180, useNativeDriver: true }),
        Animated.delay(Math.max(280, durationMs - 400)),
        Animated.timing(toastOp, { toValue: 0, duration: 240, useNativeDriver: true }),
      ]),
    ]);
    anim.start(({ finished }) => {
      if (finished) safeFinish();
    });
    return () => anim.stop();
  }, [visible, reduceMotion, durationMs, toastOp, stickerScale, glowOp, safeFinish]);

  if (!visible) return null;

  const sticker = tone === 'silly' ? STICKER_SILLY : STICKER_NORMAL;
  const showConfetti = resolvedVariant === 'confetti';

  return (
    <View style={styles.root} pointerEvents="none" accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
      {showConfetti && (
        <ConfettiParticles active={visible} reduceMotion={reduceMotion} durationMs={durationMs} />
      )}

      <View style={styles.centerBlock}>
        {!reduceMotion && (
          <>
            <Animated.View style={[styles.glowRing, { opacity: glowOp }]}>
              <LinearGradient
                colors={[`${theme.colors.primary}00`, `${theme.colors.primary}55`, `${theme.colors.primary}33`]}
                style={styles.glowGradient}
                start={{ x: 0.5, y: 0.5 }}
                end={{ x: 1, y: 1 }}
              />
            </Animated.View>
            <Animated.Text
              style={[
                styles.sticker,
                {
                  transform: [{ scale: stickerScale }],
                },
              ]}
            >
              {sticker}
            </Animated.Text>
          </>
        )}

        <Animated.View style={[styles.toastPill, { opacity: toastOp }]}>
          <Text style={styles.toastText}>{message}</Text>
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 2000,
    justifyContent: 'center',
    alignItems: 'center',
  },
  confettiHost: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: '38%',
  },
  confettiPiece: {
    position: 'absolute',
    fontSize: 20,
  },
  centerBlock: {
    alignItems: 'center',
    justifyContent: 'center',
    maxWidth: '88%',
    marginTop: -24,
  },
  glowRing: {
    position: 'absolute',
    width: 140,
    height: 140,
    borderRadius: 70,
    overflow: 'hidden',
  },
  glowGradient: {
    width: '100%',
    height: '100%',
    borderRadius: 70,
  },
  sticker: {
    fontSize: 44,
    marginBottom: theme.spacing.sm,
  },
  toastPill: {
    backgroundColor: 'rgba(0,0,0,0.72)',
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.lg,
    borderRadius: theme.radius.full,
    marginTop: theme.spacing.xs,
  },
  toastText: {
    ...theme.typography.body,
    color: '#fff',
    textAlign: 'center',
  },
});
