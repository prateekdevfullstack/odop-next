type CapsuleHeadingProps = {
  children: React.ReactNode;
  as?: "h1" | "h2" | "h3" | "h4";
  className?: string;
  reveal?: boolean;
  textClassName?: string;
};

export default function CapsuleHeading({
  children,
  as: Tag = "h2",
  className,
  reveal = false,
  textClassName,
}: CapsuleHeadingProps) {
  return (
    <div className={`capsule-heading-pill${reveal ? " reveal" : ""}${className ? ` ${className}` : ""}`}>
      <Tag className={`capsule-heading-text${textClassName ? ` ${textClassName}` : ""}`}>
        {children}
      </Tag>
    </div>
  );
}
