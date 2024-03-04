import Image from "next/image";
import { notFound } from "next/navigation";
import type { PropsWithChildren } from "react";

import { api } from "~/trpc/server";
import { ConnectStripe } from "./_components/connect-stripe";
import { SignOutButton } from "../(auth)/_components/sign-out";
import { ProfileTabs } from "./_components/tabs";

export default async function ProfileLayout({ children }: PropsWithChildren) {
  const profile = await api.user.get.query();
  if (!profile) {
    return notFound();
  }

  return (
    <div className="md:flex">
      <div className="w-96">
        <h1 className="text-2xl font-bold">Profile</h1>
        <Image
          width={96}
          height={96}
          className="rounded-full"
          src={profile.imageUrl}
          alt={profile.firstName!}
        />
        <h3 className="text-lg font-semibold">{profile.firstName}</h3>
        <div>{profile.emailAddresses[0]?.emailAddress}</div>

        <ConnectStripe stripeAccount={profile.privateMetadata?.stripeAccount} />
        <SignOutButton />
      </div>

      <div className="flex-1">
        <ProfileTabs />
        {children}
      </div>
    </div>
  );
}
