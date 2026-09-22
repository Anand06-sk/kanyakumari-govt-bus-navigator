/**
 * responsive.ts
 * ------------------------------------------------------------------
 * Drop this file in:  <project-root>/utils/responsive.ts
 * (The other 3 files import it as "../../utils/responsive" — adjust
 * the path if your folder structure is different.)
 *
 * WHY THIS EXISTS
 * ------------------------------------------------------------------
 * Before, each screen computed its own responsive math by hand
 * (e.g. `Math.max(22, Math.min(width * 0.065, 28))`), which:
 *   1. gets copy-pasted and drifts out of sync between screens
 *   2. mixes up "scale by width %" with "fixed px" in random places
 *   3. has no tablet handling (a % of a 1024px-wide iPad is huge)
 *
 * This hook centralizes the technique so EVERY screen in the app
 * scales the same, predictable way. See the bottom of this file for
 * a short "how to use this on any new screen" cheat-sheet.
 */

import { useWindowDimensions } from "react-native";

// Reference / "design" screen — pick the size your Figma/mockups were
// designed at. 375x812 = iPhone 11/X/13 mini, a very common baseline.
const GUIDELINE_BASE_WIDTH = 375;
const GUIDELINE_BASE_HEIGHT = 812;

export function useResponsive() {
  // useWindowDimensions (not Dimensions.get) is REACTIVE — it re-renders
  // your component automatically on screen rotation, foldables, and
  // Android split-screen/multi-window resizing. This is the #1 reason
  // static Dimensions.get() calls at module load time break responsiveness.
  const { width, height } = useWindowDimensions();

  // --- Linear scale: grows 1:1 with the screen vs. the reference size.
  // Good for: horizontal paddings/margins, image heights.
  const scale = (size: number) => (width / GUIDELINE_BASE_WIDTH) * size;
  const verticalScale = (size: number) =>
    (height / GUIDELINE_BASE_HEIGHT) * size;

  // --- Moderate scale: same idea, but "dampened" by `factor` (0-1).
  // Good for: FONT SIZES and tappable element sizes (buttons, icons).
  // factor = 0   -> no scaling at all (always the base size)
  // factor = 1   -> identical to scale() (full linear scaling)
  // factor = 0.5 -> the sweet spot: text grows a  ""*little* on big
  //                 screens/tablets instead of ballooning, and shrinks
  //                 a little (not a lot) on small phones"".
  const moderateScale = (size: number, factor = 0.5) =>
    size + (scale(size) - size) * factor;
  const moderateVerticalScale = (size: number, factor = 0.5) =>
    size + (verticalScale(size) - size) * factor;

  // --- Percentage-of-screen helpers (shorthand for width * 0.xx).
  const wp = (percentage: number) => (percentage / 100) * width;
  const hp = (percentage: number) => (percentage / 100) * height;

  // --- Simple tablet check. iPads/most Android tablets are >= 768dp wide
  // even in portrait, so this is a reliable, dependency-free heuristic.
  const isTablet = width >= 768;

  // --- Clamp: pairs perfectly with moderateScale to guarantee text/UI
  // never goes below a "still readable" floor or above a "still looks
  // sane" ceiling, no matter how big/small the physical screen is.
  const clamp = (value: number, min: number, max: number) =>
    Math.min(Math.max(value, min), max);

  return {
    width,
    height,
    scale,
    verticalScale,
    moderateScale,
    moderateVerticalScale,
    wp,
    hp,
    isTablet,
    clamp,
  };
}

/**
 * ------------------------------------------------------------------
 * HOW TO MAKE *ANY* SCREEN RESPONSIVE — QUICK RECIPE
 * ------------------------------------------------------------------
 * 1. Import & call the hook at the top of your component:
 *      const { width, height, moderateScale, wp, hp, isTablet, clamp } = useResponsive();
 *
 * 2. Font sizes & tappable elements (buttons/icons) -> moderateScale + clamp:
 *      fontSize: clamp(moderateScale(16), 13, 20)
 *
 * 3. Spacing / paddings / margins that should track screen size ->
 *    wp()/hp() (percentage) or scale()/verticalScale() (linear):
 *      paddingHorizontal: wp(6)      // 6% of screen width
 *      marginTop: hp(2)              // 2% of screen height
 *
 * 4. Fixed-ratio elements (images, cards) -> flex + a minHeight/minWidth
 *    floor so they never collapse on very short/narrow screens:
 *      imageContainer: { flex: 1, minHeight: hp(30) }
 *
 * 5. Tablets -> don't just let things stretch full-width. Cap it:
 *      maxWidth: isTablet ? 560 : "100%"
 *
 * 6. Orientation changes -> useWindowDimensions() (inside this hook)
 *    already re-renders your component automatically. If you have
 *    something stateful that depends on width (like a FlatList's
 *    horizontal scroll offset), re-sync it in a useEffect keyed on
 *    `width` (see Onboarding.tsx for a real example).
 *
 * 7. Never hardcode raw pixel numbers for anything visual once you've
 *    read this — if you catch yourself typing `fontSize: 16`, ask
 *    "should this scale?" first.
 * ------------------------------------------------------------------
 */
