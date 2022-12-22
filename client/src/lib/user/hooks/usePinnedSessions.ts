import dayjs from 'dayjs';
import {useCallback, useMemo} from 'react';
import {Session} from '../../../../../shared/src/types/Session';
import useLogSessionMetricEvents from '../../../routes/Session/hooks/useLogSessionMetricEvents';
import useUserState from '../state/state';
import useCurrentUserState from './useCurrentUserState';

const usePinnedSessons = () => {
  const userState = useCurrentUserState();
  const setPinnedSessions = useUserState(state => state.setPinnedSessions);
  const {logSessionMetricEvent} = useLogSessionMetricEvents();

  const pinnedSessions = useMemo(
    () => userState?.pinnedSessions ?? [],
    [userState],
  );

  const togglePinSession = useCallback(
    (session: Session) => {
      const now = dayjs();
      const currentPinnedSessions = pinnedSessions.filter(s =>
        now.isBefore(s.expires),
      );

      if (currentPinnedSessions.find(ps => ps.id === session.id)) {
        setPinnedSessions(
          currentPinnedSessions.filter(ps => ps.id !== session.id),
        );
      } else {
        setPinnedSessions([
          ...currentPinnedSessions,
          {
            id: session.id,
            expires: dayjs(session.startTime).add(1, 'month').toDate(),
          },
        ]);
        logSessionMetricEvent('Add Sharing Session To Interested');
      }
    },
    [pinnedSessions, setPinnedSessions, logSessionMetricEvent],
  );

  const isSessionPinned = useCallback(
    (session: Session) =>
      Boolean(pinnedSessions.find(ps => ps.id === session.id)),
    [pinnedSessions],
  );

  return {
    pinnedSessions,
    togglePinSession,
    isSessionPinned,
  };
};

export default usePinnedSessons;
