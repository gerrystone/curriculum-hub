import { HeaderProps } from "../types";
import Avatar from "./AvatarComponent";



export default function Header({ user, title }: HeaderProps) {
  return (
    <header className="flex h-16 shrink-0 items-center justify-between gap-4 border-b border-line bg-field px-4 sm:px-6">
      <div className="flex min-w-0 items-center gap-3">
        {title && <h1 className="truncate font-display text-lg font-semibold tracking-tight">{title}</h1>}
      </div>

      <div className="flex shrink-0 items-center gap-3">
        <div className="hidden text-right sm:block">
          <p className="text-sm font-medium leading-tight">{user.name}</p>
          <p className="text-xs text-mute leading-tight">{user.role}</p>
        </div>
        <Avatar name={user.name} src={user.avatarUrl} />
      </div>
    </header>
  );
}