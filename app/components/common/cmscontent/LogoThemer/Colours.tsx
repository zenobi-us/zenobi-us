import { RosePineDawn } from '../../../../theme/colours/rosepinedawn';
import { RosePineMoon } from '../../../../theme/colours/rosepinemoon';

export const Colours = Object.entries({ RosePineDawn, RosePineMoon }).reduce(
  (acc, [name, palette]) => {
    return {
      ...acc,
      ...Object.entries(palette).reduce((acc, [key, value]) => {
        return {
          ...acc,
          [`${name}_${key}`]: value,
        };
      }, {}),
    };
  },
  {}
);
