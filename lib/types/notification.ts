export interface Notification {
  notificationId: string;
  actorId: string;
  actorNickname: string;
  action:
    | 'POST_LIKED'
    | 'COMMENT_LIKED'
    | 'COMMENT_ADDED'
    | 'COMMENT_REPLY_ADDED';
  status?: 'unread';
  postId: string;
  commentPath: string | null;
  contentType: string;
  contentPreview: string;
  createdAt: string;
}

export interface GetNotificationRequestParams {
  status?: string;
  lastNotificationId?: string;
  size: number;
}

export interface GetNotificationResponseData {
  notifications: Notification[];
  nextNotificationId: string;
  hasNext: boolean;
  size: number;
}
