import { listRepositories } from "@/lib/server/searchService";
import { isServiceError } from "@/lib/utils";
import Image from "next/image";
import { Suspense } from "react";
import logoDark from "../../public/sb_logo_dark_large.png";
import logoLight from "../../public/sb_logo_light_large.png";
import { NavigationMenu } from "./navigationMenu";
import { RepositoryCarousel } from "./repositoryCarousel";
import { SearchBar } from "./searchBar";
import { Separator } from "@/components/ui/separator";
import { SymbolIcon } from "@radix-ui/react-icons";


export default async function Home() {
    return (
        <div className="flex flex-col items-center overflow-hidden">
            {/* TopBar */}
            <NavigationMenu />

            <div className="flex flex-col justify-center items-center mt-8 mb-8 md:mt-18 max-w-[90%]">
                <div className="max-h-44 w-auto">
                    <Image
                        src={logoDark}
                        className="h-18 md:h-40 w-auto hidden dark:block"
                        alt={"Sourcebot logo"}
                        priority={true}
                    />
                    <Image
                        src={logoLight}
                        className="h-18 md:h-40 w-auto block dark:hidden"
                        alt={"Sourcebot logo"}
                        priority={true}
                    />
                </div>
                <div className="w-full flex flex-row mt-4">
                    <SearchBar
                        autoFocus={true}
                    />
                </div>
                <div className="mt-8">
                    <Suspense fallback={<div>...</div>}>
                        <RepositoryList />
                    </Suspense>
                </div>
                <Separator className="mt-5 mb-8" />
                <div className="flex flex-col items-center w-fit gap-6">
                    <span className="font-semibold">How to search</span>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <HowToSection
                            title="Search in files or paths"
                        >
                            <QueryExample>
                                <Query query="test todo">test todo</Query> <QueryExplanation>(both test and todo)</QueryExplanation>
                            </QueryExample>
                            <QueryExample>
                                <Query query="test or todo">test <Highlight>or</Highlight> todo</Query> <QueryExplanation>(either test or todo)</QueryExplanation>
                            </QueryExample>
                            <QueryExample>
                                <Query query={`"exit boot"`}>{`"exit boot"`}</Query> <QueryExplanation>(exact match)</QueryExplanation>
                            </QueryExample>
                            <QueryExample>
                                <Query query="TODO case:yes">TODO <Highlight>case:</Highlight>yes</Query> <QueryExplanation>(case sensitive)</QueryExplanation>
                            </QueryExample>
                        </HowToSection>
                        <HowToSection
                            title="Filter results"
                        >
                            <QueryExample>
                                <Query query="file:README setup"><Highlight>file:</Highlight>README setup</Query> <QueryExplanation>(by filename)</QueryExplanation>
                            </QueryExample>
                            <QueryExample>
                                <Query query="repo:torvalds/linux test"><Highlight>repo:</Highlight>torvalds/linux test</Query> <QueryExplanation>(by repo)</QueryExplanation>
                            </QueryExample>
                            <QueryExample>
                                <Query query="lang:typescript"><Highlight>lang:</Highlight>typescript</Query> <QueryExplanation>(by language)</QueryExplanation>
                            </QueryExample>
                            <QueryExample>
                                <Query query="branch:HEAD"><Highlight>branch:</Highlight>HEAD</Query> <QueryExplanation>(by branch)</QueryExplanation>
                            </QueryExample>
                        </HowToSection>
                        <HowToSection
                            title="Advanced"
                        >
                            <QueryExample>
                                <Query query="file:\.py$"><Highlight>file:</Highlight>{`\\.py$`}</Query> <QueryExplanation>{`(files that end in ".py")`}</QueryExplanation>
                            </QueryExample>
                            <QueryExample>
                                <Query query="sym:main"><Highlight>sym:</Highlight>main</Query> <QueryExplanation>{`(symbols named "main")`}</QueryExplanation>
                            </QueryExample>
                            <QueryExample>
                                <Query query="todo -lang:c">todo <Highlight>-lang:c</Highlight></Query> <QueryExplanation>(negate filter)</QueryExplanation>
                            </QueryExample>
                            <QueryExample>
                                <Query query="content:README"><Highlight>content:</Highlight>README</Query> <QueryExplanation>(search content only)</QueryExplanation>
                            </QueryExample>
                        </HowToSection>
                    </div>
                </div>
            </div>
        </div>
    )
}

const RepositoryList = async () => {
    const _repos = await listRepositories();

    if (isServiceError(_repos)) {
        return null;
    }

    const repos = _repos.List.Repos.map((repo) => repo.Repository);

    if (repos.length === 0) {
        return (
            <div className="flex flex-row items-center gap-3">
                <SymbolIcon className="h-4 w-4 animate-spin" />
                <span className="text-sm">indexing in progress...</span>
            </div>
        )
    }

    return (
        <div className="flex flex-col items-center gap-3">
            <span className="text-sm">
                {`Search ${repos.length} `}
                <a
                    href="/repos"
                    className="text-blue-500"
                >
                    {repos.length > 1 ? 'repositories' : 'repository'}
                </a>
            </span>
            <RepositoryCarousel repos={repos} />
        </div>
    )
}

const HowToSection = ({ title, children }: { title: string, children: React.ReactNode }) => {
    return (
        <div className="flex flex-col gap-1">
            <span className="dark:text-gray-300 text-sm mb-2 underline">{title}</span>
            {children}
        </div>
    )

}

const Highlight = ({ children }: { children: React.ReactNode }) => {
    return (
        <span className="text-blue-700 dark:text-blue-500">
            {children}
        </span>
    )
}

const QueryExample = ({ children }: { children: React.ReactNode }) => {
    return (
        <span className="text-sm font-mono">
            {children}
        </span>
    )
}

const QueryExplanation = ({ children }: { children: React.ReactNode }) => {
    return (
        <span className="text-gray-500 dark:text-gray-400 ml-3">
            {children}
        </span>
    )
}

const Query = ({ query, children }: { query: string, children: React.ReactNode }) => {
    return (
        <a
            href={`/search?query=${query}`}
            className="cursor-pointer hover:underline"
        >
            {children}
        </a>
    )
}
