import { ref, computed, onMounted, onUnmounted } from 'vue';

export function useBreakpoints () {
  const breakpoints = {
    sm: 640,
    md: 768,
    lg: 1024,
    xl: 1280,
    '2xl': 1536,
  };

  // SSR-safe: default to 1024 (lg) width
  const width = ref(typeof window !== 'undefined' ? window.innerWidth : 1024);

  // Throttle helper
  function throttle (fn: () => void, delay: number) {
    let timeoutId: ReturnType<typeof setTimeout> | null = null;
    return () => {
      if (timeoutId) return;
      timeoutId = setTimeout(() => {
        fn();
        timeoutId = null;
      }, delay);
    };
  }

  const updateWidth = () => {
    if (typeof window !== 'undefined') {
      width.value = window.innerWidth;
    }
  };

  onMounted(() => {
    if (typeof window !== 'undefined') {
      updateWidth();
      const throttled = throttle(updateWidth, 150);
      window.addEventListener('resize', throttled);
      onUnmounted(() => window.removeEventListener('resize', throttled));
    }
  });

  const current = computed(() => {
    if (width.value < breakpoints.sm) return 'xs';
    if (width.value < breakpoints.md) return 'sm';
    if (width.value < breakpoints.lg) return 'md';
    if (width.value < breakpoints.xl) return 'lg';
    if (width.value < breakpoints['2xl']) return 'xl';
    return '2xl';
  });

  const isBelow = (bp: keyof typeof breakpoints) =>
    computed(() => width.value < breakpoints[bp]);

  const isAbove = (bp: keyof typeof breakpoints) =>
    computed(() => width.value >= breakpoints[bp]);

  return {
    width,
    current,
    isMobile: computed(() => width.value < breakpoints.md),
    isTablet: computed(() => width.value >= breakpoints.md && width.value < breakpoints.lg),
    isDesktop: computed(() => width.value >= breakpoints.lg),
    isBelow,
    isAbove,
  };
}
