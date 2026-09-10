import { Comment } from '@/lib/types/comment';

/**
 * 플랫 배열로 받은 댓글을 계층 구조(트리)로 변환
 *
 * 이 함수 자체는 depth를 제한하지 않는다. 신규 답글의 2-depth 제한은
 * generateCommentPath에서 생성 시점에 강제되지만, 마이그레이션 전까지
 * API가 내려줄 수 있는 기존 3-depth 이상의 레거시 댓글도 깨지지 않고
 * 그대로 트리로 표시할 수 있어야 하므로 depth 제약 없이 범용으로 동작한다.
 * @param flatComments API에서 받은 플랫 배열 형태의 댓글 목록
 * @returns 트리 구조로 변환된 댓글 목록 (최상위 댓글만 포함)
 *
 * @example
 * // API 응답: [
 * //   { path: "1", content: "첫 댓글", ... },
 * //   { path: "1.1", content: "첫 댓글의 답글", ... },
 * //   { path: "1.1.1", content: "답글의 답글", ... },
 * //   { path: "2", content: "두 번째 댓글", ... }
 * // ]
 * //
 * // 결과: [
 * //   {
 * //     path: "1",
 * //     content: "첫 댓글",
 * //     depth: 0,
 * //     children: [
 * //       {
 * //         path: "1.1",
 * //         content: "첫 댓글의 답글",
 * //         depth: 1,
 * //         children: [
 * //           { path: "1.1.1", content: "답글의 답글", depth: 2, children: [] }
 * //         ]
 * //       }
 * //     ]
 * //   },
 * //   { path: "2", content: "두 번째 댓글", depth: 0, children: [] }
 * // ]
 */
export function buildCommentTree(flatComments: Comment[]): Comment[] {
  // 1단계: path를 키로 하는 맵 생성 + children/depth 초기화
  const commentMap = new Map<string, Comment>();
  const rootComments: Comment[] = [];

  flatComments.forEach((comment) => {
    commentMap.set(comment.path, {
      ...comment,
      children: [],
      depth: comment.path.split('.').length - 1,
    });
  });

  // 2단계: 부모-자식 관계 설정
  flatComments.forEach((comment) => {
    const pathSegments = comment.path.split('.');
    const currentComment = commentMap.get(comment.path)!;

    if (pathSegments.length === 1) {
      // 최상위 댓글 (depth: 0)
      rootComments.push(currentComment);
    } else {
      // 답글: 부모 찾아서 children에 추가
      const parentPath = pathSegments.slice(0, -1).join('.');
      const parentComment = commentMap.get(parentPath);

      if (parentComment) {
        parentComment.children!.push(currentComment);
      }
    }
  });

  return rootComments;
}

/**
 * 새 답글의 path 생성 (부모 path 기준)
 *
 * UI/데이터 depth를 2-depth까지로 제한하는 정책에 따라, 답글 대상(parentPath)이
 * 이미 2-depth 이상이면 그 아래로 depth를 늘리지 않고 최상위 댓글(root) 기준의
 * 새 2-depth 형제 path를 생성한다. 그대로 parentPath 뒤에 이어붙이면 3-depth
 * 이상이 되어 백엔드의 depth 제약 조건 위반으로 거부되기 때문.
 * @param parentPath 부모 댓글의 path (없으면 null = 최상위 댓글)
 * @param siblingCount 같은 depth의 형제 댓글 개수
 * @returns 새 댓글의 path
 *
 * @example
 * generateCommentPath(null, 0) // "1" (첫 번째 최상위 댓글)
 * generateCommentPath(null, 2) // "3" (세 번째 최상위 댓글)
 * generateCommentPath("1", 0) // "1.1" (1번 댓글의 첫 답글, 2-depth)
 * generateCommentPath("1.1", 2) // "1.3" (1.1번 댓글에 대한 답글이지만 3-depth로 내려가지 않고, root "1" 밑의 새 2-depth 형제로 생성)
 */
export function generateCommentPath(
  parentPath: string | null,
  siblingCount: number
): string {
  if (!parentPath) {
    // 최상위 댓글 (1부터 시작)
    return (siblingCount + 1).toString();
  }

  const parentDepth = parentPath.split('.').length;
  // 답글 대상이 이미 2-depth 이상이면, 그 댓글의 최상위 댓글(root) 기준으로 새 path를 만든다
  const basePath = parentDepth >= 2 ? getRootPath(parentPath) : parentPath;

  // 답글 (1부터 시작)
  return `${basePath}.${siblingCount + 1}`;
}

/**
 * 특정 path의 댓글이 속한 최상위 댓글의 path 반환
 * @param path 댓글 path
 * @returns 최상위 댓글 path
 *
 * @example
 * getRootPath("1") // "1"
 * getRootPath("1.1") // "1"
 * getRootPath("1.1.1") // "1"
 * getRootPath("3") // "3"
 */
export function getRootPath(path: string): string {
  return path.split('.')[0];
}

/**
 * 댓글 depth 계산 (UI 들여쓰기용)
 * @param path 댓글 path
 * @returns depth (0부터 시작)
 *
 * @example
 * getCommentDepth("1") // 0
 * getCommentDepth("1.1") // 1
 * getCommentDepth("1.1.1") // 2
 */
export function getCommentDepth(path: string): number {
  return path.split('.').length - 1;
}
