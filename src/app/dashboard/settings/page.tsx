import { ProfileSection } from "./_components/profile-section"
import { AvatarUpload } from "./_components/avatar-upload"
import { NotificationToggles } from "./_components/notification-toggles"
import { PriorityReorder } from "./_components/priority-reorder"
import { ThemeSelector } from "./_components/theme-selector"
import { DeleteAccountDialogs } from "./_components/delete-account-dialogs"
import { SaveButton } from "./_components/save-button"

export default function SettingsPage() {
  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        <SaveButton />
      </div>

      <div className="grid gap-6">
        <div className="grid sm:grid-cols-[1fr_auto] gap-6">
          <ProfileSection />
          <AvatarUpload />
        </div>
        <NotificationToggles />
        <ThemeSelector />
        <PriorityReorder />
        <div className="border-t pt-6">
          <h2 className="text-lg font-semibold text-destructive mb-2">Danger Zone</h2>
          <p className="text-sm text-muted-foreground mb-4">
            Permanently delete your account and all associated data.
          </p>
          <DeleteAccountDialogs />
        </div>
      </div>
    </div>
  )
}
