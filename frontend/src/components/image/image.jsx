import { Image } from "@imagekit/react";

export default function ImageComponent({path, alt, className, w, h}) {
  return (
    <Image
      urlEndpoint={import.meta.env.VITE_URL_IK_ENDPOINT}
      src={path}
      transformation={[{ height:h, width: w }]}
      alt={alt}
      className={className}
      loading="lazy"
      lqip={{ active: true, quality: 20 }}
    />
  );
}
