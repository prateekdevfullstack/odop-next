import Link from "next/link";
import "@/styles/action-button.css";

type CommonProps = {
  children: React.ReactNode;
  className?: string;
  variant?: "primary" | "neutral";
  fullWidth?: boolean;
};

type LinkProps = CommonProps & {
  href: string;
  external?: boolean;
  onClick?: never;
  type?: never;
};

type ButtonProps = CommonProps & {
  href?: never;
  external?: never;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
};

type ActionButtonProps = LinkProps | ButtonProps;

function buildClassName({
  className,
  variant = "neutral",
  fullWidth,
}: Pick<CommonProps, "className" | "variant" | "fullWidth">): string {
  return [
    "action-btn",
    `action-btn--${variant}`,
    fullWidth ? "action-btn--block" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");
}

export default function ActionButton(props: ActionButtonProps) {
  const { children, className, variant, fullWidth } = props;
  const cls = buildClassName({ className, variant, fullWidth });

  if ("href" in props && props.href) {
    const external = props.external;
    return (
      <Link
        href={props.href}
        className={cls}
        {...(external
          ? { target: "_blank", rel: "noopener noreferrer" }
          : {})}
      >
        {children}
      </Link>
    );
  }

  return (
    <button
      type={props.type ?? "button"}
      className={cls}
      onClick={props.onClick}
    >
      {children}
    </button>
  );
}
