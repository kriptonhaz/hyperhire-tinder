// Fallback for using MaterialIcons on Android and web.

import Feather from '@expo/vector-icons/Feather';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import SimpleLineIcons from '@expo/vector-icons/SimpleLineIcons';
import { SymbolViewProps, SymbolWeight } from 'expo-symbols';
import { ComponentProps } from 'react';
import { OpaqueColorValue, type StyleProp, type TextStyle } from 'react-native';

type IconMapping = Record<SymbolViewProps['name'], ComponentProps<typeof MaterialIcons>['name']>;
type IconSymbolName = keyof typeof MAPPING;

type IconLibrary = 
  | typeof MaterialIcons
  | typeof SimpleLineIcons
  | typeof FontAwesome
  | typeof FontAwesome5
  | typeof Ionicons
  | typeof Feather;

const iconLibraries = {
  MaterialIcons,
  SimpleLineIcons,
  FontAwesome,
  FontAwesome5,
  Ionicons,
  Feather,
} as const;

type IconLibraryName = keyof typeof iconLibraries;

/**
 * Add your SF Symbols to Material Icons mappings here.
 * - see Material Icons in the [Icons Directory](https://icons.expo.fyi).
 * - see SF Symbols in the [SF Symbols](https://developer.apple.com/sf-symbols/) app.
 */
const MAPPING = {
  'house.fill': 'home',
  'paperplane.fill': 'send',
  'chevron.left.forwardslash.chevron.right': 'code',
  'chevron.right': 'chevron-right',
  'location.fill': 'location-pin',
} as IconMapping;

/**
 * An icon component that uses native SF Symbols on iOS, and Material Icons on Android and web.
 * This ensures a consistent look across platforms, and optimal resource usage.
 * Icon `name`s are based on SF Symbols and require manual mapping to Material Icons.
 */
export function IconSymbol({
  name,
  size = 24,
  color,
  style,
  forceMaterialIcon = false,
  iconLibrary = 'MaterialIcons',
}: {
  name: IconSymbolName | string;
  size?: number;
  color: string | OpaqueColorValue;
  style?: StyleProp<TextStyle>;
  weight?: SymbolWeight;
  forceMaterialIcon?: boolean;
  iconLibrary?: IconLibraryName;
}) {
  const IconComponent = iconLibraries[iconLibrary];
  
  const iconName = forceMaterialIcon 
    ? (name as any)
    : MAPPING[name as IconSymbolName];
  
  return <IconComponent color={color} size={size} name={iconName} style={style} />;
}
