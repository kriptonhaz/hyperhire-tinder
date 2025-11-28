import Feather from '@expo/vector-icons/Feather';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import SimpleLineIcons from '@expo/vector-icons/SimpleLineIcons';
import { SymbolView, SymbolViewProps, SymbolWeight } from 'expo-symbols';
import { StyleProp, ViewStyle } from 'react-native';

const iconLibraries = {
  MaterialIcons,
  SimpleLineIcons,
  FontAwesome,
  FontAwesome5,
  Ionicons,
  Feather,
} as const;

type IconLibraryName = keyof typeof iconLibraries;

export function IconSymbol({
  name,
  size = 24,
  color,
  style,
  weight = 'regular',
  forceMaterialIcon = false,
  iconLibrary = 'MaterialIcons',
}: {
  name: SymbolViewProps['name'] | string;
  size?: number;
  color: string;
  style?: StyleProp<ViewStyle>;
  weight?: SymbolWeight;
  forceMaterialIcon?: boolean;
  iconLibrary?: IconLibraryName;
}) {
  if (forceMaterialIcon) {
    const IconComponent = iconLibraries[iconLibrary];
    return (
      <IconComponent 
        color={color} 
        size={size} 
        name={name as any} 
        style={style as any} 
      />
    );
  }

  return (
    <SymbolView
      weight={weight}
      tintColor={color}
      resizeMode="scaleAspectFit"
      name={name as SymbolViewProps['name']}
      style={[
        {
          width: size,
          height: size,
        },
        style,
      ]}
    />
  );
}
