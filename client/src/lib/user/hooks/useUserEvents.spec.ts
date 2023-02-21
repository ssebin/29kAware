import {FirebaseAuthTypes} from '@react-native-firebase/auth';
import {renderHook} from '@testing-library/react-hooks';
import {
  FeedbackPayload,
  PostPayload,
} from '../../../../../shared/src/types/Event';
import useUserState from '../state/state';
import useUserEvents from './useUserEvents';

describe('useUserEvents', () => {
  it('should return current events', () => {
    useUserState.setState({
      user: {uid: 'user-id'} as FirebaseAuthTypes.User,
      userState: {
        'user-id': {
          userEvents: [
            {
              type: 'post',
              payload: {sessionId: 'some-session-id'} as PostPayload,
              timestamp: new Date(),
            },
            {
              type: 'feedback',
              payload: {comment: 'some text'} as FeedbackPayload,
              timestamp: new Date(),
            },
          ],
        },
      },
    });

    const {result} = renderHook(() => useUserEvents());

    expect(result.current.postEvents).toEqual([
      {
        type: 'post',
        payload: {sessionId: 'some-session-id'},
        timestamp: expect.any(Date),
      },
    ]);
    expect(result.current.feedbackEvents).toEqual([
      {
        type: 'feedback',
        payload: {comment: 'some text'},
        timestamp: expect.any(Date),
      },
    ]);
  });

  it('should memoize the result', () => {
    useUserState.setState({
      user: {uid: 'user-id'} as FirebaseAuthTypes.User,
      userState: {
        'user-id': {
          userEvents: [
            {
              type: 'post',
              payload: {sessionId: 'some-session-id'} as PostPayload,
              timestamp: new Date(),
            },
            {
              type: 'feedback',
              payload: {comment: 'some text'} as FeedbackPayload,
              timestamp: new Date(),
            },
          ],
        },
      },
    });

    const {result, rerender} = renderHook(() => useUserEvents());

    const postEvents = result.current.postEvents;
    const feedbackEvents = result.current.feedbackEvents;

    rerender();

    // Check that they are the same reference
    expect(result.current.postEvents).toBe(postEvents);
    expect(result.current.feedbackEvents).toBe(feedbackEvents);
  });
});