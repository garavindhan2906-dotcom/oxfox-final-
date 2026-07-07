import FullBleedSlide from './FullBleedSlide';

export default function PageHero({
  eyebrow,
  heading,
  subheading,
  imageSrc,
}: {
  eyebrow?: string;
  heading: string;
  subheading?: string;
  imageSrc?: string | null;
}) {
  return (
    <FullBleedSlide
      imageSrc={imageSrc}
      imageAlt={heading}
      eyebrow={eyebrow}
      heading={heading}
      subheading={subheading}
      height="half"
      align="center"
      priority
    />
  );
}
