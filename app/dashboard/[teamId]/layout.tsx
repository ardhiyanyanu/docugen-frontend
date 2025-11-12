'use client';

import SidebarLayout, { SidebarItem } from "@/components/sidebar-layout";
import { useAuthenticator } from "@aws-amplify/ui-react";
import { BadgePercent, BarChart4, Columns3, Globe, Locate, Settings2, ShoppingBag, ShoppingCart, Users } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import * as React from "react";
import { getUserTeams } from "@/lib/auth";

const navigationItems: SidebarItem[] = [
  {
    name: "Overview",
    href: "/",
    icon: Globe,
    type: "item",
  },
  {
    type: 'label',
    name: 'Management',
  },
  {
    name: "Products",
    href: "/products",
    icon: ShoppingBag,
    type: "item",
  },
  {
    name: "People",
    href: "/people",
    icon: Users,
    type: "item",
  },
  {
    name: "Segments",
    href: "/segments",
    icon: Columns3,
    type: "item",
  },
  {
    name: "Regions",
    href: "/regions",
    icon: Locate,
    type: "item",
  },
  {
    type: 'label',
    name: 'Monetization',
  },
  {
    name: "Revenue",
    href: "/revenue",
    icon: BarChart4,
    type: "item",
  },
  {
    name: "Orders",
    href: "/orders",
    icon: ShoppingCart,
    type: "item",
  },
  {
    name: "Discounts",
    href: "/discounts",
    icon: BadgePercent,
    type: "item",
  },
  {
    type: 'label',
    name: 'Settings',
  },
  {
    name: "Configuration",
    href: "/configuration",
    icon: Settings2,
    type: "item",
  },
];

export default function Layout(props: { children: React.ReactNode }) {
  const params = useParams<{ teamId: string }>();
  const { user } = useAuthenticator((context: any) => [context.user]);
  const [teams, setTeams] = React.useState<string[]>([]);
  const router = useRouter();

  React.useEffect(() => {
    if (!user) {
      router.push('/auth/signin');
      return;
    }
    getUserTeams().then(setTeams);
  }, [user, router]);

  const currentTeam = params.teamId;

  if (!user || teams.length === 0) {
    return null;
  }

  if (!teams.includes(currentTeam)) {
    router.push('/dashboard');
    return null;
  }

  const handleTeamChange = (teamId: string) => {
    router.push(`/dashboard/${teamId}`);
  };

  return (
    <SidebarLayout 
      items={navigationItems}
      basePath={`/dashboard/${currentTeam}`}
      sidebarTop={
        <div className="p-3">
          <select 
            value={currentTeam}
            onChange={(e) => handleTeamChange(e.target.value)}
            className="w-full px-3 py-2 border rounded-md bg-background"
          >
            {teams.map((team) => (
              <option key={team} value={team}>{team}</option>
            ))}
          </select>
        </div>
      }
      baseBreadcrumb={[{
        title: currentTeam,
        href: `/dashboard/${currentTeam}`,
      }]}
    >
      {props.children}
    </SidebarLayout>
  );
}