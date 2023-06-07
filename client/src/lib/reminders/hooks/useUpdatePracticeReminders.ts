import {useCallback} from 'react';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

import {NOTIFICATION_CHANNELS} from '../../notifications/constants';
import usePinnedCollections from '../../user/hooks/usePinnedCollections';
import useGetCollectionById from '../../content/hooks/useGetCollectionById';
import useUserEvents from '../../user/hooks/useUserEvents';
import useTriggerNotifications from '../../notifications/hooks/useTriggerNotifications';
import {calculateNextReminderTime} from '../utils/dates';
import {useTranslation} from 'react-i18next';
import {Collection} from '../../../../../shared/src/types/generated/Collection';
import useUserState, {
  PracticeReminderConfig,
  getCurrentUserStateSelector,
} from '../../user/state/state';
import {
  DEFAULT_NUMBER_OF_PRACTICE_REMINDERS,
  REMINDER_INTERVALS,
} from '../constants';
import useUser from '../../user/hooks/useUser';

dayjs.extend(utc);

const ID_PREFIX = 'practice';

const useUpdatePracticeReminders = () => {
  const {t} = useTranslation('Notification.PracticeReminder');
  const user = useUser();
  const {pinnedCollections} = usePinnedCollections();
  const {completedCollectionEvents} = useUserEvents();
  const getCollectionById = useGetCollectionById();
  const {removeTriggerNotifications, setTriggerNotification} =
    useTriggerNotifications();

  const resolveBody = useCallback(
    (collection: Collection | null, index: number) => {
      if (!user || user?.isAnonymous) {
        return collection
          ? t(`reminders.collection.${index}.bodyAnonymous`, {
              collectionName: collection.name,
            })
          : t(`reminders.general.${index}.bodyAnonymous`);
      }
      return collection
        ? t(`reminders.collection.${index}.body`, {
            collectionName: collection.name,
            userName: user.displayName,
          })
        : t(`reminders.general.${index}.body`, {userName: user.displayName});
    },
    [t, user],
  );

  const reCreateNotifications = useCallback(
    async (
      collection: Collection | null,
      config?: PracticeReminderConfig | null,
    ) => {
      await removeTriggerNotifications(
        NOTIFICATION_CHANNELS.PRACTICE_REMINDERS,
      );
      if (config) {
        const nextReminderTime = calculateNextReminderTime(
          dayjs().utc(),
          config,
        );
        for (
          let index = 0;
          index < DEFAULT_NUMBER_OF_PRACTICE_REMINDERS;
          index++
        ) {
          await setTriggerNotification(
            `${ID_PREFIX}-${index}`,
            NOTIFICATION_CHANNELS.PRACTICE_REMINDERS,
            collection
              ? t(`reminders.collection.${index}.title`, {
                  collectionName: collection.name,
                })
              : t(`reminders.general.${index}.title`),
            resolveBody(collection, index),
            collection?.link,
            undefined,
            nextReminderTime
              .add(
                index,
                config.interval === REMINDER_INTERVALS.DAILY ? 'day' : 'week',
              )
              .valueOf(),
          );
        }
      }
    },
    [t, removeTriggerNotifications, setTriggerNotification, resolveBody],
  );

  const updatePracticeNotifications = useCallback(
    async (config?: PracticeReminderConfig | null) => {
      const pinnedCollection = pinnedCollections
        .sort(
          (a, b) =>
            new Date(a.startedAt).getTime() - new Date(b.startedAt).getTime(),
        )
        .find(
          c =>
            !completedCollectionEvents.find(
              cc =>
                cc.payload.id === c.id &&
                dayjs(c.startedAt).isBefore(cc.timestamp),
            ),
        );

      const collection = pinnedCollection
        ? getCollectionById(pinnedCollection.id)
        : null;

      const practiceReminderConfig = getCurrentUserStateSelector(
        useUserState.getState(),
      )?.practiceReminderConfig;

      await reCreateNotifications(collection, config ?? practiceReminderConfig);
    },
    [
      completedCollectionEvents,
      pinnedCollections,
      getCollectionById,
      reCreateNotifications,
    ],
  );

  return {
    updatePracticeNotifications,
  };
};

export default useUpdatePracticeReminders;
