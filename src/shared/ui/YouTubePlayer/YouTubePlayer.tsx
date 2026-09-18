interface YouTubePlayerProps {
  videoId: string | null | undefined;
  autoplay?: boolean;
  className?: string;
}

export const YouTubePlayer = ({
  videoId,
  autoplay = false,
  className = '',
}: YouTubePlayerProps) => {
  if (!videoId) return null;

  const autoplayParam = autoplay ? '1' : '0';

  return (
    <div
      className={`relative aspect-video w-full overflow-hidden rounded-lg border border-zinc-800 bg-black shadow-lg ${className}`}
    >
      <iframe
        className="absolute top-0 left-0 h-full w-full"
        src={`https://www.youtube.com/embed/${videoId}?autoplay=${autoplayParam}`}
        title="YouTube video player"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        referrerPolicy="strict-origin-when-cross-origin"
        allowFullScreen
      ></iframe>
    </div>
  );
};
