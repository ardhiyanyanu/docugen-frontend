"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@radix-ui/react-label";
import { useAuthenticator } from "@aws-amplify/ui-react";
import { useRouter } from "next/navigation";
import { getUserTeams } from "@/lib/auth";

export function PageClient() {
  const router = useRouter();
  const { user } = useAuthenticator((context: any) => [context.user]);
  const [teams, setTeams] = React.useState<string[]>([]);
  const [teamDisplayName, setTeamDisplayName] = React.useState("");
  const [selectedTeam, setSelectedTeam] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!user) {
      router.push('/auth/signin');
      return;
    }

    // Load teams from Cognito groups
    getUserTeams().then(setTeams);
  }, [user, router]);

  React.useEffect(() => {
    if (teams.length > 0 && !selectedTeam) {
      const saved = localStorage.getItem('selectedTeam');
      setSelectedTeam(saved && teams.includes(saved) ? saved : teams[0]);
    }
  }, [teams, selectedTeam]);

  React.useEffect(() => {
    if (selectedTeam) {
      localStorage.setItem('selectedTeam', selectedTeam);
      router.push(`/dashboard/${selectedTeam}`);
    }
  }, [selectedTeam, router]);

  const handleCreateTeam = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement team creation via API
    // This would call your backend to add user to a new Cognito group
    console.log('Create team:', teamDisplayName);
    alert('Team creation needs to be implemented via your backend API');
  };

  if (!user) {
    return null;
  }

  if (teams.length === 0) {
    return (
      <div className="flex items-center justify-center h-screen w-screen">
        <div className="max-w-xs w-full">
          <h1 className="text-center text-2xl font-semibold">Welcome!</h1>
          <p className="text-center text-gray-500">
            Create a team to get started
          </p>
          <form className="mt-4" onSubmit={handleCreateTeam}>
            <div>
              <Label className="text-sm">Team name</Label>
              <Input
                placeholder="Team name"
                value={teamDisplayName}
                onChange={(e) => setTeamDisplayName(e.target.value)}
              />
            </div>
            <Button className="mt-4 w-full">Create team</Button>
          </form>
        </div>
      </div>
    );
  }

  return null;
}
