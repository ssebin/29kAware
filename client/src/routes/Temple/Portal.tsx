import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import dayjs from 'dayjs';
import React, {useContext, useEffect, useRef, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {StyleSheet} from 'react-native';
import Animated, {FadeOut} from 'react-native-reanimated';
import Video from 'react-native-video';
import {useRecoilValue} from 'recoil';
import styled from 'styled-components/native';
import Button from '../../common/components/Buttons/Button';
import IconButton from '../../common/components/Buttons/IconButton/IconButton';

import Gutters from '../../common/components/Gutters/Gutters';
import {ArrowLeftIcon} from '../../common/components/Icons';
import {
  BottomSafeArea,
  Spacer8,
  TopSafeArea,
} from '../../common/components/Spacers/Spacer';
import {Body14} from '../../common/components/Typography/Body/Body';
import {COLORS} from '../../common/constants/colors';
import {HKGroteskBold} from '../../common/constants/fonts';
import {TempleStackProps} from '../../common/constants/routes';
import {SPACINGS} from '../../common/constants/spacings';
import NS from '../../lib/i18n/constants/namespaces';
import * as templeApi from '../Temples/api/temple';
import Counter from './components/Counter/Counter';
import {DailyContext} from './DailyProvider';
import useTempleExercise from './hooks/useTempleExercise';
import usePreventTempleLeave from './hooks/usePreventTempleLeave';
import {participantsAtom, templeAtom} from './state/state';
import {DailyUserData} from '../../../../shared/src/types/Temple';
import useLeaveTemple from './hooks/useLeaveTemple';
import VideoBase from './components/VideoBase/VideoBase';
import useIsTempleFacilitator from './hooks/useIsTempleFacilitator';

type TempleNavigationProps = NativeStackNavigationProp<TempleStackProps>;

const dayjsTime = dayjs().add(59, 'seconds');

const VideoStyled = styled(VideoBase)({
  ...StyleSheet.absoluteFillObject,
  flex: 1,
});

const StatusText = styled(Body14)({
  color: COLORS.PURE_WHITE,
});

const StatusItem = styled.View({
  flexDirection: 'row',
  alignItems: 'center',
});

const BadgeText = styled(StatusText)({
  fontFamily: HKGroteskBold,
});

const Badge = styled.View({
  backgroundColor: COLORS.WHITE_TRANSPARENT,
  paddingVertical: SPACINGS.FOUR,
  paddingHorizontal: SPACINGS.EIGHT,
  borderRadius: SPACINGS.EIGHT,
});

const PortalStatus = styled(Gutters)({
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
});

const Wrapper = styled.View({
  flex: 1,
  justifyContent: 'space-between',
});

const TopBar = styled(Gutters)({
  justifyContent: 'space-between',
  flexDirection: 'row',
  paddingVertical: SPACINGS.EIGHT,
});

const BackButton = styled(IconButton)({
  marginLeft: -SPACINGS.TWELVE,
});

const Portal: React.FC = () => {
  const {
    params: {templeId},
  } = useRoute<RouteProp<TempleStackProps, 'Portal'>>();
  const finalVidRef = useRef<Video>(null);
  const [now, setNow] = useState(dayjs());
  const {joinMeeting} = useContext(DailyContext);
  const [joiningTemple, setJoiningTemple] = useState(false);
  const {t} = useTranslation(NS.SCREEN.PORTAL);
  const exercise = useTempleExercise();
  const temple = useRecoilValue(templeAtom);
  const participants = useRecoilValue(participantsAtom);
  const participantsCount = Object.keys(participants ?? {}).length;
  const isFacilitator = useIsTempleFacilitator();
  const {navigate} = useNavigation<TempleNavigationProps>();
  const leaveTemple = useLeaveTemple();

  usePreventTempleLeave();

  useEffect(() => {
    joinMeeting({inPortal: true} as DailyUserData);
  }, [joinMeeting]);

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(dayjs());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const introPortal = exercise?.introPortal;

  if (!introPortal) {
    return null;
  }

  return (
    <>
      <TopSafeArea />
      <VideoStyled
        ref={finalVidRef}
        onLoad={() => finalVidRef.current?.seek(0)}
        onEnd={() => {
          if (joiningTemple) {
            navigate('Temple', {templeId});
          }
        }}
        paused={!joiningTemple}
        source={{uri: introPortal.videoEnd?.source}}
        resizeMode="cover"
        poster={introPortal.videoEnd?.preview}
        posterResizeMode="cover"
        allowsExternalPlayback={false}
      />
      {!joiningTemple && (
        <VideoStyled
          onEnd={() => {
            if (temple?.started) {
              setJoiningTemple(true);
            }
          }}
          repeat={!temple?.started}
          source={{uri: introPortal.videoLoop?.source}}
          resizeMode="cover"
          poster={introPortal.videoLoop?.preview}
          posterResizeMode="cover"
          allowsExternalPlayback={false}
        />
      )}
      <Wrapper>
        {introPortal.type === 'video' && (
          <>
            <TopBar>
              <BackButton
                noBackground
                onPress={leaveTemple}
                Icon={ArrowLeftIcon}
              />
              {isFacilitator && !temple?.started && (
                <Animated.View exiting={FadeOut.duration(1500)}>
                  <Button
                    disabled={temple?.started}
                    onPress={() => {
                      templeApi.updateTemple(templeId, {started: true});
                    }}>
                    {t('startSession')}
                  </Button>
                </Animated.View>
              )}
              {__DEV__ && temple?.started && (
                <Button onPress={() => navigate('Temple', {templeId})}>
                  {t('skipPortal')}
                </Button>
              )}
            </TopBar>

            <PortalStatus>
              <StatusItem>
                <StatusText>{t('counterLabel.soon')}</StatusText>

                <Spacer8 />
                <Badge>
                  <Counter
                    startTime={dayjsTime}
                    now={now}
                    starting={temple?.started}
                  />
                </Badge>
              </StatusItem>

              {participantsCount > 1 && (
                <StatusItem>
                  <StatusText>{t('participants')}</StatusText>
                  <Spacer8 />
                  <Badge>
                    <BadgeText>{participantsCount}</BadgeText>
                  </Badge>
                </StatusItem>
              )}
            </PortalStatus>
          </>
        )}
      </Wrapper>
      <BottomSafeArea minSize={16} />
    </>
  );
};

export default Portal;
