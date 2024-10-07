'use client';

import { Button } from "@/components/ui/button";
import { NavigationMenu as NavigationMenuBase, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, navigationMenuTriggerStyle } from "@/components/ui/navigation-menu";
import Link from "next/link";
import { GitHubLogoIcon } from "@radix-ui/react-icons";
import { SettingsDropdown } from "./settingsDropdown";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import logoDark from "../../public/sb_logo_dark_small.png";
import logoLight from "../../public/sb_logo_light_small.png";
import { useRouter } from "next/navigation";

const SOURCEBOT_GITHUB_URL = "https://github.com/sourcebot-dev/sourcebot";

export const NavigationMenu = () => {
    const router = useRouter();

    return (
        <div className="flex flex-col w-screen h-fit">
                <div className="flex flex-row justify-between items-center py-1.5 px-3">
                    <div className="flex flex-row items-center">
                        <div
                            className="mr-3 cursor-pointer"
                            onClick={() => {
                                router.push("/");
                            }}
                        >
                            <Image
                                src={logoDark}
                                className="h-11 w-auto hidden dark:block"
                                alt={"Sourcebot logo"}
                                priority={true}
                            />
                            <Image
                                src={logoLight}
                                className="h-11 w-auto block dark:hidden"
                                alt={"Sourcebot logo"}
                                priority={true}
                            />
                        </div>

                        <NavigationMenuBase>
                            <NavigationMenuList>
                                <NavigationMenuItem>
                                    <Link href="/" legacyBehavior passHref>
                                        <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                                            Search
                                        </NavigationMenuLink>
                                    </Link>
                                </NavigationMenuItem>
                                <NavigationMenuItem>
                                    <Link href="/repos" legacyBehavior passHref>
                                        <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                                            Repositories
                                        </NavigationMenuLink>
                                    </Link>
                                </NavigationMenuItem>
                            </NavigationMenuList>
                        </NavigationMenuBase>
                    </div>

                    <div className="flex flex-row items-center gap-2">
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={() => {
                                window.open(SOURCEBOT_GITHUB_URL, "_blank");
                            }}
                        >
                            <GitHubLogoIcon className="w-4 h-4" />
                        </Button>
                        <SettingsDropdown />
                    </div>
                </div>
                <Separator />
            </div>


    )
}