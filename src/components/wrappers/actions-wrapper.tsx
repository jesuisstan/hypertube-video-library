import { Dispatch, SetStateAction, useState } from 'react';
import { useTranslations } from 'next-intl';

import clsx from 'clsx';
import {
  CirclePower,
  CircleX,
  Heart,
  HeartOff,
  MessageCircleMore,
  ShieldAlert,
} from 'lucide-react';

import ActionsSkeleton from '@/components/ui/skeletons/actions-skeleton';
import MatchWrapper from '@/components/wrappers/match-wrapper';
import { useRouter } from '@/i18n/routing';
import useSearchStore from '@/stores/search';
import useUserStore from '@/stores/user';
import { TDateProfile } from '@/types/date-profile';

const ActionsWrapper = ({
  dateProfile,
  setDateProfile,
  isMatch,
  isLiked,
  isLikedBy,
  isBlocked,
}: {
  dateProfile: TDateProfile;
  setDateProfile: Dispatch<SetStateAction<TDateProfile | null>>;
  isMatch: boolean;
  isLiked: boolean;
  isLikedBy: boolean;
  isBlocked: boolean;
}) => {
  const t = useTranslations();
  const router = useRouter();
  const { user, setUser } = useUserStore((state) => ({
    user: state.user,
    setUser: state.setUser,
  }));
  const { updateSuggestion } = useSearchStore();
  const [loading, setLoading] = useState(false);

  const handleLikeClick = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/interactions/like', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          likerId: user?.id,
          likedUserId: dateProfile.id,
          likeAction: isLiked ? 'unlike' : 'like',
        }),
      });

      const result = await response.json();
      if (response.ok) {
        setUser({ ...user, ...result.user });
        updateSuggestion(result.likedUser);
        setDateProfile({ ...dateProfile, ...result.likedUser });
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleBlockClick = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/interactions/block', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          blockerId: user?.id,
          blockedUserId: dateProfile.id,
          blockAction: isBlocked ? 'unblock' : 'block',
        }),
      });

      const result = await response.json();
      if (response.ok) {
        setUser({ ...user, ...result.user });
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleReportClick = async () => {
    if (!isBlocked) {
      setLoading(true);
      try {
        const response = await fetch('/api/interactions/block', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            blockerId: user?.id,
            blockedUserId: dateProfile.id,
            blockAction: 'block',
          }),
        });

        const result = await response.json();
        if (response.ok) {
          setUser({ ...user, ...result.user });
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    // Open mail client with prefilled email, subject, and body
    const supportEmail = process.env.NEXT_PUBLIC_SUPPORT_EMAIL;
    const subject = `Report user ${dateProfile.nickname} as fake account`;
    const body = `Hello,

I would like to report the user ${dateProfile.nickname} (ID: ${dateProfile.id}) as a fake account. 

I suspect that this account violates the platform's guidelines, and I believe further investigation is needed.

REPORTER'S DETAILS:
${user?.firstname} ${user?.lastname} (${user?.nickname} / ID: ${user?.id})`;

    const mailtoLink = `mailto:${supportEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    // Open the mail client
    window.location.href = mailtoLink;
  };

  return loading ? (
    <ActionsSkeleton />
  ) : (
    <div className={clsx('flex max-w-fit flex-row self-center rounded-2xl bg-card shadow-md')}>
      {/* MATCH ? */}
      <MatchWrapper
        isMatch={isMatch}
        isBlocked={isBlocked}
        isLiked={isLiked}
        isLikedBy={isLikedBy}
      />
      {/* vertical divider */}
      <div className={clsx('my-3 block w-[1px] bg-secondary opacity-40')} />
      {/* ACTIONS */}
      <div
        className={clsx(
          'relative grid min-h-16 grid-flow-col grid-rows-1 items-center justify-center gap-x-6 overflow-x-auto rounded-2xl bg-card px-6 pb-2 pt-2',
          'lg:min-h-[104px] lg:max-w-fit lg:grid-rows-2 lg:overflow-visible'
        )}
      >
        <button
          id="like-button"
          className="group relative z-40 flex cursor-pointer flex-col items-center justify-center gap-2 align-middle disabled:cursor-default disabled:opacity-50"
          onClick={handleLikeClick}
          disabled={isBlocked}
        >
          {!isLiked ? (
            <>
              <Heart size={25} className={clsx(isBlocked ? '' : 'text-c42green')} />
              <div className="absolute -bottom-3 hidden w-fit max-w-20 transform truncate text-nowrap rounded-2xl border bg-foreground/90 px-2 py-1 text-xs text-background group-hover:block">
                {t('like')}
              </div>
            </>
          ) : (
            <>
              <HeartOff size={25} className="text-destructive" />
              <div className="absolute -bottom-3 hidden w-fit max-w-20 transform truncate text-nowrap rounded-2xl border bg-foreground/90 px-2 py-1 text-xs text-background group-hover:block">
                {t('unlike')}
              </div>
            </>
          )}
        </button>

        <button
          id="chat-button"
          className="group relative z-40 flex cursor-pointer flex-col items-center justify-center gap-2 align-middle disabled:cursor-default disabled:opacity-50"
          onClick={() => console.log('Chat')}
          disabled={!isMatch || isBlocked}
        >
          <MessageCircleMore size={25} />
          <div className="absolute -bottom-3 hidden w-fit max-w-20 transform truncate text-nowrap rounded-2xl border bg-foreground/90 px-2 py-1 text-xs text-background group-hover:block">
            {t('chat')}
          </div>
        </button>

        <button
          id="block-button"
          className="group relative z-40 flex cursor-pointer flex-col items-center justify-center gap-2 align-middle disabled:cursor-default disabled:opacity-50"
          onClick={handleBlockClick}
        >
          {!isBlocked ? (
            <>
              <CircleX size={25} className="text-destructive" />
              <div className="absolute -bottom-3 hidden w-fit max-w-20 transform truncate text-nowrap rounded-2xl border bg-foreground/90 px-2 py-1 text-xs text-background group-hover:block">
                {t('block')}
              </div>
            </>
          ) : (
            <>
              <CirclePower size={25} className="text-c42green" />
              <div className="absolute -bottom-3 hidden w-fit max-w-20 transform truncate text-nowrap rounded-2xl border bg-foreground/90 px-2 py-1 text-xs text-background group-hover:block">
                {t('unblock')}
              </div>
            </>
          )}
        </button>

        <button
          id="report-button"
          className="group relative z-40 flex cursor-pointer flex-col items-center justify-center gap-2 align-middle"
          onClick={handleReportClick}
        >
          <ShieldAlert size={25} className="text-destructive" />
          <div className="absolute -bottom-3 hidden w-fit max-w-20 transform truncate text-nowrap rounded-2xl border bg-foreground/90 px-2 py-1 text-xs text-background group-hover:block">
            {t('report')}
          </div>
        </button>
      </div>
    </div>
  );
};

export default ActionsWrapper;
