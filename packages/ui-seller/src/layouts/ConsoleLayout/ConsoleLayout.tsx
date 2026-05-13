import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  Kbd,
  SidebarInset,
  SidebarMenuRenderer,
  SidebarProvider,
  SidebarShell,
  SidebarTrigger,
} from '@ecom/core-ui'
import { Bell, LogOutIcon, MessageCircle, SearchIcon, SettingsIcon, UserIcon } from 'lucide-react'
import { sidebarGroups } from './ConsoleLayout.fixtures'

export const ConsoleLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <SidebarProvider defaultOpen>
      <div className="bg-background flex min-h-svh w-full">
        <SidebarShell
          header={
            <div className="flex items-center gap-2 px-3 py-2 text-sm font-semibold">
              <span className="bg-primary flex size-7 items-center justify-center rounded-md text-white">
                K
              </span>
              Kavi.
            </div>
          }
        >
          <SidebarMenuRenderer groups={sidebarGroups} />
        </SidebarShell>

        <SidebarInset className="bg-background">
          <div className="flex min-h-svh flex-col">
            <header className="flex flex-col gap-4 border-b px-4 py-4 md:flex-row md:items-center md:justify-between">
              <div className="flex w-full items-center gap-3 md:max-w-xl">
                <SidebarTrigger />
                <InputGroup>
                  <InputGroupInput placeholder="Search..." />
                  <InputGroupAddon align="inline-start">
                    <SearchIcon />
                  </InputGroupAddon>
                  <InputGroupAddon align="inline-end">
                    <Kbd className="text-xs">⌘ K</Kbd>
                  </InputGroupAddon>
                </InputGroup>
              </div>
              <div className="flex items-center gap-5">
                <div className="relative">
                  <Bell className="h-4 w-4" />
                  <div className="bg-primary absolute -top-2 -right-2 flex size-4 items-center justify-center rounded-full text-white">
                    <span className="text-xs">3</span>
                  </div>
                </div>

                <div className="relative">
                  <MessageCircle className="h-4 w-4" />
                  <div className="bg-primary absolute -top-2 -right-2 flex size-4 items-center justify-center rounded-full text-white">
                    <span className="text-xs">3</span>
                  </div>
                </div>

                <DropdownMenu>
                  <DropdownMenuTrigger className="hover:bg-secondary flex items-center gap-2 rounded-md px-2 py-1">
                    <Avatar className="size-7">
                      <AvatarImage src="https://github.com/evilrabbit.png" alt="@evilrabbit" />
                      <AvatarFallback>ER</AvatarFallback>
                    </Avatar>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="max-w-80 min-w-60">
                    <DropdownMenuItem className="flex items-center gap-2">
                      <Avatar className="size-7">
                        <AvatarImage src="https://github.com/evilrabbit.png" alt="@evilrabbit" />
                        <AvatarFallback>ER</AvatarFallback>
                      </Avatar>

                      <div className="ml-2 min-w-0">
                        <p className="truncate text-sm font-medium">Evil Rabbit</p>
                        <p className="text-muted-foreground truncate text-xs">
                          evil.rabbit@example.com
                        </p>
                      </div>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <UserIcon /> Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <SettingsIcon /> Settings
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <LogOutIcon /> Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </header>

            {children}
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}
