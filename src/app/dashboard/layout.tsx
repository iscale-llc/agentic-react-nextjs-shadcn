import Link from "next/link"
import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { LayoutDashboard, Users, LogOut, BarChart3, Settings, Activity, Table2 } from "lucide-react"
import { signOut } from "@/lib/auth"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()
  if (!session?.user) redirect("/login")

  return (
    <div className="flex min-h-screen">
      <aside className="w-64 border-r bg-sidebar" aria-label="Sidebar">
        <div className="flex h-14 items-center px-4 font-semibold">
          Agentic Dashboard
        </div>
        <Separator />
        <nav aria-label="Main navigation" className="p-4 space-y-1">
          <Link
            href="/dashboard"
            className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent transition-colors"
          >
            <LayoutDashboard className="h-4 w-4" />
            Dashboard
          </Link>
          <Link
            href="/dashboard/users"
            className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent transition-colors"
          >
            <Users className="h-4 w-4" />
            Users
          </Link>
          <Link
            href="/dashboard/analytics"
            className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent transition-colors"
          >
            <BarChart3 className="h-4 w-4" />
            Analytics
          </Link>
          <Link
            href="/dashboard/settings"
            className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent transition-colors"
          >
            <Settings className="h-4 w-4" />
            Settings
          </Link>
          <Link
            href="/dashboard/sheets"
            className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent transition-colors"
          >
            <Table2 className="h-4 w-4" />
            Sheets
          </Link>
          <Link
            href="/dashboard/activity"
            className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent transition-colors"
          >
            <Activity className="h-4 w-4" />
            Activity Log
          </Link>
        </nav>
        <div className="mt-auto p-4">
          <form
            action={async () => {
              "use server"
              await signOut({ redirectTo: "/login" })
            }}
          >
            <Button variant="ghost" size="sm" className="w-full justify-start gap-3" type="submit">
              <LogOut className="h-4 w-4" />
              Sign out
            </Button>
          </form>
        </div>
      </aside>
      <div className="flex-1 flex flex-col">
        <header className="flex h-14 items-center border-b px-6" role="banner">
          <p className="text-sm text-muted-foreground">
            {session.user.name} ({session.user.email})
          </p>
        </header>
        <main className="flex-1 p-6" role="main">
          {children}
        </main>
      </div>
    </div>
  )
}
