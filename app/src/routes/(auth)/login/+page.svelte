<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import * as Field from '$lib/components/ui/field';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { signIn } from '$lib/remote/auth.remote';
	import { toast } from 'svelte-sonner';
	import { goto } from '$app/navigation';

	import LockIcon from '@lucide/svelte/icons/lock';
	import MailIcon from '@lucide/svelte/icons/mail';
	import EyeIcon from '@lucide/svelte/icons/eye';
	import EyeOffIcon from '@lucide/svelte/icons/eye-off';
	import Loader2Icon from '@lucide/svelte/icons/loader-2';
	import LogInIcon from '@lucide/svelte/icons/log-in';

	let showPassword = $state(false);
	let isSubmitting = $state(false);

	const fieldId = $props.id();

	function togglePasswordVisibility() {
		showPassword = !showPassword;
	}
</script>

<svelte:head>
	<title>Log In - Jengka Oil Palm</title>
</svelte:head>

<div class="flex min-h-screen items-center justify-center bg-muted/40 px-4 py-12 sm:px-6 lg:px-8">
	<div class="w-full max-w-md space-y-6">
		<div class="flex flex-col items-center text-center">
			<!-- <div class="flex size-12 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-md">
				<Building2Icon class="size-6" />
			</div> -->
			<h1 class="mt-4 text-2xl font-bold tracking-tight">Jengka Oil Palm</h1>
		</div>

		<!-- Card Container -->
		<Card.Root class="border shadow-lg">

			<Card.Content>
                <form
                    {...signIn.enhance(async (form) => {
                        isSubmitting = true;
                        try {
                            const res = await form.submit();
                            if (res) {
                                toast.success('Signed in successfully!');
                                goto('/', { invalidateAll: true });
                            } else {
                                toast.error('Invalid credentials, please check your email and password.');
                            }
                        } catch (error) {
                            toast.error(
                                error instanceof Error ? error.message : 'Login failed. Please try again.'
                            );
                        } finally {
                            isSubmitting = false;
                        }
                    })}
                    class="space-y-4"
                >
                    <Field.Group>
                        <!-- Email Field -->
                        <Field.Field>
                            <Field.Label for={`${fieldId}-signin-email`}>Email address</Field.Label>
                            <div class="relative">
                                <MailIcon class="absolute left-3 top-2.5 size-4 text-muted-foreground" />
                                <Input
                                    id={`${fieldId}-signin-email`}
                                    placeholder="user@example.com"
                                    autocomplete="email"
                                    class="pl-9"
                                    {...signIn.fields.email.as('email')}
                                />
                            </div>
                            {#each signIn.fields.email.issues() as issue}
                                <Field.Error>{issue.message}</Field.Error>
                            {/each}
                        </Field.Field>

                        <!-- Password Field -->
                        <Field.Field>
                            <Field.Label for={`${fieldId}-signin-password`}>Password</Field.Label>
                            <div class="relative">
                                <LockIcon class="absolute left-3 top-2.5 size-4 text-muted-foreground" />
                                <Input
                                    id={`${fieldId}-signin-password`}
                                    placeholder="••••••••"
                                    autocomplete="current-password"
                                    class="pl-9 pr-10"
                                    {...signIn.fields.password.as(showPassword ? 'text' : 'password')}
                                />
                                <button
                                    type="button"
                                    onclick={togglePasswordVisibility}
                                    class="absolute right-3 top-2.5 text-muted-foreground transition hover:text-foreground"
                                    tabindex="-1"
                                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                                >
                                    {#if showPassword}
                                        <EyeOffIcon class="size-4" />
                                    {:else}
                                        <EyeIcon class="size-4" />
                                    {/if}
                                </button>
                            </div>
                            {#each signIn.fields.password.issues() as issue}
                                <Field.Error>{issue.message}</Field.Error>
                            {/each}
                        </Field.Field>

                        <!-- <Field.Separator /> -->

                        <Button type="submit" class="w-full" disabled={isSubmitting}>
                            {#if isSubmitting}
                                <Loader2Icon class="mr-2 size-4 animate-spin" />
                                <span>Signing in...</span>
                            {:else}
                                <LogInIcon class="mr-2 size-4" />
                                <span>Sign In</span>
                            {/if}
                        </Button>
                    </Field.Group>
                </form>
			</Card.Content>
		</Card.Root>
	</div>
</div>