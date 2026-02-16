import { Image, View } from "reshaped";
import { getTmdbImageUrl, TMDB_IMAGE_SIZES } from "~/constants/tmdb";
import { TvIcon } from "./icons";

type PosterImageProps = {
  posterPath: string | null;
  alt: string;
  size?: keyof typeof TMDB_IMAGE_SIZES;
  height?: string;
  width?: string;
  className?: string;
};

export function PosterImage({
  alt,
  posterPath,
  size = "w185",
  width = "100%",
  height = "200px",
  className = "poster-container",
}: PosterImageProps) {
  const imageUrl = getTmdbImageUrl(posterPath, size);

  return (
    <View className={className} height={height} width={width}>
      {imageUrl ? (
        <Image src={imageUrl} alt={alt} />
      ) : (
        <View
          height="100%"
          align="center"
          justify="center"
          backgroundColor="neutral-faded"
        >
          <TvIcon />
        </View>
      )}
    </View>
  );
}
