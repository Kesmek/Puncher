import { initialWindowMetrics, Metrics } from 'react-native-safe-area-context';

const colors = {
  BACKGROUND: '#222222',
  BLACK: '#111111',
  BORDER: '#9292A6',
  CYAN: '#00FFFF',
  PRIMARY_BLUE: '#0000FF',
  PRIMARY_GREEN: '#22DD22',
  PRIMARY_PURPLE: '#8060FF',
  PRIMARY_RED: '#DD2222',
  PRIMARY_WHITE: '#DDDDDD',
  PRIMARY_YELLOW: '#FFFF00',
  SECONDARY_BLUE: '#5555FF',
  SECONDARY_GREEN: '#99FF88',
  SECONDARY_PURPLE: '#BBAAFF',
  SECONDARY_RED: '#FF7788',
  SECONDARY_WHITE: '#A5A5A5',
  SECONDARY_YELLOW: '#DDDD66',
};

const { frame, insets } = initialWindowMetrics as Metrics;

export { colors, frame, insets };
