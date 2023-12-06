import {COLORS} from '../../../../../shared/src/constants/colors';
import {Body16} from '../../../lib/components/Typography/Body/Body';
import styled from 'styled-components/native';
import TouchableOpacity from '../../../lib/components/TouchableOpacity/TouchableOpacity';

export const Choices = styled.View({
  flexDirection: 'row',
  flexWrap: 'wrap',
  justifyContent: 'space-between',
  padding: 8,
});
export const Choice = styled(TouchableOpacity)({
  minHeight: 90,
  width: '50%',
  padding: 8,
});
export const Category = styled.View({
  flex: 1,
  padding: 16,
  borderRadius: 16,
  backgroundColor: 'rebeccapurple',
  overflow: 'hidden',
  color: COLORS.PURE_WHITE,
  justifyContent: 'center',
});
export const Collection = styled.View({
  flex: 1,
  padding: 16,
  borderRadius: 16,
  backgroundColor: 'teal',
  overflow: 'hidden',
  justifyContent: 'center',
});
export const Exercise = styled.View({
  flex: 1,
  padding: 16,
  borderRadius: 16,
  backgroundColor: 'orange',
  overflow: 'hidden',
  justifyContent: 'center',
});
export const Tag = styled.View({
  flex: 1,
  padding: 16,
  borderRadius: 16,
  backgroundColor: 'tomato',
  overflow: 'hidden',
  justifyContent: 'center',
});
export const Label = styled(Body16)({
  textAlign: 'center',
  color: COLORS.PURE_WHITE,
});
