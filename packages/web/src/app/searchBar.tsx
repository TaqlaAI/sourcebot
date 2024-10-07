'use client';

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { cn, createPathWithQueryParams } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { cva } from "class-variance-authority";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useHotkeys } from 'react-hotkeys-hook'
import { useRef } from "react";
import { SearchQueryParams } from "@/lib/types";

interface SearchBarProps {
    className?: string;
    size?: "default" | "sm";
    defaultQuery?: string;
    autoFocus?: boolean;
}

const formSchema = z.object({
    query: z.string(),
});

const searchBarVariants = cva(
    "w-full",
    {
        variants: {
            size: {
                default: "h-10",
                sm: "h-8"
            }
        },
        defaultVariants: {
            size: "default",
        }
    }
)

export const SearchBar = ({
    className,
    size,
    defaultQuery,
    autoFocus,
}: SearchBarProps) => {

    const inputRef = useRef<HTMLInputElement>(null);
    useHotkeys('/', (event) => {
        event.preventDefault();
        inputRef.current?.focus();
    });

    const router = useRouter();
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            query: defaultQuery ?? "",
        }
    });

    const onSubmit = (values: z.infer<typeof formSchema>) => {
        const url = createPathWithQueryParams('/search',
            [SearchQueryParams.query, values.query],
        )
        router.push(url);
    }

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="w-full"
            >
                <FormField
                    control={form.control}
                    name="query"
                    render={( { field }) => (
                        <FormItem>
                            <FormControl>
                                <Input
                                    placeholder="Search..."
                                    className={cn(searchBarVariants({ size, className }))}
                                    {...field}
                                    ref={inputRef}
                                    autoFocus={autoFocus ?? false}
                                    // This is needed to prevent mobile browsers from zooming in when the input is focused
                                    style={{ fontSize: '1rem' }}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </form>
        </Form>
    )
}