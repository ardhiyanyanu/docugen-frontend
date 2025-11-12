'use client';

import { useAuthenticator } from "@aws-amplify/ui-react";
import { useTheme } from "next-themes";
import { Logo } from "./logo";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Button } from "./ui/button";
import { signOut } from "@/lib/auth";
import { Moon, Sun, LogOut } from "lucide-react";

export default function HandlerHeader() {
  const { user } = useAuthenticator((context: any) => [context.user]);
  const { theme, setTheme } = useTheme();

  const handleSignOut = async () => {
    await signOut();
    window.location.href = '/';
  };

  const getInitials = (email?: string) => {
    if (!email) return 'U';
    return email.charAt(0).toUpperCase();
  };

  return (
    <>
      <header className="fixed w-full z-50 p-4 h-14 flex items-center py-4 border-b justify-between bg-background">
        <Logo link={user ? "/dashboard" : "/"}/>

        <div className="flex items-center justify-end gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          >
            {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>
          
          {user && (
            <>
              <Avatar>
                <AvatarFallback>{getInitials(user.signInDetails?.loginId)}</AvatarFallback>
              </Avatar>
              <Button variant="ghost" size="icon" onClick={handleSignOut}>
                <LogOut className="h-5 w-5" />
              </Button>
            </>
          )}
        </div>
      </header>
      <div className="min-h-14"/> {/* Placeholder for fixed header */}
    </>
  );
}