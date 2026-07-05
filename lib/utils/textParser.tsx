/**
 * URL을 감지하고 링크로 변환하는 함수
 * - 텍스트 내 URL을 자동으로 감지하여 JSX 링크 요소로 변환
 */
export function parseTextWithLinks(text: string) {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const parts = text.split(urlRegex);

  return parts.map((part, index) => {
    if (part.match(urlRegex)) {
      try {
        const url = new URL(part);
        const displayText = url.hostname.replace(/^www\./, '');

        return (
          <a
            key={index}
            href={part}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary-50 hover:text-primary-40 break-all underline decoration-1 underline-offset-2 transition-colors"
          >
            {displayText}
          </a>
        );
      } catch {
        return part;
      }
    }
    return part;
  });
}
