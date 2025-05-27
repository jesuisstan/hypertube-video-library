'use client';

import { useEffect, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';

import { CircleDashed, PencilLine, RefreshCw, Trash2 } from 'lucide-react';

import AvatarMini from '@/components/avatar/avatar-mini';
import DialogBasic from '@/components/dialogs-custom/dialog-basic';
import { ButtonCustom } from '@/components/ui/buttons/button-custom';
import Spinner from '@/components/ui/spinner';
import TextWithLineBreaks from '@/components/ui/text-with-line-breaks';
import { Link } from '@/i18n/routing';
import useUserStore from '@/stores/user';
import { TMovieBasics } from '@/types/movies';

const MAX_CHARS = 442; // Maximum characters allowed for a comment

const MovieComments = ({ movieData }: { movieData: TMovieBasics | null }) => {
  const t = useTranslations();
  const locale = useLocale() as 'en' | 'ru' | 'fr';
  const user = useUserStore((state) => state.user);
  const [loading, setLoading] = useState(false);
  const [comments, setComments] = useState<any[]>([]);
  const [newComment, setNewComment] = useState('');
  const [adding, setAdding] = useState(false);
  const [modifying, setModifying] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editComment, setEditComment] = useState<any>(null);
  const [editContent, setEditContent] = useState('');

  // Get comments for the movie via GET /movies/:id/comments API
  const fetchComments = async (silently: boolean = false) => {
    if (!movieData?.id) return;
    if (!silently) setLoading(true);
    try {
      const res = await fetch(`/api/movies/${movieData.id}/comments`);
      const data = await res.json();
      setComments(data.comments || []);
    } catch (e) {
      setComments([]);
    } finally {
      if (!silently) setLoading(false);
    }
  };

  // Add a new comment to the movie via POST /movies/:id/comments API
  const handleAddComment = async () => {
    if (!movieData?.id || !user?.id || !newComment.trim()) return;
    setAdding(true);
    try {
      const params = new URLSearchParams({
        user_id: user.id,
        comment_content: newComment,
      });
      const res = await fetch(`/api/movies/${movieData.id}/comments?${params.toString()}`, {
        method: 'POST',
      });
      if (res.ok) {
        setNewComment('');
        fetchComments(true);
      }
    } finally {
      setAdding(false);
    }
  };

  // Open dialog for editing
  const openEditDialog = (comment: any) => {
    setEditComment(comment);
    setEditContent(comment.content);
    setEditDialogOpen(true);
  };

  // Save edited comment
  const handleEditSave = async () => {
    if (!movieData?.id || !user?.id || !editComment) return;
    if (editContent.trim() === editComment.content || !editContent.trim()) {
      setEditDialogOpen(false);
      return;
    }
    setModifying(true);
    try {
      const params = new URLSearchParams({
        movie_id: String(movieData.id),
        user_id: user.id,
        comment_content: editContent.trim(),
      });
      const res = await fetch(`/api/comments/${editComment.id}?${params.toString()}`, {
        method: 'PATCH',
      });
      if (res.ok) {
        fetchComments(true);
        setEditDialogOpen(false);
      }
    } finally {
      setModifying(false);
    }
  };

  const deleteComment = async (comment: any) => {
    if (!movieData?.id || !user?.id) return;
    if (comment.user_id !== user.id) return;

    setDeleting(true);
    try {
      const params = new URLSearchParams({
        movie_id: String(movieData.id),
        user_id: user.id,
      });
      const res = await fetch(`/api/comments/${comment.id}?${params.toString()}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        fetchComments(true);
      }
    } finally {
      setDeleting(false);
    }
  };

  // ALTERNATIVE: Get comments by movie ID via GET /api/comments?movie_id= API
  const fetchCommentsByMovieId = async (movieId: string) => {
    try {
      setAdding(true);
      const res = await fetch(`/api/comments?movie_id=${movieId}`);
      const data = await res.json();
      return data.comments || [];
    } catch (e) {
      return [];
    } finally {
      setAdding(false);
    }
  };

  // ALTERNATIVE: Add a new comment by movie ID via POST /api/comments?movie_id= API
  const handleAddCommentByMovieId = async ({
    movieId,
    userId,
    commentContent,
  }: {
    movieId: string;
    userId: string;
    commentContent: string;
  }) => {
    const params = new URLSearchParams({
      movie_id: movieId,
      user_id: userId,
      comment_content: commentContent,
    });
    try {
      const res = await fetch(`/api/comments?${params.toString()}`, {
        method: 'POST',
      });
      return await res.json();
    } catch (e) {
      return { error: 'network-error' };
    }
  };

  useEffect(() => {
    fetchComments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [movieData?.id]);

  return !movieData ? null : (
    <div className="mx-auto w-full max-w-screen-2xl px-4">
      <div className="bg-card shadow-primary/20 w-full rounded-md border p-4 shadow-xs">
        <div className="mb-4 flex items-center gap-2 align-middle">
          <h3 className="text-xl font-semibold">{t('comments')}</h3>
          <ButtonCustom
            id="refresh-comments"
            variant="ghost"
            size="icon"
            title={t('refresh')}
            onClick={() => fetchComments()}
            disabled={loading}
            className="smooth42transition hover:text-c42orange hover:bg-transparent"
          >
            {loading ? (
              <CircleDashed className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4" />
            )}
          </ButtonCustom>
          {/* Alternative refresh button using fetchCommentsByMovieId */}
          {/*<ButtonCustom
            id="refresh-comments"
            variant="ghost"
            size="icon"
            title={t('refresh')}
            onClick={() => {
              fetchCommentsByMovieId(String(movieData.id)).then(setComments);
            }}
            disabled={loading}
            className="smooth42transition hover:text-c42orange hover:bg-transparent"
          >
            <RefreshCw className={loading ? 'h-5 w-5 animate-spin' : 'h-5 w-5'} />
          </ButtonCustom>*/}
        </div>

        {/* Add comment input */}
        {user && (
          <div className="mb-4">
            <div className="flex flex-wrap items-center justify-center gap-2">
              <textarea
                value={newComment}
                onChange={(e) => {
                  if (e.target.value.length <= MAX_CHARS) setNewComment(e.target.value);
                }}
                placeholder={t('add-comment') || 'Add a comment...'}
                className="max-h-40 min-h-16 min-w-32 flex-1 resize-y rounded border px-3 py-2 text-sm"
                disabled={adding || loading}
                maxLength={MAX_CHARS}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey && !adding && newComment.trim()) {
                    e.preventDefault();
                    handleAddComment();
                  }
                }}
              />
              <ButtonCustom
                variant="default"
                size="lg"
                title={t('add-comment')}
                onClick={handleAddComment}
                disabled={adding || !newComment.trim()}
                loading={adding}
                className="w-36 py-6"
              >
                <span>{t('add-comment')}</span>
              </ButtonCustom>
            </div>
            <p className="text-muted-foreground xs:mt-0 xs:text-left mx-2 mt-2 text-center text-[10px]">
              {t('max')} {MAX_CHARS} {t('characters')}. {t('left')}: {MAX_CHARS - newComment.length}
            </p>
            {/* Alternative button using handleAddCommentByMovieId */}
            {/*<ButtonCustom
              variant="default"
              size="icon"
              title={t('add-comment')}
              onClick={() => {
                if (movieData?.id && user?.id && newComment.trim()) {
                  handleAddCommentByMovieId({
                    movieId: String(movieData.id),
                    userId: user.id,
                    commentContent: newComment,
                  }).then((res) => {
                    if (!res.error) {
                      setNewComment('');
                      fetchCommentsByMovieId(String(movieData.id)).then(setComments);
                    }
                  });
                }
              }}
              disabled={adding || !newComment.trim()}
              loading={adding}
            >
              <Plus className="h-4 w-4" />
            </ButtonCustom>*/}
          </div>
        )}

        {loading ? (
          <div className="flex h-20 items-center justify-center">
            <Spinner size={24} />
          </div>
        ) : comments.length === 0 ? (
          <p className="text-muted-foreground mt-4 text-center text-sm">
            {t('no-comments-available')}
          </p>
        ) : (
          <div className="max-h-96 overflow-y-auto pr-2">
            <ul className="space-y-2">
              {comments.map((c, idx) => (
                <li
                  key={idx}
                  className="bg-muted animate-fade-in overflow-x-auto rounded px-2 py-2 text-sm"
                >
                  <div className="mb-2 flex items-center justify-between gap-2">
                    <Link
                      href={{ pathname: `/users/${c.user_id}` }}
                      locale={locale}
                      className="group flex cursor-pointer items-center gap-2"
                      title={c.nickname}
                    >
                      <AvatarMini
                        src={
                          Array.isArray(c?.photos) && c?.photos.length > 0 ? c.photos[0] : undefined
                        }
                        nickname={c.nickname ?? ''}
                        rounded
                        width={6}
                        height={6}
                      />
                      <div className="font-semibold">{c.nickname}</div>
                    </Link>
                    <div className="text-muted-foreground text-xs">
                      {new Date(c.created_at).toLocaleString(locale)}
                    </div>
                  </div>
                  <div className="mb-2 flex items-center justify-between gap-2">
                    <TextWithLineBreaks text={c.content} />
                    {c.user_id === user?.id ? (
                      <div className="smooth42transition xs:gap-4 flex items-center gap-2">
                        <ButtonCustom
                          id="modify-comment"
                          variant="ghost"
                          size="icon"
                          title={t('modify')}
                          onClick={() => openEditDialog(c)}
                          disabled={modifying || loading}
                          className="smooth42transition hover:text-c42orange max-h-4 max-w-4 hover:bg-transparent"
                        >
                          {modifying && editComment?.id === c.id ? (
                            <CircleDashed className="h-4 w-4 animate-spin" />
                          ) : (
                            <PencilLine className="h-4 w-4" />
                          )}
                        </ButtonCustom>
                        <ButtonCustom
                          id="delete-comment"
                          variant="ghost"
                          size="icon"
                          title={t('delete')}
                          onClick={() => deleteComment(c)}
                          disabled={deleting || loading}
                          className="smooth42transition hover:text-c42orange max-h-4 max-w-4 hover:bg-transparent"
                        >
                          {deleting ? (
                            <CircleDashed className="h-4 w-4 animate-spin" />
                          ) : (
                            <Trash2 className="h-4 w-4" />
                          )}
                        </ButtonCustom>
                      </div>
                    ) : null}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      {/* Edit comment dialog */}
      <DialogBasic
        isOpen={editDialogOpen}
        setIsOpen={setEditDialogOpen}
        title={t('modify') || 'Edit comment'}
      >
        <div className="flex flex-col">
          <textarea
            value={editContent}
            onChange={(e) => {
              if (e.target.value.length <= MAX_CHARS) setEditContent(e.target.value);
            }}
            className="xs:min-w-xl max-h-96 min-h-40 max-w-3xl resize-y rounded border px-3 py-2 text-sm"
            maxLength={MAX_CHARS}
            disabled={modifying}
          />
          <span className="text-muted-foreground mx-2 text-[10px]">
            {t('max')} {MAX_CHARS} {t('characters')}. {t('left')}: {MAX_CHARS - editContent.length}
          </span>
        </div>
        <ButtonCustom
          variant="default"
          size="lg"
          onClick={handleEditSave}
          disabled={modifying || !editContent.trim() || editContent.trim() === editComment?.content}
          loading={modifying}
        >
          {t('save')}
        </ButtonCustom>
      </DialogBasic>
    </div>
  );
};

export default MovieComments;
