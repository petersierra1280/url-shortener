import { UrlItem } from "../services/url.service";

interface Props {
  url: UrlItem;
  onCopy: (shortUrl: string) => void;
}

export default function URLCard({ url, onCopy }: Props) {
  const shortUrl = `${window.location.origin}/r/${url.slug}`;
  return (
    <div>
      <p>
        <strong>Slug:</strong> {url.slug}
      </p>
      <p>
        <strong>Original:</strong> {url.originalUrl}
      </p>
      <p>
        <strong>Visits:</strong> {url.visitCount}
      </p>
      <button onClick={() => onCopy(shortUrl)}>Copy</button>
    </div>
  );
}
