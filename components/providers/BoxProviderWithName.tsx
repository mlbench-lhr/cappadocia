"use client";

import Link from "next/link";

export const BoxProviderWithName = ({
  children,
  name,
  rightSideLink,
  rightSideLabel,
  className,
  noBorder = false,
  rightSideComponent,
  textClasses = " text-base font-semibold ",
}: {
  name?: string;
  rightSideLink?: string;
  rightSideLabel?: string;
  className?: string;
  textClasses?: string;
  children: React.ReactNode;
  noBorder?: Boolean;
  rightSideComponent?: React.ReactNode | React.ComponentType<any>;
}) => {
  const RightSideComponent = rightSideComponent;
  return (
    <div
      className={`${className} w-full flex flex-col justify-start items-start gap-2 ${
        !noBorder && "border-0 md:border"
      } rounded-2xl px-0 md:px-3.5 py-3`}
    >
      {(name || rightSideLink) && (
        <div className="flex justify-between w-full items-center">
          {name && <h1 className={`${textClasses} leading-tight`}>{name}</h1>}
          {rightSideLink && (
            <Link
              href={rightSideLink}
              className="text-xs font-medium leading-tight text-primary underline hover:no-underline"
            >
              <h1>{rightSideLabel}</h1>
            </Link>
          )}
          {RightSideComponent &&
            (typeof RightSideComponent === "function" ? (
              <RightSideComponent />
            ) : (
              RightSideComponent
            ))}
        </div>
      )}
      <div className="w-full">{children}</div>
    </div>
  );
};
