import { initials } from "../getInitials";
import { AvatarProps } from "../types";

export default function Avatar({ name, src, size = 36 }: AvatarProps) {
    const style = { width: size, height: size };

    if (src) {
        // eslint-disable-next-line @next/next/no-img-element
        return (
            <img
                src={src}
                alt=""
                style={style}
                className="shrink-0 rounded-full object-cover"
            />
        );
    }

    // Placeholder: initials on a brand-colored circle
    return (
        <span
            aria-hidden="true"
            style={style}
            className="inline-flex shrink-0 items-center justify-center rounded-full bg-brand text-onbrand text-sm font-semibold"
        >
      {initials(name)}
    </span>
    );
}