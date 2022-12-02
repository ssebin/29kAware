import React from 'react';
import {useTranslation} from 'react-i18next';
import {Linking} from 'react-native';
import styled from 'styled-components/native';
import {COLORS} from '../../../../shared/src/constants/colors';
import Button from '../../common/components/Buttons/Button';
import TextButton from '../../common/components/Buttons/TextButton/TextButton';
import Gutters from '../../common/components/Gutters/Gutters';
import Image from '../../common/components/Image/Image';
import Screen from '../../common/components/Screen/Screen';
import {
  BottomSafeArea,
  Spacer16,
  Spacer20,
  Spacer32,
  Spacer40,
  TopSafeArea,
} from '../../common/components/Spacers/Spacer';
import {Display24} from '../../common/components/Typography/Display/Display';
import Markdown from '../../common/components/Typography/Markdown/Markdown';
import {SPACINGS} from '../../common/constants/spacings';
import useAppState from '../../lib/appState/state/state';

const Wrapper = styled(Gutters).attrs({big: true})({
  flex: 1,
  justifyContent: 'space-between',
});
const TopImage = styled(Image)({
  minWidth: 132,
  minHeight: 132,
  flex: 1,
  alignSelf: 'center',
  aspectRatio: '1',
});
const CenteredHeading = styled(Display24)({
  textAlign: 'center',
});
const EmailWrapper = styled.View({
  marginTop: -SPACINGS.SIXTEEN,
});
const ButtonWrapper = styled.View({
  flex: 1,
  justifyContent: 'flex-end',
  alignItems: 'center',
});

const Welcome = () => {
  const {t} = useTranslation('Screen.Welcome');
  const setIsFirstLaunch = useAppState(state => state.setIsFirstLaunch);
  const emailURL = t('email.url');

  const onEmail = () => {
    if (emailURL) {
      Linking.openURL(emailURL);
    }
  };

  const onContinue = () => {
    setIsFirstLaunch(false);
  };

  return (
    <Screen backgroundColor={COLORS.CREAM}>
      <TopSafeArea />
      <Wrapper>
        <Spacer32 />
        <TopImage source={{uri: t('image__image')}} />
        <Spacer20 />
        <CenteredHeading>{t('heading')}</CenteredHeading>
        <Spacer16 />
        <Markdown>{t('text__markdown')}</Markdown>
        <EmailWrapper>
          <TextButton onPress={onEmail} title={t('email.text')} />
        </EmailWrapper>
        <ButtonWrapper>
          <Button onPress={onContinue}>{t('button')}</Button>
        </ButtonWrapper>
        <Spacer40 />
      </Wrapper>
      <BottomSafeArea />
    </Screen>
  );
};
export default Welcome;
